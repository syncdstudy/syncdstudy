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
  const { id, email, password, firstName, lastName, year, major } = await req.json();

  console.log('📦 Received body:', {
    id, email, password, firstName, lastName, year, major,
  });

  if (!id || !email || !password || !firstName || !lastName || !year) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10); // ✅ Move this up!

  console.log('🔍 Checking for existing user with:', { id, email });

  const { data: existingUser } = await supabase
    .from('app_users')
    .select('id')
    .or(`id.eq.${id},email.eq.${email}`)
    .maybeSingle();

  console.log('👀 existingUser =', existingUser);

  if (existingUser) {
    console.log('✏️ User exists — updating missing fields');
    const { error: updateError } = await supabase.from('app_users')
      .update({
        first_name: firstName,
        last_name: lastName,
        year,
        major,
        password: hashedPassword,
      })
      .eq('id', id);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ id });
  }

  const { error: insertError } = await supabase.from('app_users').insert([
    {
      id,
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      year,
      major,
    },
  ]);

  console.log('📤 Inserting row:', {
    id, email, password: hashedPassword, first_name: firstName, last_name: lastName, year, major,
  });

  if (insertError) {
    console.error('❌ Insert error:', insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ id });
}
