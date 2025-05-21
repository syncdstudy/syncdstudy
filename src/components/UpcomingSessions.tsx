/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */

'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

type Session = {
  subject: string;
  date: string;
  time: string;
  description: string;
};

const UpcomingSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchJoinedSessions = async () => {
      const userId = localStorage.getItem('userId');
      console.log('USER ID:', userId); // ✅ LOG userId to verify

      if (!userId) return;

      const { data, error } = await supabase
        .from('participants')
        .select(`
    StudySession:StudySession (
      name,
      date,
      time,
      description
    )
  `)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Supabase error:', error);
        return;
      }

      console.log('✅ RAW data from Supabase:', data); // ✅ LOG raw result

      const sessions = data
        .map((entry: any) => entry.StudySession)
        .filter((s: any) => !!s && !!s.date); // ignore null or bad entries

      console.log('🎯 Filtered sessions:', sessions); // ✅ LOG filtered sessions

      const formatted = sessions.map((s: any) => ({
        subject: s.name,
        date: new Date(s.date).toLocaleDateString(),
        time: s.time,
        description: s.description ?? '',
      }));

      setSessions(formatted);
    };

    fetchJoinedSessions();
  }, []);

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
                {session.date}
                {' '}
                @
                {session.time}
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
