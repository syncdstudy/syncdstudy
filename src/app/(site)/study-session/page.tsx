// src/app/(site)/study-session/page.tsx
// NO 'use client' here — this is a server component
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import StudySessionClient from './StudySessionClient';

export default async function StudySessionPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return <StudySessionClient />;
}
