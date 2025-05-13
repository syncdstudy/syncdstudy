/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */

'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
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
import { motion } from 'framer-motion';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  year: string;
  major?: string;
};

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .required('UH username is required')
      .matches(/^[a-zA-Z0-9._-]+$/, 'Invalid UH username'),
    password: Yup.string()
      .required('Password is required')
      .min(6)
      .max(40)
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]+$/,
        'Must include at least one letter and one number',
      ),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords do not match'),
    year: Yup.string().required('Year is required'),
    major: Yup.string(),
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

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const isPasswordValid = (password: string): boolean => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{6,40}$/.test(password);

  const doPasswordsMatch = passwordValue === confirmPasswordValue && isPasswordValid(passwordValue);

  const onSubmit = async (formData: SignUpForm) => {
    const fullEmail = `${formData.email}@hawaii.edu`;
    const username = formData.email; // ✅ Add this

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: fullEmail,
        password: formData.password,
      });

      console.log('🧪 Supabase Auth result:', signUpData, signUpError);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const userId = signUpData?.user?.id;
      if (!userId) {
        setError('Could not get user ID');
        return;
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          email: fullEmail,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          year: formData.year,
          major: formData.major || '',
          username, // ✅ Pass the username here
        }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userId', result.id);
        localStorage.setItem('userEmail', fullEmail);
        localStorage.setItem('username', username); // ✅ Store for use in app

        setSuccess('🎉 Account created successfully! Redirecting...');
        setTimeout(() => router.push('/profile'), 1500);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register. Please try again later.');
    }
  };

  return (
    <main className="pt-5 pb-4 d-flex justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                className="w-100"
                style={{
                  maxWidth: '650px',
                  margin: '0 auto',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: '1.5rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <Card.Body className="p-5">
                  <h4 className="text-center mb-2" style={{ fontWeight: 500, fontSize: '1.9rem' }}>
                    🌸 Welcome to Sync’d Study!
                  </h4>
                  <p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                    Create your account to start joining and leading study sessions
                  </p>

                  {error && (
                    <div className="alert alert-danger text-center py-2 mb-3" role="alert">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success text-center py-2 mb-3" role="alert">
                      {success}
                    </div>
                  )}

                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your first name"
                        {...register('firstName')}
                        className={errors.firstName ? 'is-invalid' : ''}
                      />
                      <div className="invalid-feedback">{errors.firstName?.message}</div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your last name"
                        {...register('lastName')}
                        className={errors.lastName ? 'is-invalid' : ''}
                      />
                      <div className="invalid-feedback">{errors.lastName?.message}</div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>UH Username</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Enter UH username"
                          {...register('email')}
                          className={errors.email ? 'is-invalid' : ''}
                        />
                        <InputGroup.Text>@hawaii.edu</InputGroup.Text>
                      </InputGroup>
                      <div className="invalid-feedback">{errors.email?.message}</div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          {...register('password')}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>

                      {/* ✅ Password validation hint */}

                      {passwordValue && passwordValue.length > 0 && (
                        isPasswordValid(passwordValue) ? (
                          <Form.Text className="text-success d-block mt-1" style={{ fontSize: '0.85rem' }}>
                            ✔ Password looks good!
                          </Form.Text>
                        ) : (
                          <Form.Text className="text-danger d-block mt-1" style={{ fontSize: '0.85rem' }}>
                            × Must be at least 6 characters and include a letter + number
                          </Form.Text>
                        )
                      )}

                      <div className="invalid-feedback">{errors.password?.message}</div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirm ? 'text' : 'password'}
                          {...register('confirmPassword')}
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowConfirm(!showConfirm)}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>

                      {/* ✅ Confirm password match check */}

                      {confirmPasswordValue && confirmPasswordValue.length > 0 && (
                        doPasswordsMatch ? (
                          <Form.Text className="text-success d-block mt-1" style={{ fontSize: '0.85rem' }}>
                            ✔ Passwords match!
                          </Form.Text>
                        ) : (
                          <Form.Text className="text-danger d-block mt-1" style={{ fontSize: '0.85rem' }}>
                            × Passwords do not match
                          </Form.Text>
                        )
                      )}

                      <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Year in School</Form.Label>
                      <Form.Select {...register('year')} className={errors.year ? 'is-invalid' : ''}>
                        <option value="">Select year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </Form.Select>
                      <div className="invalid-feedback">{errors.year?.message}</div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Major (optional)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Computer Science"
                        {...register('major')}
                      />
                    </Form.Group>

                    <Row>
                      <Col className="d-grid">
                        <Button type="submit" className="rounded-pill w-100" style={{ backgroundColor: '#9c88ff', border: 'none' }}>
                          Register
                        </Button>
                      </Col>
                      <Col className="d-grid">
                        <Button type="button" onClick={() => reset()} className="rounded-pill w-100 mt-2 mt-md-0" style={{ backgroundColor: '#e0d7f3', color: '#4a4a4a', border: 'none' }}>
                          Reset
                        </Button>
                      </Col>
                    </Row>
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
