/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */

'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal, Button, Form } from 'react-bootstrap';
import supabase from '@/lib/supabaseClient';

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

export default function CurrentSessions() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
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
    const dateOnly = session.date.split('T')[0]; // grabs "2025-05-12" from full ISO
    const start = new Date(`${dateOnly}T${startStr}:00-10:00`);
    const end = new Date(`${dateOnly}T${endStr}:00-10:00`);
    if (now >= start && now <= end) return 'Happening now :D';
    if (now < start) return 'At a later time :)';
    return 'Already over :(';
  };

  useEffect(() => {
    async function fetchSessions() {
      if (!userId) return;

      // 1. Fetch invited session IDs
      const { data: invites, error: invErr } = await supabase
        .from('participants')
        .select('session_id')
        .eq('user_id', userId); // ✅ FIXED: matches your actual table column

      if (invErr) console.error('❌ Invite error:', invErr);

      const invitedIds = invites?.map(i => i.session_id) ?? [];

      // 2. Fetch those invited sessions
      const { data: invitedRaw, error: invitedErr } = invitedIds.length
        ? await supabase
          .from('StudySession') // ✅ no generic here
          .select('*') // ✅ no generic here
          .in('id', invitedIds)
        : { data: [], error: null };

      const invited = (invitedRaw ?? []) as StudySession[];

      if (invitedErr) console.error('❌ Invited session fetch error:', invitedErr);

      // 3. Fetch sessions the user created
      const { data: createdRaw, error: createdErr } = await supabase
        .from('StudySession') // ✅ no generic here
        .select('*')
        .eq('user_id', userId);

      const created = (createdRaw ?? []) as StudySession[];

      if (createdErr) console.error('❌ Created session fetch error:', createdErr);

      // 4. Merge and dedupe
      const combined = [...invited, ...created];
      const uniq = Array.from(new Map(combined.map(s => [s.id, s])).values());

      // 5. Filter future sessions (based on HST)
      const now = getHSTNow();
      const future = uniq.filter(s => {
        if (!s.date || !s.time.includes('–')) return false;
        const [start] = s.time.split('–');
        console.log('🔍 Raw session:', s);
        console.log('🔍 Date:', s.date, '| Time:', s.time);

        const dateOnly = new Date(s.date).toISOString().split('T')[0];
        const sessionStart = new Date(`${dateOnly}T${start}:00-10:00`);

        console.log('⏱️ Checking session:', s.name, '| Start:', sessionStart, '| Now:', now);
        return sessionStart > now;
      });

      // Sort future sessions chronologically
      future.sort((a, b) => {
        const da = new Date(`${a.date}T${a.time.split('–')[0]}:00-10:00`);
        const db = new Date(`${b.date}T${b.time.split('–')[0]}:00-10:00`);
        return da.getTime() - db.getTime();
      });

      setSessions(future);
    }

    fetchSessions();
  }, [userId]);

  const current = sessions[currentIndex];
  const handleNext = () => setCurrentIndex((i) => (i + 1) % sessions.length);
  const handlePrevious = () => setCurrentIndex((i) => (i - 1 + sessions.length) % sessions.length);
  const handleEdit = (s: StudySession) => { setEditData(s); setShowModal(true); };

  const handleDelete = async (sessionId: string) => {
    // Step 1: Delete all participant rows for this session
    const { error: partErr } = await supabase
      .from('participants')
      .delete()
      .eq('session_id', sessionId);

    if (partErr) {
      console.error('❌ Failed to delete from participants:', partErr);
      alert('Failed to remove session participants.');
      return;
    }

    // Step 2: Delete the session itself
    const { error: sessErr } = await supabase
      .from('StudySession')
      .delete()
      .eq('id', sessionId);

    if (sessErr) {
      console.error('❌ Failed to delete session:', sessErr);
      alert('Failed to delete session.');
      return;
    }

    // Step 3: Update UI
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
    // eslint-disable-next-line consistent-return
    if (error) return alert('Failed to update session.');
    setSessions(sessions.map(s => (s.id === editData.id ? editData : s)));
    setShowModal(false);
  };

  if (!sessions.length) {
    return (
      <div className="border border-dark p-4 rounded shadow text-center" style={{ backgroundColor: '#e5d8f6' }}>
        <h4 className="mb-2">My Sessions</h4>
        <p>You haven’t created or joined any upcoming study sessions yet.</p>
      </div>
    );
  }

  const [startTime, endTime] = current.time.split('–');

  return (
    <>
      <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6' }}>
        <h4 className="text-center mb-3">My Sessions</h4>
        <div className="d-flex align-items-center justify-content-between" style={{ minHeight: 120 }}>
          <button onClick={handlePrevious} className="btn btn-outline-secondary btn-sm">
            <ChevronLeft size={16} />
          </button>

          <div className="flex-grow-1 mx-2 border rounded p-3 bg-white">
            <p className="mb-1">
              <strong>Course:</strong>
              {' '}
              {current.name}
            </p>
            <p className="mb-1">
              <strong>Date:</strong>
              {' '}
              {new Date(current.date).toLocaleDateString()}
            </p>

            <p className="mb-1">
              <strong>Start Time:</strong>
              {' '}
              {formatTime(startTime)}
            </p>
            <p className="mb-1">
              <strong>End Time:</strong>
              {' '}
              {formatTime(endTime)}
            </p>
            <p className="mb-1">
              <strong>Location:</strong>
              {' '}
              {current.location || 'TBA'}
            </p>
            <p className="mb-1">
              <strong>Status:</strong>
              {' '}
              {getStatus(current)}
            </p>
            <p className="mb-1">
              <strong>Description:</strong>
              {' '}
              {current.description || '—'}
            </p>

            {current.creator_id === userId && (
              <div className="mt-2 d-flex gap-2">
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(current.id)}>Delete</button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(current)}>Edit</button>
              </div>
            )}
          </div>

          <button onClick={handleNext} className="btn btn-outline-secondary btn-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal */}
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
    </>
  );
}
