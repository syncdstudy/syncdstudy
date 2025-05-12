/* eslint-disable react/button-has-type */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import supabase from '@/lib/supabaseClient';
import { Modal, Button, Form } from 'react-bootstrap';

const CurrentSessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const getHSTNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));

  const getStatus = (session: any) => {
    // Force current time to HST
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));

    // Parse the session date into a real date object
    const sessionDate = new Date(session.date); // stored in UTC
    const sessionDateStr = sessionDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const [startStr, endStr] = session.time.split('–');

    // Build full DateTime strings with explicit HST offset
    const start = new Date(`${sessionDateStr}T${startStr}:00-10:00`);
    const end = new Date(`${sessionDateStr}T${endStr}:00-10:00`);

    if (now >= start && now <= end) return 'Happening Now!';
    if (now < start) return 'Later Today';
    return 'Already Happened';
  };

  const formatTimeRange = (range: string) => {
    const [startStr, endStr] = range.split('–');

    const to12hr = (time: string) => {
      const [hour, minute] = time.split(':');
      const h = parseInt(hour, 10);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${minute} ${suffix}`;
    };

    return `${to12hr(startStr)} – ${to12hr(endStr)}`;
  };

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('StudySession')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching sessions:', error);
        return;
      }

      const today = getHSTNow();
      const todayStr = today.toISOString().split('T')[0];

      const todaySessions = (data || []).filter((session) => {
        const sessionDate = new Date(session.date).toISOString().split('T')[0];
        return sessionDate === todayStr;
      });

      setSessions(todaySessions);
      setCurrentIndex(0);
    };

    fetchSessions();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sessions.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sessions.length) % sessions.length);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('StudySession').delete().eq('id', id);
    if (error) {
      // eslint-disable-next-line no-alert
      alert('Failed to delete session.');
      return;
    }

    const updatedSessions = sessions.filter((s) => s.id !== id);
    setSessions(updatedSessions);
    setCurrentIndex(0);
  };

  const handleEdit = (session: any) => {
    setEditData({ ...session });
    setShowModal(true);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    const { error } = await supabase
      .from('StudySession')
      .update({
        name: editData.name,
        date: editData.date,
        time: editData.time,
        location: editData.location,
        mode: editData.mode,
        description: editData.description,
      })
      .eq('id', editData.id);

    if (error) {
      // eslint-disable-next-line no-alert
      alert('Failed to update session.');
      return;
    }

    const updatedSessions = sessions.map((s) => (s.id === editData.id ? { ...s, ...editData } : s));
    setSessions(updatedSessions);
    setShowModal(false);
  };

  if (sessions.length === 0) {
    return (
      <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6' }}>

        <h5 className="text-center mb-2">Today&apos;s Sessions</h5>
        <p className="text-center">No study sessions scheduled for today.</p>
      </div>
    );
  }

  const current = sessions[currentIndex];

  return (
    <>
      <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6' }}>
        <h4 className="text-center mb-3">Today&apos;s Sessions</h4>
        <div className="d-flex align-items-center justify-content-between" style={{ minHeight: '100px' }}>
          <button type="button" onClick={handlePrevious} className="btn btn-outline-secondary btn-sm">
            <ChevronLeft size={16} />
          </button>

          <div
            className="flex-grow-1 mx-2 border rounded p-3"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              lineHeight: '1.1', // 🔽 tighter vertical spacing
              fontSize: 'inherit', // ✅ keep original font
            }}
          >
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

            {current.creator_id === localStorage.getItem('userId') && (
            <div className="mt-2 d-flex gap-2 justify-content-start">
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(current.id)}>
                Delete
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(current)}>
                Edit
              </button>
            </div>
            )}
          </div>

          <button type="button" onClick={handleNext} className="btn btn-outline-secondary btn-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal remains unchanged */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Study Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Session Name</Form.Label>
              <Form.Control
                type="text"
                value={editData?.name || ''}
                onChange={(e) => handleEditChange('name', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editData?.date || ''}
                onChange={(e) => handleEditChange('date', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="text"
                value={editData?.time || ''}
                onChange={(e) => handleEditChange('time', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editData?.location || ''}
                onChange={(e) => handleEditChange('location', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Mode</Form.Label>
              <Form.Select
                value={editData?.mode || ''}
                onChange={(e) => handleEditChange('mode', e.target.value)}
              >
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editData?.description || ''}
                onChange={(e) => handleEditChange('description', e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CurrentSessions;
