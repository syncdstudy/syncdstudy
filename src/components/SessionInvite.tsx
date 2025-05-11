/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-alert */

'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

const SessionInvite = () => {
  const [invites, setInvites] = useState<any[]>([]);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    const fetchInvites = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('StudySession')
        .select('*')
        .neq('creator_id', userId); // sessions not created by current user

      if (error) {
        console.error('Error fetching invites:', error);
      } else {
        setInvites(data || []);
      }
    };

    fetchInvites();
  }, [userId]);

  const handleJoin = async (sessionId: string) => {
    if (!userId) {
      alert('You must be logged in to join.');
      return;
    }

    const { data: existing, error: fetchError } = await supabase
      .from('participants')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .single();

    if (fetchError === null && existing) {
      alert('You already joined this session.');
      return;
    }

    const { error: insertError } = await supabase.from('participants').insert([
      { user_id: userId, session_id: sessionId },
    ]);

    if (insertError) {
      alert('Failed to join session.');
    } else {
      alert('Successfully joined session!');
    }
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
          invites.map((session) => (
            <div
              key={session.id}
              className="border rounded p-3 mb-3 mx-2"
              style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
            >
              <p className="mb-2">
                [Name] just created a session for <strong>{session.name}</strong>
              </p>
              <div className="d-flex justify-content-start gap-2">
                <button
                  type="button"
                  className="custom-button-4 btn-sm"
                  onClick={() => handleJoin(session.id)}
                >
                  Join
                </button>
                <button type="button" className="custom-button-1 btn-sm">
                  Ignore
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionInvite;
