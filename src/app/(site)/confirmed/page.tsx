/* eslint-disable import/extensions */

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

const ConfirmedPage = () => {
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

  return (
    <main style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Confirming your account...</h2>
      <p>
        If you&apos;re not redirected soon, click
        <br />
        <a href="/calendar">here</a>
        .
      </p>
    </main>
  );
};

export default ConfirmedPage;
