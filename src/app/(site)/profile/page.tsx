/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-array-index-key */

'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Badge,
  ProgressBar,
  Modal,
  Form,
} from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import supabase from '@/lib/supabaseClient';

const sessions = [
  { subject: 'ICS 211', time: 'May 9, 2025 @ 3:00 PM', role: 'Sensei' },
  { subject: 'MATH 307', time: 'May 7, 2025 @ 1:00 PM', role: 'Grasshopper' },
  { subject: 'CHEM 161', time: 'May 5, 2025 @ 10:00 AM', role: 'Grasshopper' },
  { subject: 'ENG 100', time: 'May 4, 2025 @ 11:00 AM', role: 'Grasshopper' },
  { subject: 'PHYS 151', time: 'May 2, 2025 @ 9:00 AM', role: 'Sensei' },
];

const MyProfilePage = () => {
  const achievementsRef = useRef<HTMLDivElement | null>(null);
  const scrollLeft = () => achievementsRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => achievementsRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  const [userData, setUserData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    major: string;
    minor: string;
    year: string;
    interests: string[];
  }>({
    first_name: '',
    last_name: '',
    email: '',
    created_at: '',
    major: '',
    minor: '',
    year: '',
    interests: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [minor, setMinor] = useState('');
  const [interests, setInterests] = useState('');
  const [major, setMajor] = useState(userData.major || '');
  const [year, setYear] = useState(userData.year || '');

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const res = await fetch('/api/get-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setUserData(data);
        setMinor(data.minor || '');
        setMajor(data.major || '');
        setInterests((data.interests || []).join(', '));
        setYear(data.year || '');
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const userId = localStorage.getItem('userId');
    const interestArray = interests.split(',').map((i) => i.trim());

    console.log({ year, major, minor, interests: interestArray });

    const { error } = await supabase
      .from('app_users')
      .update({
        year, // ✅ include year here
        major,
        minor,
        interests: interestArray,
      })
      .eq('id', userId);

    if (!error) {
      setUserData((prev) => ({
        ...prev,
        year, // ✅ update local state
        major,
        minor,
        interests: interestArray,
      }));
      setShowModal(false);
    } else {
      console.error('Supabase update error:', error);
      alert('Update failed');
    }
  };

  return (
    <main style={{ backgroundColor: '#f6f2ff', minHeight: '105vh', padding: '2rem 0 6rem' }}>
      <Container>
        <Card className="mx-auto p-4" style={{ maxWidth: '960px', borderRadius: '1.25rem' }}>
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
              <Image src="/image.png" alt="Profile" width={120} height={120} style={{ objectFit: 'cover' }} className="rounded-circle mb-3" />
              <h5>
                {userData.first_name}
                {' '}
                {userData.last_name}
              </h5>
              <p className="text-muted mb-1">{userData.email}</p>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Member since
                {' '}
                {new Date(userData.created_at).toLocaleDateString()}
              </p>
              <Button size="sm" variant="outline-primary" onClick={() => setShowModal(true)}>Edit Profile</Button>
            </Col>

            <Col md={8}>
              <Row>
                <Col md={6}>
                  <h6 className="fw-bold border-bottom pb-1" style={{ borderColor: '#9c88ff' }}>Basic Info</h6>
                  <p>
                    <strong>Year:</strong>
                    {' '}
                    {userData.year || '—'}
                  </p>
                  <p>
                    <strong>Major:</strong>
                    {' '}
                    {userData.major}
                  </p>
                  <p>
                    <strong>Minor:</strong>
                    {' '}
                    {userData.minor || '—'}
                  </p>
                  <p><strong>Interests:</strong></p>
                  <div className="d-flex gap-2 flex-wrap mb-3">
                    {userData.interests?.map((i, idx) => (
                      <Badge key={idx} bg="secondary">{i}</Badge>
                    ))}
                  </div>
                </Col>

                <Col md={6}>
                  <h6 className="fw-bold border-bottom pb-1" style={{ borderColor: '#9c88ff' }}>Study Stats</h6>
                  <p>
                    <strong>Points:</strong>
                    {' '}
                    18
                  </p>
                  <p>
                    <strong>Sessions Joined:</strong>
                    {' '}
                    5
                  </p>
                  <p>
                    <strong>Sessions Led (Sensei):</strong>
                    {' '}
                    2
                  </p>
                  <p><strong>Progress</strong></p>
                  <small>Level 2 Sensei – 12 pts to next level</small>
                  <ProgressBar now={18} max={30} label="18 pts" style={{ height: '1rem', marginTop: '4px' }} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select your year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Major</Form.Label>
              <Form.Control type="text" placeholder="Enter your major" value={major} onChange={(e) => setMajor(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minor</Form.Label>
              <Form.Control type="text" placeholder="Enter your minor" value={minor} onChange={(e) => setMinor(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interests (comma separated)</Form.Label>
              <Form.Control type="text" placeholder="e.g. coding, music, hiking" value={interests} onChange={(e) => setInterests(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default MyProfilePage;
