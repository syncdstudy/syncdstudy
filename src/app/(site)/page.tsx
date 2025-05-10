/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */

'use client';

import { Container, Button, Row, Col, Accordion } from 'react-bootstrap';
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

    {/* FAQ Section */}
    <Container fluid className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="info-box-1 mx-auto" style={{ maxWidth: '800px', width: '100%' }}>
        <motion.h3
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Frequently Asked Questions
        </motion.h3>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>General</Accordion.Header>
            <Accordion.Body>
              <p><strong>Q: What is Sync&apos;d Study?</strong><br />A community platform for students to connect, study, and communicate.</p>
              <p><strong>Q: How do I sign up?</strong><br />Click &quot;Sign Up&quot; on the homepage or Sign Up under &quot;Log In&quot; and create an account with your hawaii.edu email and password.</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Sessions</Accordion.Header>
            <Accordion.Body>
              <p><strong>Q: How do I join or create a study session?</strong><br />You can join or create a study session by clicking on the &quot;Study Sessions&quot; and fill up a form about the session details.</p>
              <p><strong>Q: Can I propose face-to-face sessions?</strong><br />Yes, you can propose face-to-face sessions for specific topics or study groups through the &quot;Study Sessions&quot; section.</p>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Locations</Accordion.Header>
            <Accordion.Body>
              <p><strong>Q: How do I find study locations on campus?</strong><br />Click the &quot;Locations&quot; to view a list of popular study spots around campus.</p>
              <p><strong>Q: Are there outdoor study spaces?</strong><br />Yes, you can find outdoor study spaces by selecting the &quot;Outdoor&quot; filter under the &quot;Locations&quot; section.</p>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Support and Contact</Accordion.Header>
            <Accordion.Body>
              <p><strong>Q: How do I get help or report an issue?</strong><br />For help or to report an issue, click the &quot;Contact&quot; link in the footer to reach the support team.</p>
              <p><strong>Q: Where can I send feedback or complaints?</strong><br />You can send feedback, complaints, or additional help requests through the &quot;Contact&quot; link in the footer.</p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </Container>
  </main>
);

export default Home;
