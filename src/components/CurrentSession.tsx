/* eslint-disable react/button-has-type */
// components/CurrentSession.tsx
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import supabase from '@/lib/supabaseClient';
import { Modal, Button, Form } from 'react-bootstrap';

interface StudySession {
  id: string;
  name: string;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:mm–HH:mm'
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

  // Helpers to deal with HST times
  const getHSTNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));

  const getStatus = (s: StudySession) => {
    const now = getHSTNow();
    const dateStr = new Date(s.date).toISOString().split('T')[0];
    const [start, end] = s.time.split('–');
    const startDT = new Date(`${dateStr}T${start}:00-10:00`);
    const endDT = new Date(`${dateStr}T${end}:00-10:00`);
    if (now >= startDT && now <= endDT) return 'Happening Now!';
    if (now < startDT) return 'Later Today';
    return 'Already Happened';
  };

  const formatTimeRange = (range: string) => {
    const [start, end] = range.split('–');
    const to12hr = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${m < 10 ? `0${m}` : m} ${suffix}`;
    };
    return `${to12hr(start)} – ${to12hr(end)}`;
  };

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    async function fetchSessions() {
      if (!userId) return;

      // 1) Get invites
      const { data: invites, error: invErr } = await supabase
        .from('session_invites')
        .select('session_id')
        .eq('invitee_id', userId);
      if (invErr) {
        console.error(invErr);
        return;
      }

      const invitedIds = invites?.map((i: any) => i.session_id) || [];

      // 2) Fetch invited sessions
      const { data: invitedRaw, error: joinErr } = invitedIds.length
        ? await supabase
          .from('StudySession')
          .select('*')
          .in('id', invitedIds)
        : { data: [], error: null };
      if (joinErr) {
        console.error(joinErr);
        return;
      }

      // 3) Fetch created sessions
      const { data: createdRaw, error: creErr } = await supabase
        .from('StudySession')
        .select('*')
        .eq('creator_id', userId);
      if (creErr) {
        console.error(creErr);
        return;
      }

      // 4) Merge, dedupe, and filter future sessions
      const combined = [...(invitedRaw || []), ...(createdRaw || [])];
      const uniq = Array.from(new Map(combined.map(s => [s.id, s])).values());

      const now = getHSTNow();
      const future = uniq
        .filter(s => {
          if (!s.date || !s.time.includes('–')) return false;
          const datePart = new Date(s.date).toISOString().split('T')[0];
          const [start] = s.time.split('–');
          return new Date(`${datePart}T${start}:00-10:00`) > now;
        })
        .sort((a, b) => {
          const da = new Date(`${a.date}T${a.time.split('–')[0]}:00-10:00`);
          const db = new Date(`${b.date}T${b.time.split('–')[0]}:00-10:00`);
          return da.getTime() - db.getTime();
        });

      setSessions(future);
    }

    fetchSessions();
  }, []);

  const handleNext = () => setCurrentIndex(i => (i + 1) % sessions.length);
  const handlePrevious = () => setCurrentIndex(i => (i - 1 + sessions.length) % sessions.length);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('StudySession')
      .delete()
      .eq('id', id);
    if (error) {
      alert('Failed to delete session.');
      return;
    }
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    setCurrentIndex(0);
  };

  const handleEdit = (s: StudySession) => {
    setEditData(s);
    setShowModal(true);
  };
  const handleEditChange = (field: keyof StudySession, value: string) => editData && setEditData({ ...editData, [field]: value });

  const handleSaveEdit = async () => {
    if (!editData) return;
    const { error } = await supabase
      .from('StudySession')
      .update(editData)
      .eq('id', editData.id);
    if (error) {
      alert('Failed to update session.');
      return;
    }
    setSessions(sessions.map(s => (s.id === editData.id ? editData : s)));
    setShowModal(false);
  };

  if (!sessions.length) {
    return (
      <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6' }}>
        <h4 className="text-center mb-3">My Sessions</h4>
        <p className="text-center">You haven’t created or joined any upcoming study sessions yet.</p>
      </div>
    );
  }

  const current = sessions[currentIndex];

  return (
    <>
      <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6' }}>
        <h4 className="text-center mb-3">My Sessions</h4>
        <div className="d-flex align-items-center justify-content-between" style={{ minHeight: 120 }}>
          <button onClick={handlePrevious} className="btn btn-outline-secondary btn-sm">
            <ChevronLeft size={16} />
          </button>

          <div className="flex-grow-1 mx-2 border rounded p-3" style={{ backgroundColor: '#fff' }}>
            <p className="mb-1">
              <strong>Session:</strong>
              {' '}
              {current.name}
            </p>
            <p className="mb-1">
              <strong>Date:</strong>
              {' '}
              {new Date(current.date).toLocaleDateString()}
            </p>
            <p className="mb-1">
              <strong>Time:</strong>
              {' '}
              {formatTimeRange(current.time)}
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

            {current.creator_id === userId && (
              <div className="mt-2 d-flex gap-2">
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(current.id)}>
                  Delete
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(current)}>
                  Edit
                </button>
              </div>
            )}
          </div>

          <button onClick={handleNext} className="btn btn-outline-secondary btn-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Study Session</Modal.Title>
        </Modal.Header>
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
