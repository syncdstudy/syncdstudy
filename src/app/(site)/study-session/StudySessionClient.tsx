/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React, { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import CurrentSessions from '@/components/CurrentSession';
import SessionInvite from '@/components/SessionInvite';
import 'react-toastify/dist/ReactToastify.css';

export default function StudySessionClient() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleReset = () => formRef.current?.reset();

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
    const mode = formData.get('mode')?.toString().trim() || '';

    if (!subject || !course || !date || !startTime || !endTime || !mode) {
      alert('Please fill out all required fields.');
      return;
    }

    // Get current time in HST
    const nowHST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));

    // Parse start and end times in HST
    const startDateTime = new Date(`${date}T${startTime}:00-10:00`);
    const endDateTime = new Date(`${date}T${endTime}:00-10:00`);

    console.log('🕒 Validation:', {
      nowHST,
      startDateTime,
      endDateTime,
    });

    // ❌ Block if the full start datetime is in the past
    if (startDateTime <= nowHST) {
      alert('Start time must be in the future.');
      return;
    }

    // ❌ Block if end time is not after start
    if (endDateTime <= startDateTime) {
      alert('End time must be after start time.');
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
      const errorText = await res.text();
      alert(`Failed to create session: ${errorText}`);
    }
  };

  return (
    <main className="py-5 px-3">
      <div className="container">
        <div className="row justify-content-center g-7 align-items-stretch">
          <div className="col-lg-7">
            <div className="border border-dark p-5 rounded shadow" style={{ backgroundColor: '#e5d8f6' }}>
              <h4 className="text-center mb-2" style={{ fontSize: '28px' }}>
                Create a Study Session
              </h4>
              <p className="text-center text-muted mb-3" style={{ fontSize: '0.95rem' }}>
                Fill out the form below to share your study session with others!
              </p>
              <div
                className="mb-4 p-4 rounded-3 shadow"
                style={{
                  background: '#f6f4fe',
                  border: '1px solid #d2c7ee',
                  fontSize: '0.95rem',
                }}
              >
                <h5 className="fw-semibold mb-3" style={{ color: '#5a3fa0' }}>
                  ✨ Tips for Creating a Great Session
                </h5>
                <ul className="mb-0" style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li>
                    Use clear course names like
                    <em> ICS 314 - Midterm Review</em>
                  </li>
                  <li>Add a short description so others know what you'll cover</li>
                  <li>If it's in person, include the exact building + room number</li>
                  <li>Make sure the date and time are correct before submitting</li>
                </ul>
              </div>

              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="d-flex gap-3">
                  <input name="subject" type="text" className="form-control mb-3" placeholder="Course (e.g. ICS 314)" required />
                  <input name="course" type="text" className="form-control mb-3" placeholder="Subject (e.g. Software Engineering)" required />
                </div>
                <div className="d-flex gap-2 mb-3">
                  <input
                    name="date"
                    type="date"
                    className="form-control"
                    min="2024-01-01"
                    max="2030-12-31"
                    style={{ minWidth: '180px', color: '#333', backgroundColor: '#fff' }}
                    required
                  />
                  <input
                    name="startTime"
                    type="text"
                    className="form-control"
                    placeholder="Start Time"
                    onFocus={e => (e.target.type = 'time')}
                    onBlur={e => (e.target.type = e.target.value ? 'time' : 'text')}
                    style={{ minWidth: '180px', color: '#888' }}
                    required
                  />
                  <input
                    name="endTime"
                    type="text"
                    className="form-control"
                    placeholder="End Time"
                    onFocus={e => (e.target.type = 'time')}
                    onBlur={e => (e.target.type = e.target.value ? 'time' : 'text')}
                    style={{ minWidth: '180px', color: '#888' }}
                    required
                  />
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <input name="location" type="text" className="form-control" placeholder="Location (If applicable)" />
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="mode" id="mode-online" value="Online" required />
                    <label htmlFor="mode-online" className="form-check-label">Online via Zoom</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="mode" id="mode-inperson" value="In-person" required />
                    <label htmlFor="mode-inperson" className="form-check-label">In Person</label>
                  </div>
                </div>
                <textarea
                  name="description"
                  className="form-control mb-3"
                  placeholder="Description"
                  rows={9}
                  style={{ resize: 'vertical', minHeight: '200px' }}
                />
                <div className="d-flex gap-3 justify-content-start">
                  <button type="submit" className="custom-button-4 px-4">Submit</button>
                  <button type="button" className="custom-button-2 px-4" onClick={handleReset}>Reset</button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-5 d-flex flex-column gap-4">
            <SessionInvite />
            <CurrentSessions />
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </main>
  );
}
