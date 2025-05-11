/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role needed for inserting users
);

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  }

  // Hash password
  const hashedPassword = await hash(password, 10);

  // Insert user
  const { error } = await supabase.from('users').insert([
    {
      email,
      password: hashedPassword,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User registered successfully' });
}
