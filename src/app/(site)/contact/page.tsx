'use client';

import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const inquiryOptions = [
  'General Question',
  'Technical Issue',
  'Feature Request',
  'Feedback',
  'Account Help',
  'Partnership / Collaboration',
  'Other',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    topic: '',
    message: '',
  });

  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: null,
        message: formData.message,
        email: formData.email,
        topic: formData.topic,
      }),
    });

    if (res.ok) {
      setStatus('✅ Message sent successfully!');
      setFormData({ firstName: '', lastName: '', email: '', topic: '', message: '' });
    } else {
      setStatus('❌ Failed to send message. Please try again later.');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col>
          <div className="contact-form">
            <h3 className="mb-4 text-center">Contact Us</h3>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Label className="text-start w-100">First Name</Form.Label>
                  <Form.Control
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label className="text-start w-100">Last Name</Form.Label>
                  <Form.Control
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="text-start w-100">Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-start w-100">Inquiry Topic</Form.Label>
                <Form.Select name="topic" value={formData.topic} onChange={handleChange} required>
                  <option value="">Select a topic</option>
                  {inquiryOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-start w-100">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {status && <p className="text-center fw-bold">{status}</p>}

              <div className="d-grid">
                <Button type="submit" className="contact-button w-100">
                  Send Message
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
