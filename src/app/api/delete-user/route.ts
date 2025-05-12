import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }
  console.log('Deleting user with ID:', id);
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    console.error('Supabase deletion error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
