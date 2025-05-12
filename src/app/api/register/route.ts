/* eslint-disable @typescript-eslint/comma-dangle */
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { id, email, password, firstName, lastName, year, major, username } = await req.json();

  console.log('📦 Received body:', {
    id, email, firstName, lastName, year, major, username
    // 🔐 Don't log raw password
  });

  if (!id || !email || !password || !firstName || !lastName || !year || !username) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  console.log('🔍 Checking for existing user with:', { id, email });

  const { data: existingUser } = await supabase
    .from('app_users')
    .select('id')
    .or(`id.eq.${id},email.eq.${email}`)
    .maybeSingle();

  if (existingUser) {
    console.log('✏️ User exists — updating fields');
    const { error: updateError } = await supabase
      .from('app_users')
      .update({
        first_name: firstName,
        last_name: lastName,
        year,
        major,
        password: hashedPassword,
        username,
      })
      .eq('id', id);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  } else {
    console.log('📤 Inserting new user row...');
    const { error: insertError } = await supabase.from('app_users').insert([
      {
        id,
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        year,
        major,
        username,
      },
    ]);

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  // ✏️ Log signup action
  const { error: logError } = await supabase.from('activitylog').insert([
    {
      type: 'user_signup',
      message: `New user: ${email}`,
    },
  ]);

  if (logError) {
    console.error('⚠️ Activity logging failed:', logError);
  }

  return NextResponse.json({ id });
}
