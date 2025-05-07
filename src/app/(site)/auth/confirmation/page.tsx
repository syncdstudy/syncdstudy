export default function ConfirmationPage() {
  return (
    <main
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '70vh', padding: '2rem' }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '600px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 className="mb-3">🎉 Thank You for Signing Up at Sync&#39;d!</h1>
        <p className="lead">
          We’ve sent a confirmation email to your
          {' '}
          <strong>@hawaii.edu</strong>
          {' '}
          address.
          <br />
          Please check your inbox and click the link to activate your account.
        </p>
      </div>
    </main>
  );
}
