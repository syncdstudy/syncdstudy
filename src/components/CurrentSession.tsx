/* eslint-disable no-alert */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import supabase from '@/lib/supabaseClient';
import { Modal, Button, Form } from 'react-bootstrap';

const CurrentSessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('StudySession')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions(data || []);
        setCurrentIndex(0);
      }
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
      alert('Failed to update session.');
      return;
    }

    const updatedSessions = sessions.map((s) => (s.id === editData.id ? { ...s, ...editData } : s));

    setSessions(updatedSessions);
    setShowModal(false);
  };

  if (sessions.length === 0) {
    return (
      <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6', borderRadius: '15px' }}>
        <h4 className="text-center mb-3">Current Sessions</h4>
        <p className="text-center">No study sessions available.</p>
      </div>
    );
  }

  const current = sessions[currentIndex];

  return (
    <>
      <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6', borderRadius: '15px' }}>
        <h4 className="text-center mb-3">Current Sessions</h4>
        <div className="d-flex align-items-center justify-content-between" style={{ minHeight: '100px' }}>
          <button type="button" onClick={handlePrevious} className="custom-button-3 btn-sm">
            <ChevronLeft size={18} />
          </button>

          <div
            className="flex-grow-1 mx-3 border rounded p-4"
            style={{ backgroundColor: '#ffffff', borderRadius: '8px', minWidth: '250px' }}
          >
            <p className="mb-1" style={{ fontWeight: 'bold' }}>
              {new Date(current.date).toLocaleDateString()}
              {' '}
              :
              {' '}
              {current.name}
              {' '}
              at
              {' '}
              {current.time}
            </p>
            <p className="mb-1">{current.location}</p>
            <button type="button" className="custom-button btn-sm">{current.mode}</button>

            {current.creator_id === localStorage.getItem('userId') && (
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

          <button type="button" onClick={handleNext} className="custom-button-3 btn-sm">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Study Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editName" className="mb-3">
              <Form.Label>Session Name</Form.Label>
              <Form.Control
                type="text"
                value={editData?.name || ''}
                onChange={(e) => handleEditChange('name', e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="editDate" className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editData?.date || ''}
                onChange={(e) => handleEditChange('date', e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="editTime" className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="text"
                value={editData?.time || ''}
                onChange={(e) => handleEditChange('time', e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="editLocation" className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editData?.location || ''}
                onChange={(e) => handleEditChange('location', e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="editMode" className="mb-3">
              <Form.Label>Mode</Form.Label>
              <Form.Select
                value={editData?.mode || ''}
                onChange={(e) => handleEditChange('mode', e.target.value)}
              >
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="editDescription" className="mb-3">
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
