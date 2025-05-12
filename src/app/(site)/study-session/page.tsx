/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React, { useRef } from 'react';
import CurrentSessions from '@/components/CurrentSession';
import SessionInvite from '@/components/SessionInvite';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudySessionPage = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleReset = () => {
    formRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in!');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const subject = formData.get('subject')?.toString().trim() || '';
    const course = formData.get('course')?.toString().trim() || '';
    const date = formData.get('date')?.toString() || '';
    const startTime = formData.get('startTime')?.toString() || '';
    const endTime = formData.get('endTime')?.toString() || '';
    const location = formData.get('location')?.toString().trim() || '';
    const description = formData.get('description')?.toString().trim() || '';
    const mode = formData.get('mode')?.toString() || '';

    if (!subject || !course || !date || !startTime || !endTime || !mode) {
      alert('Please fill out all required fields.');
      return;
    }

    const session = {
      name: `${subject} - ${course}`,
      date,
      time: `${startTime}–${endTime}`,
      location,
      mode,
      description,
      creator_id: userId,
    };

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });

    if (res.ok) {
      toast.success('Study session created!');
      formRef.current?.reset();
      window.location.reload();
    } else {
      alert('Failed to create study session.');
    }
  };

  return (
    <main className="py-5 px-3">
      <div className="container">
        <div className="row justify-content-center g-4 align-items-stretch">
          {/* Create a Study Session */}
          <div className="col-lg-7">
            <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6' }}>
              <h4 className="text-center mb-4">Create a Study Session</h4>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="d-flex gap-2">
                  <input name="subject" type="text" className="form-control mb-3" placeholder="Subject (e.g. ICS 314)" />
                  <input name="course" type="text" className="form-control mb-3" placeholder="Course (e.g. Software Engineering" />
                </div>
                <div className="d-flex gap-2 mb-3">
                  <input
                    name="date"
                    type="text"
                    className="form-control"
                    placeholder="Date"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = e.target.value ? 'date' : 'text')}
                    style={{ minWidth: '180px', color: '#888' }}
                  />
                  <input
                    name="startTime"
                    type="text"
                    className="form-control"
                    placeholder="Start Time"
                    onFocus={(e) => (e.target.type = 'time')}
                    onBlur={(e) => (e.target.type = e.target.value ? 'time' : 'text')}
                    style={{ minWidth: '180px', color: '#888' }}
                  />
                  <input
                    name="endTime"
                    type="text"
                    className="form-control"
                    placeholder="End Time"
                    onFocus={(e) => (e.target.type = 'time')}
                    onBlur={(e) => (e.target.type = e.target.value ? 'time' : 'text')}
                    style={{ minWidth: '180px', color: '#888' }}
                  />
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <input name="location" type="text" className="form-control" placeholder="Location (If applicable)" />

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="mode"
                      id="mode-online"
                      value="Online"
                    />
                    <label htmlFor="mode-online" className="form-check-label">
                      Online via Zoom
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="mode"
                      id="mode-inperson"
                      value="In-person"
                    />
                    <label htmlFor="mode-inperson" className="form-check-label">
                      In Person
                    </label>
                  </div>
                </div>
                <textarea
                  name="description"
                  className="form-control mb-3"
                  placeholder="Description"
                  rows={9}
                  style={{ resize: 'vertical', minHeight: '290px' }}
                />
                <div className="d-flex gap-3 justify-content-start">
                  <button type="submit" className="custom-button-4 px-4">Submit</button>
                  <button type="button" className="custom-button-2 px-4" onClick={handleReset}>Reset</button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Session Invites and Current Sessions */}
          <div className="col-lg-5 d-flex flex-column gap-4">
            <SessionInvite />
            <CurrentSessions />
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </main>
  );
};

export default StudySessionPage;
