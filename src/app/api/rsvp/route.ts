/* eslint-disable @typescript-eslint/naming-convention */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const { user_id, session_id } = await req.json();

  const { error } = await supabase
    .from('participants')
    .insert({ user_id, session_id });

  if (error) {
    console.error('Join error:', error);
    return NextResponse.json({ error: 'Failed to join' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Joined successfully' });
}

export async function DELETE(req: Request) {
  const { user_id, session_id } = await req.json();

  const { error } = await supabase
    .from('participants')
    .delete()
    .match({ user_id, session_id });

  if (error) {
    console.error('Leave error:', error);
    return NextResponse.json({ error: 'Failed to leave' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Left successfully' });
}
