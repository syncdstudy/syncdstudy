/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { data: existingUser } = await supabase
    .from('app_users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  }

  const hashedPassword = await hash(password, 10);

  const { error: insertError } = await supabase.from('app_users').insert([
    {
      email,
      password: hashedPassword,
    },
  ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // ✅ Insert into activitylog table
  const { error: logError } = await supabase.from('activitylog').insert([
    {
      type: 'user_signup',
      message: `New user: ${email}`,
    },
  ]);

  if (logError) {
    console.error('Activity logging failed:', logError);
  }

  return NextResponse.json({ message: 'User registered successfully' });
}
