/* eslint-disable prefer-template */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// eslint-disable-next-line import/prefer-default-export
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD

  // 1) Fetch sessions not created by this user and not in the past
  const { data: sessions, error: sessionError } = await supabaseAdmin
    .from('StudySession')
    .select('id, name, creator_id, date, time, description, location, mode')
    .neq('creator_id', userId)
    .gte('date', today); // only today or future sessions

  if (sessionError || !sessions) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }

  // 2) Fetch sessions user already joined
  const { data: joinedSessions, error: joinedError } = await supabaseAdmin
    .from('participants')
    .select('session_id')
    .eq('user_id', userId);

  if (joinedError) {
    console.error('Error fetching joined sessions:', joinedError);
    return NextResponse.json({ error: 'Failed to check participation' }, { status: 500 });
  }

  const joinedIds = new Set(joinedSessions.map((p) => p.session_id));

  // 3) Filter out already-joined sessions
  const filteredSessions = sessions.filter((s) => !joinedIds.has(s.id));

  // 4) Get creator usernames
  const creatorIds = Array.from(new Set(filteredSessions.map((s) => s.creator_id)));
  const { data: users, error: userError } = await supabaseAdmin
    .from('app_users')
    .select('id, first_name, last_name')
    .in('id', creatorIds);

  if (userError || !users) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  const userMap = users.reduce<Record<string, string>>((acc, u) => {
    const first = u.first_name?.trim() || '';
    const lastInitial = u.last_name?.trim()?.[0]?.toUpperCase() || '';
    acc[u.id] = `${first} ${lastInitial ? lastInitial + '.' : ''}`.trim();
    return acc;
  }, {});

  // ✅ 5) Build final payload with NO date conversion
  const invites = filteredSessions.map((s) => {
    const shortName = userMap[s.creator_id] || 'Someone';

    return {
      id: s.id,
      name: s.name,
      date: s.date,
      time: s.time,
      description: s.description,
      location: s.location,
      mode: s.mode,
      creatorUsername: shortName,
    };
  });

  return NextResponse.json(invites);
}
