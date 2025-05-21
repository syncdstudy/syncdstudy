/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable prefer-const */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/naming-convention */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const body = await req.json();
  console.log('📦 Incoming session body:', body);

  let { name, date, time, location, mode, description, creator_id } = body;

  if (!creator_id || creator_id.length < 10) {
    console.error('❌ Invalid creator_id:', creator_id);
    return NextResponse.json({ error: 'Invalid creator_id' }, { status: 400 });
  }

  // 🕒 Get today in HST with cleared time
  const hstNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));
  hstNow.setHours(0, 0, 0, 0);

  // 🗓️ Parse incoming date as HST
  const hstSessionDate = new Date(`${date}T00:00:00-10:00`); // force to HST midnight

  console.log('🧭 Date check →', {
    hstNow: hstNow.toISOString(),
    hstSessionDate: hstSessionDate.toISOString()
  });

  if (hstSessionDate < hstNow) {
    return NextResponse.json({ error: 'Only sessions from today or later are allowed.' }, { status: 400 });
  }

  const { data: sessionData, error: insertSessionError } = await supabase
    .from('StudySession')
    .insert([{ name, date, time, location, mode, description, creator_id }])
    .select()
    .single();

  if (sessionData && creator_id) {
    const { count } = await supabase
      .from('StudySession')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creator_id);

    await supabase
      .from('app_users')
      .update({ sessions_hosted: count || 0 })
      .eq('id', creator_id);
  }

  if (insertSessionError || !sessionData) {
    console.error('❌ Insert error in StudySession:', insertSessionError);
    return NextResponse.json({ error: 'Failed to insert session' }, { status: 500 });
  }

  if (creator_id) {
    const { count } = await supabase
      .from('StudySession')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creator_id);

    await supabase
      .from('app_users')
      .update({ sessions_hosted: count || 0 })
      .eq('id', creator_id);
  }

  console.log('✅ Inserted session:', sessionData);

  return NextResponse.json({ message: 'Study session created successfully' });
}
