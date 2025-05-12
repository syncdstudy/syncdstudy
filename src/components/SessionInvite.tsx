/* eslint-disable no-alert */

'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

interface Invite {
  id: string;
  name: string;
  creator_id: string;
  creatorUsername: string;
  date: string; // ISO date string
  time: string; // "HH:mm–HH:mm"
  description: string; // full session description
}

export default function SessionInvite() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    async function loadInvites() {
      if (!userId) return;
      const res = await fetch(`/api/invites?userId=${userId}`);
      const data: Invite[] = await res.json();
      console.log('📬 Invites loaded:', data);
      setInvites(data);
    }
    loadInvites();
  }, [userId]);

  const handleJoin = async (sessionId: string) => {
    if (!userId) {
      alert('You must be logged in to join.');
      return;
    }

    // 1) Persist in DB
    const { data: existing, error: fetchError } = await supabase
      .from('participants')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .single();

    if (!fetchError && existing) {
      alert('You already joined this session.');
      return;
    }

    const { error: insertError } = await supabase
      .from('participants')
      .insert([{ user_id: userId, session_id: sessionId }]);

    if (insertError) {
      alert('Failed to join session.');
      return;
    }

    // 2) Immediately remove from invites list
    const joined = invites.find(i => i.id === sessionId)!;
    setInvites(prev => prev.filter(i => i.id !== sessionId));

    // 3) Safely try to add to calendar storage
    const sessionDate = new Date(joined.date).toISOString().split('T')[0];
    const [startStr, endStr] = joined.time.split('–');
    const start = new Date(`${sessionDate}T${startStr}:00-10:00`);
    const end = new Date(`${sessionDate}T${endStr}:00-10:00`);

    const { error: insertEventError } = await supabase.from('calendar_events').insert([
      {
        user_id: userId,
        title: joined.name,
        start,
        end,
        color: '#d0e8ff',
        description: joined.description,
      },
    ]);

    if (insertEventError) {
      console.error('Failed to save calendar event:', insertEventError);
      alert('Joined session, but failed to add to calendar.');
    } else {
      alert('Successfully joined session and added to your calendar!');
    }
  };

  const handleIgnore = (sessionId: string) => {
    setInvites(prev => prev.filter(i => i.id !== sessionId));
  };

  return (
    <div
      className="border border-dark p-4 rounded shadow"
      style={{ backgroundColor: '#e5d8f6', borderRadius: '15px' }}
    >
      <h4 className="text-center mb-3">Session Invites</h4>
      <div
        style={{
          maxHeight: '330px',
          overflowY: 'auto',
          backgroundColor: '#f8f2ff',
          borderRadius: '10px',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)',
          padding: '10px 9px 3px',
        }}
      >
        {invites.length === 0 ? (
          <p className="text-center">No invites at the moment.</p>
        ) : (
          invites.map(session => (
            <div
              key={session.id}
              className="border rounded p-3 mb-3 mx-2"
              style={{ backgroundColor: '#ffffff', borderRadius: '6px' }}
            >
              <p className="mb-2">
                {session.creatorUsername}
                {' '}
                just created a session for
                {' '}
                <strong>{session.name}</strong>
              </p>
              <div className="d-flex justify-content-start gap-2">
                <button
                  type="button"
                  className="custom-button-4 btn-sm"
                  onClick={() => handleJoin(session.id)}
                >
                  Join
                </button>
                <button
                  type="button"
                  className="custom-button-1 btn-sm"
                  onClick={() => handleIgnore(session.id)}
                >
                  Ignore
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
