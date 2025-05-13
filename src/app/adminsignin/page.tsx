'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabaseClient';

export default function AdminSignInPage() {
  const [email, setEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');

    if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setError('Invalid admin password.');
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: userPassword,
    });

    if (signInError) {
      console.error('❌ Supabase login failed:', signInError.message);
      setError('Invalid email or password.');
      return;
    }

    localStorage.setItem('isAdmin', 'true');
    setTimeout(() => router.push('/admin'), 100);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('/images/uhm-study-group.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className="p-4 shadow-lg"
          style={{
            width: '350px',
            borderRadius: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <h4 className="text-center mb-2">🔐 Admin Login</h4>
          <p className="text-muted text-center mb-3" style={{ fontSize: '0.9rem' }}>
            Sign in with your email and the admin password.
          </p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-2">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              type="password"
              placeholder="Your password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            className="w-100"
            style={{ backgroundColor: '#c9a0ff', border: 'none' }}
            onClick={handleSubmit}
          >
            Enter
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
