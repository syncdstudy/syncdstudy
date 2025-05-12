/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-duplicates */
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
} from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import supabase from '@/lib/supabaseClient';
import { Modal, Form } from 'react-bootstrap';

const sessions = [
  { subject: 'ICS 211', time: 'May 9, 2025 @ 3:00 PM', role: 'Sensei' },
  { subject: 'MATH 307', time: 'May 7, 2025 @ 1:00 PM', role: 'Grasshopper' },
  { subject: 'CHEM 161', time: 'May 5, 2025 @ 10:00 AM', role: 'Grasshopper' },
  { subject: 'ENG 100', time: 'May 4, 2025 @ 11:00 AM', role: 'Grasshopper' },
  { subject: 'PHYS 151', time: 'May 2, 2025 @ 9:00 AM', role: 'Sensei' },
];

const MyProfilePage = () => {
  const achievementsRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    achievementsRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    achievementsRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    major?: string;
    minor?: string;
    year?: string;
    interests: string[];
  }

  const [userData, setUserData] = useState<UserProfile>({
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
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchUser = async () => {
      const res = await fetch('/api/get-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserData(data);
        setMajor(data.major || '');
        setMinor(data.minor || '');
        setInterests((data.interests || []).join(', '));
      } else {
        console.error('Fetch failed:', data.error);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const userId = localStorage.getItem('userId');
    const interestArray = interests.split(',').map((i) => i.trim());

    const { error } = await supabase
      .from('app_users') // ✅ use your correct table name
      .update({
        major,
        minor,
        interests: interestArray,
      })
      .eq('id', userId);

    if (error) {
      console.error('Update failed:', error);
    } else {
      // ✅ Update the local state so the UI updates immediately
      setUserData((prev) => ({
        ...prev,
        major,
        minor,
        interests: interestArray,
      }));

      alert('Profile updated!');
    }
  };

  // Removed redundant function declarations for setMinor and setInterests

  return (
    <main style={{ backgroundColor: '#f6f2ff', minHeight: '105vh', padding: '3rem 0 8rem' }}>
      <Container>
        <Card className="mx-auto p-4" style={{ maxWidth: '960px', borderRadius: '1.25rem' }}>
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
<<<<<<< Updated upstream
              <Image
                src="/image.png"
=======
              <img
                src={userData.avatar_url || '/default-avatar.png'} // ✅ use fallback image
>>>>>>> Stashed changes
                alt="Profile"
                width={120}
                height={120}
                style={{ objectFit: 'cover' }}
                className="rounded-circle mb-3"
              />
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
                    {userData.major || '—'}
                  </p>
                  <p>
                    <strong>Minor:</strong>
                    {' '}
                    {userData.minor || '—'}
                  </p>
                  <p><strong>Interests:</strong></p>
                  <div className="d-flex gap-2 flex-wrap mb-3">
                    {Array.isArray(userData.interests) && userData.interests.map((interest, idx) => (
                      <Badge key={idx} bg="secondary">{interest}</Badge>
                    ))}
                  </div>
                  <p><strong>Progress</strong></p>
                  <small>Level 2 Sensei – 12 pts to next level</small>
                  <ProgressBar now={18} max={30} label="18 pts" style={{ height: '1rem', marginTop: '4px' }} />
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
                </Col>
              </Row>
            </Col>
          </Row>

          <hr className="my-4" />

          {/* Achievements */}
          <div className="mt-0">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className="fw-bold border-bottom pb-1 mb-3" style={{ borderColor: '#9c88ff' }}>Achievements</h6>
              <div className="d-flex gap-2">
                <Button variant="light" size="sm" onClick={scrollLeft}><ChevronLeft /></Button>
                <Button variant="light" size="sm" onClick={scrollRight}><ChevronRight /></Button>
              </div>
            </div>

            <div
              ref={achievementsRef}
              style={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { icon: '🎓', title: 'Sensei x2', desc: 'Led 2+ study sessions' },
                  { icon: '📘', title: 'Study Buddy', desc: 'Joined 5 sessions' },
                  { icon: '⭐', title: '18 Points', desc: 'Earned by helping others study' },
                  { icon: '🧠', title: 'Quiz Whiz', desc: 'Completed 3 quizzes' },
                  { icon: '👥', title: 'Connector', desc: 'Joined 10 sessions' },
                  { icon: '🔥', title: 'Streak Champ', desc: 'Studied 5 days in a row' },
                  { icon: '💬', title: 'Discussion Leader', desc: 'Started a group thread' },
                  { icon: '🌱', title: 'Newbie', desc: 'First session joined' },
                  { icon: '🚀', title: 'Level Up', desc: 'Reached Level 2' },
                ].map((item, index) => (
                  <div
                    style={{
                      minWidth: '200px',
                      maxWidth: '220px',
                      background: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      overflow: 'hidden',
                    }}
                  >

                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Session History */}
          <div className="mt-4">
            <h6 className="fw-bold border-bottom pb-1 mb-3" style={{ borderColor: '#9c88ff' }}>Session History</h6>
            <div
              style={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem' }}>
                {sessions.map((session, index) => (
                  <div
                    key={index}
                    style={{
                      minWidth: '220px',
                      background: '#ffffff',
                      border: '1px solid #dee2e6',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '140px',
                    }}
                  >
                    <div>
                      <h6 className="mb-1 fw-semibold">{session.subject}</h6>
                      <small className="text-muted">{session.time}</small>
                    </div>
                    <div className="mt-2 text-end">
                      <Badge
                        bg={session.role === 'Sensei' ? 'primary' : 'secondary'}
                        pill
                        style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                      >
                        {session.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={(e) => { e.preventDefault(); handleUpdate(); setShowModal(false); }}>
                <Form.Group className="mb-3">
                  <Form.Label>Major</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your major"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Minor</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your minor"
                    value={minor}
                    onChange={(e) => setMinor(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Interests (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. coding, music, hiking"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  />
                </Form.Group>

                <Button type="submit" className="w-100">
                  Save Changes
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

        </Card>
      </Container>
    </main>
  );
};

export default MyProfilePage;
