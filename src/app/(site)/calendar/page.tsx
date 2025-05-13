// NOTE: **no** 'use client' here—this is an App‑Router server component
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import CalendarClient from './calendarClient';

export default async function CalendarPage() {
  // create a Supabase client bound to the incoming cookies:
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // if there is no session, send them to signin (with no React ever loading)
  if (!session) {
    redirect('/auth/signin');
  }

  // otherwise, render the client‑side calendar
  return <CalendarClient />;
}
