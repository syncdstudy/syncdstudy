/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable react/no-array-index-key */
// src/app/(site)/profile/ProfileClient.tsx

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
} from 'react-bootstrap';
import supabase from '@/lib/supabaseClient';

export default function ProfileClient() {
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
    bio: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [interests, setInterests] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    async function fetchUser() {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
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
        setBio(data.bio || '');
      }
    }

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const userId = localStorage.getItem('userId');
    const interestArray = interests.split(',').map(i => i.trim());

    await supabase
      .from('app_users')
      .update({ major, minor, interests: interestArray, bio })
      .eq('id', userId);

    setUserData((prev: any) => ({
      ...prev,
      major,
      minor,
      interests: interestArray,
      bio,
    }));

    alert('Profile updated!');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Sign in first');

    const file = e.target.files?.[0];
    if (!file) return alert('Please select a file.');

    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;

    await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);

    await supabase.from('app_users').update({ avatar_url: urlData.publicUrl }).eq('id', user.id);
    setUserData((prev: any) => ({ ...prev, avatar_url: urlData.publicUrl }));
  };

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
              <Button variant="outline-primary" onClick={() => setShowModal(true)}>Edit Profile</Button>
            </Col>

            <Col md={4}>
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
              {userData.interests.length > 0 ? (
                <ul className="mb-3">
                  {userData.interests.map((i: string, idx: number) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">None listed</p>
              )}
            </Col>

            <Col md={4}>
              <h6 className="fw-bold border-bottom pb-1">Bio</h6>
              <p>{userData.bio || <span className="text-muted">No bio yet.</span>}</p>
            </Col>
          </Row>
        </Card>
      </Container>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Profile</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={e => { e.preventDefault(); handleUpdate(); setShowModal(false); }}>
            <Form.Group className="mb-3">
              <Form.Label>Change Profile Picture</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleAvatarUpload} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Major</Form.Label>
              <Form.Control value={major} onChange={e => setMajor(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Minor</Form.Label>
              <Form.Control value={minor} onChange={e => setMinor(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Interests (comma-separated)</Form.Label>
              <Form.Control value={interests} onChange={e => setInterests(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" rows={3} value={bio} onChange={e => setBio(e.target.value)} />
            </Form.Group>

            <Button type="submit" className="w-100">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </main>
  );
}
