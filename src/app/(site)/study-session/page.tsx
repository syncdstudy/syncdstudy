/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-alert */

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
    const elements = form.elements as HTMLFormControlsCollection;

    const subject = (elements[0] as HTMLInputElement).value.trim();
    const course = (elements[1] as HTMLInputElement).value.trim();
    const date = (elements[2] as HTMLInputElement).value;
    const startTime = (elements[3] as HTMLInputElement).value;
    const endTime = (elements[4] as HTMLInputElement).value;
    const location = (elements[5] as HTMLInputElement).value.trim();
    const description = (elements[6] as HTMLTextAreaElement).value.trim();

    const modeRadios = form.querySelectorAll('input[name="mode"]');
    let mode = '';
    modeRadios.forEach((input: any) => {
      if (input.checked) mode = input.id === 'online' ? 'Online' : 'In-person';
    });

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
      window.location.reload(); // Or ideally: refresh just the session components
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
                  <input type="text" className="form-control mb-3" placeholder="Subject Name" />
                  <input type="text" className="form-control mb-3" placeholder="Course Name" />
                </div>
                <div className="d-flex gap-2 mb-3">
                  {/* Date Picker */}
                  <input
                    type="text"
                    className="form-control"
                    id="dateInput"
                    placeholder="Date"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = e.target.value ? 'date' : 'text')}
                    style={{ minWidth: '180px', color: '#888' }}
                  />
                  {/* Start Time Picker */}
                  <input
                    type="text"
                    className="form-control"
                    id="startTime"
                    placeholder="Start Time"
                    onFocus={(e) => (e.target.type = 'time')}
                    onBlur={(e) => (e.target.type = e.target.value ? 'time' : 'text')}
                    style={{ minWidth: '180px', color: '#888' }}
                  />

                  {/* End Time Picker */}
                  <input
                    type="text"
                    className="form-control"
                    id="startTime"
                    placeholder="End Time"
                    onFocus={(e) => (e.target.type = 'time')}
                    onBlur={(e) => (e.target.type = e.target.value ? 'time' : 'text')}
                    style={{ minWidth: '180px', color: '#888' }}
                  />
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <input type="text" className="form-control" placeholder="Location (If applicable)" />
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="mode" id="online" />
                    <label className="form-check-label" htmlFor="online">
                      <input className="form-check-input" type="radio" name="mode" id="online" />
                      Online via Zoom
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="mode" id="inperson" />
                    <label className="form-check-label" htmlFor="inperson">
                      <input className="form-check-input" type="radio" name="mode" id="inperson" />
                      In Person
                    </label>
                  </div>
                </div>
                <textarea
                  className="form-control mb-3"
                  placeholder="Description"
                  rows={9}
                  style={{ resize: 'vertical', minHeight: '290px' }}
                />
                <div className="d-flex gap-4 mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="timing" id="plan" />
                    <label className="form-check-label" htmlFor="plan">
                      <input className="form-check-input" type="radio" name="timing" id="plan" />
                      Plan Ahead
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="timing" id="now" />
                    <label className="form-check-label" htmlFor="now">
                      <input className="form-check-input" type="radio" name="timing" id="now" />
                      Right Now!
                    </label>
                  </div>
                </div>
                <div className="d-flex gap-3 justify-content-start">
                  <button type="submit" className="custom-button-4 px-4">Submit</button>
                  <button type="button" className="custom-button-2 px-4" onClick={handleReset}>Reset</button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Session Invites and Current Sessions */}
          <div className="col-lg-5 d-flex flex-column gap-4">

            {/* Session Invites */}
            <SessionInvite />
            {/* Current Sessions */}
            <CurrentSessions />
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </main>
  );
};

export default StudySessionPage;
