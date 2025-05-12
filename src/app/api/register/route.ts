/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const { email, password, firstName, lastName, year, major } = await req.json();

  if (!email || !password || !firstName || !lastName || !year) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
      first_name: firstName,
      last_name: lastName,
      year,
      major: major || '', // fallback to empty string if undefined
    },
  ]);

  if (insertError) {
    console.error('Insert error:', insertError); // 👈 Add this
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

  // return NextResponse.json({ message: 'User registered successfully' });
  const { data: newUser, error: fetchError } = await supabase
    .from('app_users')
    .select('id')
    .eq('email', email)
    .single();

  if (fetchError) {
    console.error('Failed to fetch new user ID:', fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({ id: newUser.id });
}
