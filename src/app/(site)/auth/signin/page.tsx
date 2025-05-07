// In your SignIn.tsx file
'use client';

import { useState } from 'react';
import { Card, Col, Container, Button, Form, Row, InputGroup } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import supabase from '@/lib/supabaseClient';

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = `${target.email.value}@hawaii.edu`;
    const password = target.password.value;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Invalid username or password.');
    } else {
      router.push('/calendar');
    }
  };

  return (
    <main className="signin-page">
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} md={6} lg={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-center mb-4">Sign In</h1>
              <Card
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '1rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <Card.Body className="p-4">
                  {error && (
                    <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                      {error}
                    </div>
                  )}
                  <Form onSubmit={handleSubmit}>
                    {/* Username */}
                    <Form.Group className="form-group mb-3">
                      <Form.Label>Username</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="email"
                          placeholder="Enter UH username"
                          className="form-control"
                        />
                        <InputGroup.Text>@hawaii.edu</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group className="form-group mb-3">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className="form-control"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={togglePassword}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    {/* Forgot Password Link */}
                    <div className="text-end mb-3">
                      <a href="/auth/reset-password" style={{ fontSize: '0.9rem' }}>
                        Forgot password?
                      </a>
                    </div>

                    {/* Sign In Button */}
                    <Form.Group className="form-group d-grid">
                      <Button
                        type="submit"
                        className="rounded-pill w-100"
                        style={{ backgroundColor: '#b295f8', color: 'white', border: 'none' }}
                      >
                        Sign In
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
                <Card.Footer className="text-center bg-transparent border-0 pt-0">
                  Don’t have an account?
                  {' '}
                  <a href="/auth/signup">Sign up</a>
                </Card.Footer>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
