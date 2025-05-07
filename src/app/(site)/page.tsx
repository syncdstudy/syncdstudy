'use client';

import { Container, Button, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'framer-motion';


const Home = () => (
  <main>
    {/* Hero Section */}
    <Container
      id="landing-page"
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="info-box text-center">
  <h2>Completely Free!</h2>
  <p>Sign up within minutes</p>
  <p>Instant access to study groups for over 10 subjects</p>
  <p>Connect with students around campus</p>
  <p>Entirely personalized experience</p>
  <Link href="/auth/signup" passHref>
  <Button className="custom-signup-button">Sign Up Now</Button>
</Link>
</div>

    </Container>

    {/* Animated Info Section */}
    <Container fluid className="py-5" style={{ backgroundColor: 'rgba(194, 153, 197, 0.95)' }}>
      <motion.h3
        className="text-center text-white mb-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Join Our Community for Your Path to Success
      </motion.h3>

      <Row className="justify-content-center text-center">

        {/* How It Works */}
        <Col
          as={motion.div}
          md={3}
          className="mx-3 my-2 p-4 rounded shadow-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/howitworks" passHref className="custom-link-1">
            <h5 className="fw-bold text-dark mb-2">How It Works</h5>
          </Link>
          <p className="text-muted mb-0">Choose your subjects, customize your preferences, and join or host study sessions with ease.</p>
        </Col>

        {/* Locations on Campus */}
        <Col
          as={motion.div}
          md={3}
          className="mx-3 my-2 p-4 rounded shadow-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/locations" passHref className="custom-link-1">
            <h5 className="fw-bold text-dark mb-2">Locations on Campus</h5>
          </Link>
          <p className="text-muted mb-0">Study in quiet locations like Hamilton, Sinclair, and QLC — all at UH Mānoa.</p>
        </Col>

        {/* About */}
        <Col
          as={motion.div}
          md={3}
          className="mx-3 my-2 p-4 rounded shadow-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/about" passHref className="custom-link-1">
            <h5 className="fw-bold text-dark mb-2">About Sync’d Study</h5>
          </Link>
          <p className="text-muted mb-0">Built by UH students to support collaboration and meaningful in-person learning.</p>
        </Col>

      </Row>
    </Container>
  </main>
);

export default Home;
