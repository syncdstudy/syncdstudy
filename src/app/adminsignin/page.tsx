'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function AdminSignInPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      router.push('/admin'); // or your actual admin dashboard route
    } else {
      setError('Invalid admin password.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('/images/uhm-study-group.jpg')", // use your actual image path
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
          <h4 className="text-center mb-2">🔒 Admin Portal</h4>
          <p className="text-muted text-center mb-3" style={{ fontSize: '0.9rem' }}>
            Restricted access for authorized personnel only.
          </p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="adminPassword">
            <Form.Control
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            className="w-100 mt-3"
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
