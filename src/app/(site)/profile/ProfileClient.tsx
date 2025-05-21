/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable react/no-array-index-key */

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
  ProgressBar,
  Table,
} from 'react-bootstrap';
import supabase from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

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
    points: 0,
    study_streak: 0,
    sessions_hosted: 0,
    sessions_joined: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [major, setMajor] = useState('');
  const [minor, setMinor] = useState('');
  const [interests, setInterests] = useState('');
  const [bio, setBio] = useState('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [lastSessionJoined, setLastSessionJoined] = useState<string>('');

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
        console.log('User data:', data);
        setUserData(data);
        setMajor(data.major || '');
        setMinor(data.minor || '');
        setInterests((data.interests || []).join(', '));
        setBio(data.bio || '');
        setCurrentUserId(userId);
      }
    }

    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from('app_users')
        .select('id, first_name, last_name, points')
        .order('points', { ascending: false });
      if (!error && data) setLeaderboard(data);
      console.log('Leaderboard data:', data);
    }

    fetchUser();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    async function fetchLastJoinedSession() {
      if (!currentUserId) return;
  
      const { data: partData, error: partError } = await supabase
        .from('participants')
        .select('session_id')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(1);
  
      if (partError) {
        console.error('❌ Error fetching participant record:', partError);
        return;
      }
  
      if (partData && partData.length > 0) {
        const sessionId = partData[0].session_id;
  
        const { data: sessionData, error: sessionError } = await supabase
          .from('StudySession')
          .select('name')
          .eq('id', sessionId)
          .single();
  
        if (sessionError) {
          console.error('❌ Error fetching session name:', sessionError);
        } else if (sessionData?.name) {
          setLastSessionJoined(sessionData.name);
        }
      }
    }
  
    fetchLastJoinedSession();
  }, [currentUserId]); // ✅ run only when currentUserId is ready
  

  useEffect(() => {
    async function testQuery() {
      const { data, error } = await supabase
        .from('app_users')
        .select('id, first_name, last_name, points')
        .order('points', { ascending: false });

      console.log('Test leaderboard data:', data);
      if (error) console.error('Error:', error);
    }

    testQuery();
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

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  return (
    <main style={{ backgroundColor: '#f6f2ff', minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <Row className="gx-4">
          <Col lg={8}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card
                className="mb-0 shadow-sm"
                style={{
                  borderRadius: '1.25rem',
                  backgroundColor: '#ffffff',
                  padding: '2.4rem', // ← use any value you want (e.g. 1.75rem, 2.25rem, etc.)
                  minHeight: '450px',         // ✅ Lock in a minimum height
                  overflow: 'hidden',
                }}
              >
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
  {userData.first_name} {userData.last_name}
</h5>
<p className="text-muted mb-1">{userData.email}</p> {/* 👈 trims space below */}
{userData.created_at && (
  <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
    Member since{' '}
    {new Date(userData.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}
  </p>
)}


                    <Button variant="outline-primary" onClick={() => setShowModal(true)}>Edit Profile</Button>
                  </Col>

                    <Col md={4}>
                    <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                      <h6 className="fw-bold border-bottom pb-1">Basic Info</h6>
                      <p>
                      <strong>Year:</strong>
                      <span className="ms-2">{userData.year || '—'}</span>
                      </p>
                      <p>
                      <strong>Major:</strong>
                      <span className="ms-2">{userData.major || '—'}</span>
                      </p>
                      <p>
                      <strong>Minor:</strong>
                      <span className="ms-2">{userData.minor || '—'}</span>
                      </p>
                      <p>
                      <strong>Interests:</strong>
                      </p>
                      {userData.interests.length > 0 ? (
                      <ul className="mb-3">
                        {userData.interests.map((i: string, idx: number) => (
                        <li key={idx}>{i}</li>
                        ))}
                      </ul>
                      ) : (
                      <p className="text-muted ms-2">None listed</p>
                      )}
                      {userData.bio && (
                      <>
                        <p>
                        <strong>Bio:</strong>
                        </p>
                        <p className="ms-2">{userData.bio}</p>
                      </>
                      )}
                    </div>
                    </Col>

                  <Col md={4}>
                    <h6 className="fw-bold border-bottom pb-1">Achievements</h6>
                    <p>
                      <strong>Total Points:</strong>
                      {' '}
                      {userData.points || 0}
                    </p>
                    <p><strong>Study Streak:</strong></p>
                    <ProgressBar
  now={100}
  max={100}
  label={`${userData.study_streak || 0} day${userData.study_streak === 1 ? '' : 's'}`}
  className="mb-2"
  variant="info"
/>

<p><strong>Sessions Hosted:</strong></p>
<ProgressBar
  now={100}
  max={100}
  label={`${userData.sessions_hosted || 0} session${userData.sessions_hosted === 1 ? '' : 's'}`}
  className="mb-2"
  variant="success"
/>

<p><strong>Sessions Joined:</strong></p>
<ProgressBar
  now={100}
  max={100}
  label={`${userData.sessions_joined || 0} session${userData.sessions_joined === 1 ? '' : 's'}`}
  className="mb-2"
  variant="primary"
/>

                  </Col>
                </Row>
              </Card>
            </motion.div>
          </Col>

          <Col lg={4}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              {/* 🆕 Info Box */}
    <Card className="mb-4 p-4 text-center shadow-sm" style={{ borderRadius: '1rem', backgroundColor: '#f8f0ff' }}>
      <h6 className="fw-bold mb-1">Welcome to Your Profile !</h6>
      <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>
        View your study progress, update your info, and track your leaderboard rank!
      </p>
    </Card>
           
            {/* 🏆 Leaderboard Card */} 
              <Card className="p-4 shadow-sm" style={{ borderRadius: '1.25rem', backgroundColor: '#ffffff' }}>
                <h5 className="text-center mb-3">🏆 Leaderboard</h5>
                <div style={{ maxHeight: '452px', overflowY: 'auto' }}>
                  <Table responsive bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((user, idx) => {
                        const isCurrentUser = user.id === currentUserId;
                        let rowStyle = {};

                        // Optional: Add special row colors for Top 3
                        if (idx === 0) rowStyle = { backgroundColor: '#fef3c7' }; // Gold
                        else if (idx === 1) rowStyle = { backgroundColor: '#e0f2fe' }; // Silver
                        else if (idx === 2) rowStyle = { backgroundColor: '#ede9fe' }; // Bronze

                        if (isCurrentUser) {
                          rowStyle = { backgroundColor: '#e0f7fa', fontWeight: 'bold' }; // Highlight current user
                        }

                        return (
                          <tr key={idx} style={rowStyle}>
                            <td>{getRankIcon(idx)}</td>
                            <td>
                              {user.first_name}
                              {' '}
                              {user.last_name}
                            </td>
                            <td>{user.points}</td>
                          </tr>
                        );
                      })}
                    </tbody>

                  </Table>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row className="mt-0 pt-0">
          <Col lg={8} className="pt-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <Card
                className="p-4 shadow-sm mb-0"
                style={{
                  borderRadius: '1.25rem',
                  backgroundColor: '#ffffff',
                  marginTop: '-12.8rem', // 👈 this pulls it closer to the card above
                }}
              >
                <h6 className="fw-bold mb-3">📌 Milestone Tracker</h6>
                <p>
  <strong>Last Session Joined:</strong>
  {' '}
  {lastSessionJoined || '—'}
</p>
                <p>
                  <strong>Next Rank Goal:</strong>
                  {' '}
                  Reach 100 points to unlock badge 🥇
                </p>
                <p>
                  <strong>Rank Progress:</strong>
                  {' '}
                  {(() => {
                    const rank = leaderboard.findIndex(u => u.id === currentUserId) + 1;
                    return rank > 0
                      ? `#${rank} out of ${leaderboard.length} users`
                      : '—';
                  })()}
                </p>

              </Card>
            </motion.div>
          </Col>
        </Row>

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
      </Container>
    </main>
  );
}
