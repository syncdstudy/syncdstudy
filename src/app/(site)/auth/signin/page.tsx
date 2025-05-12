/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-one-expression-per-line */

'use client';

import { useState } from 'react';
import {
  Card,
  Col,
  Container,
  Button,
  Form,
  Row,
  InputGroup,
} from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import supabase from '@/lib/supabaseClient';

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = `${target.email.value}@hawaii.edu`;
    const password = target.password.value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message || 'Invalid credentials');
      return;
    }

    setError('');
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('username', email.split('@')[0]);
    window.location.href = '/calendar';
  };
  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        paddingTop: '2rem',
        paddingBottom: '3rem',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: '1.5rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <Card.Body className="p-5">
                  <h4 className="text-center mb-2" style={{ fontWeight: 500, fontSize: '1.9rem' }}>
                    👋 Welcome back!
                  </h4>
                  <p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                    Please sign in to continue to your sessions
                  </p>

                  {error && (
                    <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                      {error}
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label>UH Username</Form.Label>
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

                    <div className="text-end mb-3">
                      <a href="/auth/reset-password" style={{ fontSize: '0.9rem' }}>
                        Forgot password?
                      </a>
                    </div>

                    <Form.Group className="form-group d-grid">
                      <Button
                        type="submit"
                        className="rounded-pill w-100"
                        style={{
                          backgroundColor: '#b295f8',
                          color: 'white',
                          border: 'none',
                        }}
                      >
                        Sign In
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
                <Card.Footer className="text-center bg-transparent border-0 pt-0">
                  Don’t have an account? <a href="/auth/signup">Sign up</a>
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
