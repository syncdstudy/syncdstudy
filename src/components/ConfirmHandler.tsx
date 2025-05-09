'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// eslint-disable-next-line import/extensions
import supabase from '@/lib/supabaseClient';

export default function ConfirmHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const confirmAndLogin = async () => {
      if (!code) return;

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Login failed after confirmation:', error.message);
        return;
      }

      router.push('/calendar');
    };

    confirmAndLogin();
  }, [code, router]);

  return null;
}
