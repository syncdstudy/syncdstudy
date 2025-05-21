/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */

'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import supabase from '@/lib/supabaseClient';

function formatDateHST(dateStr: string) {
  if (!dateStr) return 'Invalid Date';
  const adjusted = new Date(new Date(dateStr).getTime() + 10 * 60 * 60 * 1000); // +10 hours
  return adjusted.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Pacific/Honolulu',
  });
}

interface StudySession {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  description: string;
  creator_id: string;
}

const MAX_PARTICIPANTS = 5;

export default function CurrentSessions() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});
  const [participantNames, setParticipantNames] = useState<string[]>([]);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<StudySession | null>(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const getHSTNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m < 10 ? `0${m}` : m} ${suffix}`;
  };

  const getStatus = (session: StudySession) => {
    const now = getHSTNow();
    const [startStr, endStr] = session.time.split('–');
    const dateOnly = session.date.split('T')[0];
    const start = new Date(`${dateOnly}T${startStr}:00-10:00`);
    const end = new Date(`${dateOnly}T${endStr}:00-10:00`);
    if (now >= start && now <= end) return 'Happening now!';
    if (start.toDateString() === now.toDateString() && now < start) return 'Later today!';
    if (start > now) return 'Upcoming session';
    return '';
  };

  useEffect(() => {
    async function fetchSessions() {
      if (!userId) return;

      const { data: createdRaw, error: createdErr } = await supabase
        .from('StudySession')
        .select('*')
        .eq('creator_id', userId);

      const created = (createdRaw ?? []) as StudySession[];

      if (createdErr) console.error('❌ Created session fetch error:', createdErr);

      const now = getHSTNow();
      const future = created.filter(s => {
        if (!s.date || !s.time.includes('–')) return false;
        const [startStr, endStr] = s.time.split('–');
        const dateOnly = s.date.split('T')[0];
        const start = new Date(`${dateOnly}T${startStr}:00-10:00`);
        const end = new Date(`${dateOnly}T${endStr}:00-10:00`);
        return (
          (now >= start && now <= end)
          || (start.toDateString() === now.toDateString() && now < start)
          || (start > now)
        );
      });

      future.sort((a, b) => {
        const da = new Date(`${a.date}T${a.time.split('–')[0]}:00-10:00`);
        const db = new Date(`${b.date}T${b.time.split('–')[0]}:00-10:00`);
        return da.getTime() - db.getTime();
      });

      setSessions(future);

      const ids = future.map(s => s.id);
      const { data: allParticipants, error: partErr } = await supabase
        .from('participants')
        .select('session_id, user_id')
        .in('session_id', ids);

      if (!partErr && allParticipants) {
        const countMap: Record<string, number> = {};
        for (const row of allParticipants) {
          countMap[row.session_id] = (countMap[row.session_id] || 0) + 1;
        }
        setParticipantCounts(countMap);
      }
    }

    fetchSessions();
  }, [userId]);

  const handleShowParticipants = async (sessionId: string) => {
    const { data: partData } = await supabase
      .from('participants')
      .select('user_id')
      .eq('session_id', sessionId);

    const ids = partData?.map(p => p.user_id) ?? [];
    const { data: users } = await supabase
      .from('app_users')
      .select('email')
      .in('id', ids);

    setParticipantNames(users?.map(u => u.email) ?? []);
    setShowParticipantsModal(true);
  };

  const current = sessions[currentIndex];
  const handleNext = () => setCurrentIndex((i) => (i + 1) % sessions.length);
  const handlePrevious = () => setCurrentIndex((i) => (i - 1 + sessions.length) % sessions.length);
  const handleEdit = (s: StudySession) => { setEditData(s); setShowModal(true); };

  const handleDelete = async (sessionId: string) => {
    await supabase.from('participants').delete().eq('session_id', sessionId);
    await supabase.from('StudySession').delete().eq('id', sessionId);
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    setCurrentIndex(0);
  };

  const handleEditChange = (field: keyof StudySession, value: string) => {
    if (editData) setEditData({ ...editData, [field]: value });
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    const { error } = await supabase.from('StudySession').update(editData).eq('id', editData.id);
    if (error) return alert('Failed to update session.');
    setSessions(sessions.map(s => (s.id === editData.id ? editData : s)));
    setShowModal(false);
  };

  if (!sessions.length) {
    return (
      <div className="border border-dark p-4 rounded shadow text-center" style={{ backgroundColor: '#e5d8f6' }}>
        <h4 className="mb-2">My Sessions</h4>
        <p>You haven’t created any upcoming study sessions yet.</p>
      </div>
    );
  }

  const [startTime, endTime] = current.time.split('–');
  const participants = participantCounts[current.id] || 0;

  return (
    <>
      <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6' }}>
        <h4 className="text-center mb-3">My Sessions</h4>
        <div className="d-flex align-items-center justify-content-between" style={{ minHeight: 120 }}>
          <button onClick={handlePrevious} className="btn btn-outline-secondary btn-sm">
            <ChevronLeft size={16} />
          </button>

          <div className="flex-grow-1 mx-2 border rounded p-3 bg-white" style={{ maxHeight: '350px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <p className="mb-1">
              <strong>Course:</strong>
              {' '}
              {current.name}
            </p>
            <p className="mb-1">
  <strong>Date:</strong>
  {' '}
  {formatDateHST(current.date)}
</p>

            <p className="mb-1">
              <strong>Time:</strong>
              {' '}
              {formatTime(startTime)}
              {' '}
              –
              {' '}
              {formatTime(endTime)}
            </p>
            <p className="mb-1">
              <strong>Location:</strong>
              {' '}
              {current.location || 'TBA'}
            </p>
            <p className="mb-1">
              <strong>Mode:</strong>
              {' '}
              <span className={`badge bg-${current.mode === 'Online' ? 'info' : 'secondary'}`}>{current.mode}</span>
            </p>
            <p className="mb-1">
              <strong>Status:</strong>
              {' '}
              <span className={`badge ${getStatus(current) === 'Happening now!' ? 'bg-success' : getStatus(current) === 'Later today!' ? 'bg-warning text-dark' : 'bg-primary'}`}>{getStatus(current)}</span>
            </p>
            <div className="mb-2 d-flex align-items-center gap-2">
              <Users size={18} style={{ cursor: 'pointer' }} onClick={() => handleShowParticipants(current.id)}>
                <title>View participants</title>
              </Users>
              <span>
                {participants}
                /
                {MAX_PARTICIPANTS}
                {' '}
                joined
                {' '}
                {participants >= MAX_PARTICIPANTS && <Badge bg="danger">Session Full</Badge>}
              </span>
            </div>
            <div className="mb-1" style={{ maxHeight: '100px', overflowY: 'auto', paddingRight: '4px' }}>
              <strong>Description:</strong>
              {' '}
              <div style={{ whiteSpace: 'pre-wrap' }}>{current.description || '—'}</div>
            </div>
            <div className="mt-2 d-flex gap-2">
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(current.id)}>Delete</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(current)}>Edit</button>
            </div>
          </div>

          <button onClick={handleNext} className="btn btn-outline-secondary btn-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Study Session</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            {(['name', 'date', 'time', 'location', 'mode', 'description'] as (keyof StudySession)[]).map(field => (
              <Form.Group key={field} className="mb-2">
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  as={field === 'description' ? 'textarea' : undefined}
                  type={field === 'date' ? 'date' : 'text'}
                  value={editData?.[field] || ''}
                  onChange={e => handleEditChange(field, e.target.value)}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showParticipantsModal} onHide={() => setShowParticipantsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Joined Participants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {participantNames.length === 0 ? (
            <p>No participants yet.</p>
          ) : (
            <ul>
              {participantNames.map(name => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowParticipantsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
