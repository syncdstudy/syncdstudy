/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-one-expression-per-line */

'use client';

import { useEffect, useState } from 'react';

type Session = {
  subject: string;
  date: string;
  time: string;
  description: string;
};

const UpcomingSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  // Step 5 will fill in this useEffect later

  return (
    <div
      className="p-3 rounded-4"
      style={{
        backgroundColor: '#e7dfff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        marginBottom: '1rem',
      }}
    >
      <h5 className="fw-bold mb-3 text-center">📚 Upcoming Sessions</h5>
      {sessions.length === 0 ? (
        <p className="text-muted text-center">No sessions joined yet.</p>
      ) : (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {sessions.map((session, i) => (
            <div
              key={i}
              className="mb-3 p-2"
              style={{
                background: '#fff',
                borderRadius: '0.75rem',
                border: '1px solid #ddd',
              }}
            >
              <strong>{session.subject}</strong>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                {session.date} @ {session.time}
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {session.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
