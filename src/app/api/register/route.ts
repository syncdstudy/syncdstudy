/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  // ① include username in the destructure
  const { email, password, firstName, lastName, year, major, username } = await req.json();

  // ② validate username as well
  if (!email || !password || !firstName || !lastName || !year || !username) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  // ✅ Update the user that was inserted by the auth trigger,
  //    now also writing the new username
  const { error: updateError } = await supabase
    .from('app_users')
    .update({
      username, // ← new field
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      year,
      major: major || '',
    })
    .eq('email', email);

  if (updateError) {
    console.error('Update error:', updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // ✅ Log the signup action
  const { error: logError } = await supabase.from('activitylog').insert([
    {
      type: 'user_signup',
      message: `New user: ${email}`,
    },
  ]);

  if (logError) {
    console.error('Activity logging failed:', logError);
  }

  // ✅ Return the new user's ID (and optionally username if you like)
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
