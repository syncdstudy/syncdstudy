'use client';

import { signOut } from 'next-auth/react';
import { Button, Col, Row, Container } from 'react-bootstrap';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <Container fluid className="d-flex justify-content-center align-items-center vh-100">
    <Row className="info-box justify-content-center">
      <Col id="signout-page" className="text-center py-3">
        <h2>Do you want to sign out?</h2>
        <Row>
          <Col xs={4} />
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button className="custom-button-1" onClick={() => signOut({ callbackUrl: '/', redirect: true })}>
              Sign Out
            </Button>
            <Button className="custom-button-3" href="/">
              Cancel
            </Button>
          </div>
          <Col xs={4} />
        </Row>
      </Col>
    </Row>
  </Container>
);

export default SignOut;
