/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-alert */
// src/app/(site)/profile/ProfileClient.tsx

'use client';

import { useRef, useEffect, useState, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
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
// eslint-disable-next-line import/extensions
import supabase from '@/lib/supabaseClient';

const sessions = [
  { subject: 'ICS 211', time: 'May 9, 2025 @ 3:00 PM', role: 'Sensei' },
  { subject: 'MATH 307', time: 'May 7, 2025 @ 1:00 PM', role: 'Grasshopper' },
  // …etc…
];

export default function ProfileClient() {
  const achievementsRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<any>({
    first_name: '',
    last_name: '',
    email: '',
    created_at: '',
    major: '',
    minor: '',
    year: '',
    avatar_url: '',
    interests: [] as string[],
  });
  const [showModal, setShowModal] = useState(false);
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    async function fetchUser() {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        userId = user.id;
        localStorage.setItem('userId', userId);
      }
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
      }
    }
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const userId = localStorage.getItem('userId');
    const interestArray = interests.split(',').map(i => i.trim());
    await supabase
      .from('app_users')
      .update({ major, minor, interests: interestArray })
      .eq('id', userId);
    setUserData((prev: any) => ({ ...prev, major, minor, interests: interestArray }));
    alert('Profile updated!');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert('Sign in first');
    const file = e.target.files?.[0];
    if (!file) return alert('Please select a file.');
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase
      .from('app_users')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', user.id);
    setUserData((prev: any) => ({ ...prev, avatar_url: urlData.publicUrl }));
  };

  const scrollLeft = () => achievementsRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => achievementsRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  return (
    <main style={{ backgroundColor: '#f6f2ff', minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <Card className="mx-auto p-4" style={{ maxWidth: 960, borderRadius: '1.25rem' }}>
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
              <Image
                src={userData.avatar_url || '/default-avatar.png'}
                alt="Avatar"
                width={120}
                height={120}
                className="rounded-circle mb-3"
              />
              <h5>
                {userData.first_name}
                {' '}
                {userData.last_name}
              </h5>
              <p className="text-muted">{userData.email}</p>
              <p className="text-muted" style={{ fontSize: 0.9 }}>
                Member since
                {' '}
                {new Date(userData.created_at).toLocaleDateString()}
              </p>
              <Button variant="outline-primary" onClick={() => setShowModal(true)}>
                Edit Profile
              </Button>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={6}>
                  <h6 className="fw-bold border-bottom pb-1">Basic Info</h6>
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
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {userData.interests.map((i: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, idx: Key | null | undefined) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <Badge key={idx} bg="secondary">{i}</Badge>
                    ))}
                  </div>
                </Col>
                <Col md={6}>
                  <h6 className="fw-bold border-bottom pb-1">Study Stats</h6>
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
                    <strong>Sessions Led:</strong>
                    {' '}
                    2
                  </p>
                  <h6 className="fw-bold border-bottom mt-3 pb-1">Progress</h6>
                  <small>Level 2 Sensei – 12 pts to next level</small>
                  <ProgressBar now={18} max={30} label="18 pts" style={{ height: 16, marginTop: 4 }} />
                </Col>
              </Row>
            </Col>
          </Row>

          <hr />

          <div className="d-flex justify-content-between align-items-center mb-1">
            <h6 className="fw-bold border-bottom pb-1">Achievements</h6>
            <div className="d-flex gap-2">
              <Button size="sm" onClick={scrollLeft}><ChevronLeft /></Button>
              <Button size="sm" onClick={scrollRight}><ChevronRight /></Button>
            </div>
          </div>
          <div
            ref={achievementsRef}
            style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
          >
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { icon: '🎓', title: 'Sensei x2', desc: 'Led 2+ sessions' },
                { icon: '📘', title: 'Study Buddy', desc: 'Joined 5 sessions' },
                // …etc…
              ].map((item, idx) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                  style={{
                    minWidth: 200,
                    padding: '1rem',
                    background: '#f8f9fa',
                    borderRadius: '0.75rem',
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <div className="text-muted" style={{ fontSize: 12 }}>{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h6 className="fw-bold border-bottom pb-1">Session History</h6>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {sessions.map((s, idx) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    style={{
                      minWidth: 220,
                      padding: '1rem',
                      background: '#fff',
                      borderRadius: '0.75rem',
                    }}
                  >
                    <h6>{s.subject}</h6>
                    <small className="text-muted">{s.time}</small>
                    <div className="mt-2 text-end">
                      <Badge bg={s.role === 'Sensei' ? 'primary' : 'secondary'}>{s.role}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Profile</Modal.Title></Modal.Header>
        <Modal.Body>
          {userData.avatar_url && (
            <div className="text-center mb-3">
              <Image src={userData.avatar_url} alt="Avatar" width={100} height={100} className="rounded-circle" />
            </div>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Change Profile Picture</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleAvatarUpload} />
          </Form.Group>
          <Form onSubmit={e => { e.preventDefault(); handleUpdate(); setShowModal(false); }}>
            <Form.Group className="mb-3">
              <Form.Label>Major</Form.Label>
              <Form.Control value={major} onChange={e => setMajor(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minor</Form.Label>
              <Form.Control value={minor} onChange={e => setMinor(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interests</Form.Label>
              <Form.Control value={interests} onChange={e => setInterests(e.target.value)} />
            </Form.Group>
            <Button type="submit" className="w-100">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </main>
  );
}
