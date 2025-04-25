'use client';

import { signIn } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    // Call signIn with dynamic callbackUrl
    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: email === 'admin@foo.com' ? '/admin' : '/list', // Redirect based on email
    });

    if (result?.error) {
      console.error('Sign in failed: ', result.error);
    }
  };

  return (
    <main>
      <Container fluid className="d-flex justify-content-center align-items-center vh-100">
        <Row className="info-box justify-content-center">
          <Col lg={12}>
            <h1 className="text-center">Sign In</h1>
            <Card>
              <Card.Body className="py-5">
                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail" className="text-start">
                    <Form.Label>Email</Form.Label>
                    <input name="email" type="text" className="form-control" />
                  </Form.Group>
                  <Form.Group className="text-start">
                    <Form.Label>Password</Form.Label>
                    <input name="password" type="password" className="form-control" />
                  </Form.Group>
                  <Button type="submit" className="mt-3 custom-button">
                    Signin
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer>
                Don&apos;t have an account?
                {'\u00A0'}
                <a href="/auth/signup" className="custom-link">Sign up</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
