'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

// eslint-disable-next-line import/prefer-default-export
export function useRedirectIfUnauthorized(adminOnly = false) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      console.log('🔍 Running useRedirectIfUnauthorized...');

      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Supabase user:', user);

      if (!user) {
        console.log('❌ No user. Redirecting...');
        router.replace('/auth/signin');
        return;
      }

      if (adminOnly) {
        if (typeof window !== 'undefined') {
          const isAdmin = localStorage.getItem('isAdmin');
          console.log('🛂 isAdmin flag:', isAdmin);
          if (isAdmin !== 'true') {
            console.log('❌ Not admin. Redirecting...');
            router.replace('/auth/signin');
            return;
          }
        }
      }

      console.log('✅ Access granted.');
      setChecking(false);
    }

    checkAccess();
  }, [adminOnly, router]);

  return checking;
}
