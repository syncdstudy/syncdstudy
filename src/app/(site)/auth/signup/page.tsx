/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */

'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import { Card, Col, Container, Button, Form, Row, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('UH username is required')
      .matches(/^[a-zA-Z0-9._-]+$/, 'Invalid UH username'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]+$/,
        'Password must include at least one letter and one number',
      ),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const username = watch('email');
  const fullEmail = username ? `${username}@hawaii.edu` : '';

  const onSubmit = async (formData: SignUpForm) => {
    const fullEmail = `${formData.email}@hawaii.edu`;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: fullEmail,
          password: formData.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Something went wrong');
      } else {
        router.push('/auth/confirmation');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register. Please try again later.');
    }
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} md={6} lg={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-center mb-4">Sign Up</h1>
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
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* UH Username */}
                    <Form.Group className="form-group mb-3">
                      <Form.Label>Username</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Enter UH username"
                          {...register('email')}
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        />
                        <InputGroup.Text>@hawaii.edu</InputGroup.Text>
                      </InputGroup>
                      <div className="invalid-feedback">{errors.email?.message}</div>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group className="form-group mb-3">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          {...register('password')}
                          className={`Form-control ${errors.password ? 'is-invalid' : ''}`}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                      <div className="invalid-feedback">{errors.password?.message}</div>
                    </Form.Group>

                    {/* Confirm Password */}
                    <Form.Group className="form-group mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirm ? 'text' : 'password'}
                          {...register('confirmPassword')}
                          className={`Form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowConfirm(!showConfirm)}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                      <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                    </Form.Group>

                    {/* Buttons */}
                    <Form.Group className="form-group">
                      <Row>
                        <Col className="d-grid">
                          <Button
                            type="submit"
                            className="rounded-pill w-100"
                            style={{
                              backgroundColor: '#9c88ff',
                              color: 'white',
                              border: 'none',
                            }}
                          >
                            Register
                          </Button>
                        </Col>
                        <Col className="d-grid">
                          <Button
                            type="button"
                            onClick={() => reset()}
                            className="rounded-pill w-100 mt-2 mt-md-0"
                            style={{
                              backgroundColor: '#e0d7f3',
                              color: '#4a4a4a',
                              border: 'none',
                            }}
                          >
                            Reset
                          </Button>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Form>
                </Card.Body>
                <Card.Footer className="text-center bg-transparent border-0 pt-0">
                  Already have an account?
                  {' '}
                  <a href="/auth/signin">Sign in</a>
                </Card.Footer>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignUp;
