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

  const { name, date, time, location, mode, description, creator_id } = body;

  if (!creator_id || creator_id.length < 10) {
    console.error('❌ Invalid creator_id:', creator_id);
    return NextResponse.json({ error: 'Invalid creator_id' }, { status: 400 });
  }

  // Insert into StudySession table
  const { error: insertSessionError } = await supabase.from('StudySession').insert([
    { name, date, time, location, mode, description, creator_id },
  ]);

  if (insertSessionError) {
    console.error('❌ Insert error in StudySession:', insertSessionError);
    return NextResponse.json({ error: 'Failed to insert session' }, { status: 500 });
  }

  // Parse time into actual start and end DateTimes
  const [startTime, endTime] = time.split('–').map((t: string) => t.trim());
  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);

  console.log('🧾 Inserting into calendar_events:', {
    title: name,
    start,
    end,
    description,
    location,
    mode,
    user_id: creator_id,
  });

  // Insert into calendar_events table
  const { error: calendarError } = await supabase.from('calendar_events').insert([
    {
      title: name,
      start,
      end,
      description,
      location,
      mode,
      user_id: creator_id,
    },
  ]);

  if (calendarError) {
    console.error('❌ Insert error in calendar_events:', calendarError);
    return NextResponse.json({ error: 'Failed to sync with calendar' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Session and calendar event added successfully' });
}
