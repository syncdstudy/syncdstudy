'use client';

import { Container, Button } from 'react-bootstrap';
import Link from 'next/link';

/** The Landing Page. */
const Home = () => (
  <main>
    <Container id="landing-page" fluid className="d-flex justify-content-center align-items-center vh-100">
      <div className="info-box text-center">
        <h2>Completely Free!</h2>
        <p>Sign up within minutes</p>
        <p>Instant access to study groups for over 10 subjects</p>
        <p>Connect with students around campus</p>
        <p>Entirely personalized experience</p>
        <Link href="/auth/signup" passHref>
          <Button variant="dark">Sign Up Now</Button>
        </Link>
      </div>
    </Container>
  </main>
);

export default Home;
