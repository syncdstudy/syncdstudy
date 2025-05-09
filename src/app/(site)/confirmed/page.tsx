import dynamic from 'next/dynamic';

const ConfirmHandler = dynamic(() => import('@/components/ConfirmHandler'), { ssr: false });

export default function ConfirmedPage() {
  return (
    <main style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Confirming your account...</h2>
      <p>
        If you&apos;re not redirected soon, click
        <br />
        <a href="/calendar">here</a>
      </p>
      <ConfirmHandler />
    </main>
  );
}
