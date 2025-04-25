'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const ConfirmedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const confirmAndLogin = async () => {
      if (!code) return;

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Login failed after confirmation:', error.message);
        return;
      }

      // ✅ User is now logged in, redirect them to calendar
      router.push('/calendar');
    };

    confirmAndLogin();
  }, [code, router]);

  return (
    <main style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Confirming your account...</h2>
      <p>If you're not redirected soon, click <a href="/calendar">here</a>.</p>
    </main>
  );
};

export default ConfirmedPage;
