/* eslint-disable import/prefer-default-export */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export function useRequireAuth() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth/signin');
      } else {
        setChecking(false);
      }
    }
    verify();
  }, [router]);

  return checking;
}
