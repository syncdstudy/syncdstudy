import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error('Failed to fetch auth users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const simplified = data.users.map((user) => ({
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  }));

  return NextResponse.json(simplified);
}
