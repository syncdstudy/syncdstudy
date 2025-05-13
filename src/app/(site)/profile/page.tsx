// src/app/(site)/profile/page.tsx
// No "use client" here—this runs on the server
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return <ProfileClient />;
}
