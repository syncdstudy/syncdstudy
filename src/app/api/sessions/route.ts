/* eslint-disable @typescript-eslint/naming-convention */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// POST: Add a new session
export async function POST(req: Request) {
  const body = await req.json();
  console.log('📦 Incoming session body:', body); // ✅ Add this

  const { name, date, time, location, mode, description, creator_id } = body;

  // Quick check if creator_id is missing or malformed
  if (!creator_id || creator_id.length < 10) {
    console.error('❌ Invalid creator_id:', creator_id);
    return NextResponse.json({ error: 'Invalid creator_id' }, { status: 400 });
  }

  const { error } = await supabase.from('StudySession').insert([
    { name, date, time, location, mode, description, creator_id },
  ]);

  if (error) {
    console.error('❌ Insert error:', error); // ✅ This will give us the real Supabase error
    return NextResponse.json({ error: 'Failed to insert session' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Session added successfully' });
}

// GET: Fetch sessions
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const excludeUserId = searchParams.get('excludeUserId');

  let query = supabase.from('StudySession').select('*');

  if (userId) {
    query = query.eq('creator_id', userId);
  } else if (excludeUserId) {
    query = query.neq('creator_id', excludeUserId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }

  return NextResponse.json(data);
}
