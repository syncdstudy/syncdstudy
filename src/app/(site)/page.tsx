'use client';

import { Container, Button, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaListAlt, FaUsers, FaStar, FaComments } from 'react-icons/fa';

const Home = () => (
  <main>
    {/* Hero Section */}
    <Container
      id="landing-page"
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100px' }}
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

    {/* App Highlights Section */}
    <Container fluid className="py-5" style={{ backgroundColor: 'rgb(228, 215, 247, 0.8)' }}>
      <motion.h3
        className="text-center mb-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Discover Sync&apos;d Study Features
      </motion.h3>

      <Row className="justify-content-center text-center">
        <Col
          as={motion.div}
          md={3}
          className="mx-3 my-2 p-4 rounded-xl shadow-sm bg-white bg-opacity-90
                     hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <FaCheckCircle className="text-4xl text-purple-700 mb-3" />
          <h5 className="fw-bold text-dark mb-2">Organized Study Sessions</h5>
          <p className="text-muted">Create and join sessions with peers for better focus and collaboration.</p>
        </Col>

        <Col
          as={motion.div}
          md={3}
          className="mx-3 my-2 p-4 rounded-xl shadow-sm bg-white bg-opacity-90
                     hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FaListAlt className="text-4xl text-purple-700 mb-3" />
          <h5 className="fw-bold text-dark mb-2">Course Directory</h5>
          <p className="text-muted">Find and connect with classmates in your courses easily.</p>
        </Col>

        <Col
          as={motion.div}
          md={3}
          className="mx-3 my-2 p-4 rounded-xl shadow-sm bg-white bg-opacity-90
                     hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FaUsers className="text-4xl text-purple-700 mb-3" />
          <h5 className="fw-bold text-dark mb-2">Peer Support</h5>
          <p className="text-muted">Build connections and support each other in your academic journey.</p>
        </Col>

        <Col
          as={motion.div}
          md={3}
          className="mx-3 my-2 p-4 rounded-xl shadow-sm bg-white bg-opacity-90
                     hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <FaStar className="text-4xl text-purple-700 mb-3" />
          <h5 className="fw-bold text-dark mb-2">Track Your Progress</h5>
          <p className="text-muted">Monitor your study habits and reach your academic goals.</p>
        </Col>

        <Col
          as={motion.div}
          md={3}
          className="mx-3 my-2 p-4 rounded-xl shadow-sm bg-white bg-opacity-90
                     hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <FaComments className="text-4xl text-purple-700 mb-3" />
          <h5 className="fw-bold text-dark mb-2">Real-Time Discussions</h5>
          <p className="text-muted">Engage in meaningful conversations with instant feedback.</p>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
