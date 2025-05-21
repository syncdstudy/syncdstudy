/* eslint-disable max-len */
// /* eslint-disable @typescript-eslint/no-shadow */
// /* eslint-disable @typescript-eslint/naming-convention */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable max-len */
// /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// /* eslint-disable no-alert */

// 'use client';

// import React, { useEffect, useState } from 'react';
// import supabase from '@/lib/supabaseClient';
// import { Modal, Button, Collapse } from 'react-bootstrap';
// import { Bell } from 'react-bootstrap-icons';

// interface Invite {
//   id: string;
//   name: string;
//   creator_id: string;
//   creatorUsername: string;
//   date: string; // ISO date string
//   time: string; // "HH:mm–HH:mm"
//   description: string;
//   location?: string;
//   mode?: string;
// }

// export default function SessionInvite() {
//   const [invites, setInvites] = useState<Invite[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);
//   const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Today: true, Tomorrow: true, Later: false });
//   const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   useEffect(() => {
//     async function loadInvites() {
//       if (!userId) return;
//       const res = await fetch(`/api/invites?userId=${userId}`);
//       const result = await res.json();

//       if (!res.ok || !Array.isArray(result)) {
//         console.error('Failed to load invites:', result);
//         return;
//       }

//       const sorted = [...result].sort(
//         (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
//       );
//       setInvites(sorted);
//     }
//     loadInvites();
//   }, [userId, refreshTrigger]);

//   useEffect(() => {
//     const handler = () => setRefreshTrigger(prev => prev + 1);
//     window.addEventListener('storage', handler);
//     return () => window.removeEventListener('storage', handler);
//   }, []);

//   const handleJoin = async (sessionId: string) => {
//     console.log('👉 Current userId:', userId);
//     if (!userId) {
//       alert('You must be logged in to join.');
//       return;
//     }

//     const { data: existing, error: fetchError } = await supabase
//       .from('participants')
//       .select('*')
//       .eq('user_id', userId)
//       .eq('session_id', sessionId)
//       .single();

//     if (!fetchError && existing) {
//       alert('You already joined this session.');
//       return;
//     }

//     const { error: insertError } = await supabase
//       .from('participants')
//       .insert([{ user_id: userId, session_id: sessionId }]);

//     if (insertError) {
//       alert('Failed to join session.');
//       return;
//     }

//     const joined = invites.find(i => i.id === sessionId)!;
//     setInvites(prev => prev.filter(i => i.id !== sessionId));

//     const sessionDate = new Date(joined.date).toISOString().split('T')[0];
//     const [startStr, endStr] = joined.time.split('–');
//     const start = new Date(`${sessionDate}T${startStr}:00-10:00`);
//     const end = new Date(`${sessionDate}T${endStr}:00-10:00`);

//     const mode = joined.mode?.toLowerCase() || '';
//     let defaultColor = '#d0e8ff';

//     if (mode.includes('zoom') || mode.includes('online')) {
//       defaultColor = '#b3e5b9';
//     } else if (mode.includes('in person') || mode.includes('in-person')) {
//       defaultColor = '#ffd6e7';
//     }

//     const { error: insertEventError } = await supabase.from('calendar_events').insert([
//       {
//         user_id: userId,
//         title: joined.name,
//         start,
//         end,
//         color: defaultColor,
//         description: joined.description,
//         location: joined.location ?? null,
//         mode: joined.mode ?? null,
//       },
//     ]);

//     if (insertEventError) {
//       console.error('Failed to save calendar event:', insertEventError);
//       alert('Joined session, but failed to add to calendar.');
//     } else {
//       alert('Successfully joined session and added to your calendar!');
//     }

//     // ✅ Add 3 points to user regardless of calendar insert result
//     const { data: currentUser, error: userError } = await supabase
//       .from('app_users')
//       .select('points')
//       .eq('id', userId)
//       .single();
//     console.log('✅ Current user points fetched:', currentUser);
//     const newPoints = (currentUser?.points || 0) + 3;
//     console.log('💾 Attempting to update to:', newPoints);

//     if (!userError && currentUser) {
//       const newPoints = (currentUser.points || 0) + 3;

//       const { error: updateError } = await supabase
//         .from('app_users')
//         .update({ points: newPoints })
//         .eq('id', userId);

//       if (updateError) {
//         console.error('⚠️ Failed to update points:', updateError);
//       } else {
//         console.log('✅ Points updated to', newPoints);
//       }
//     } else {
//       console.error('⚠️ Could not retrieve current user points:', userError);
//     }
//   };

//   const handleIgnore = (sessionId: string) => {
//     setInvites(prev => prev.filter(i => i.id !== sessionId));
//   };

//   const groupedInvites = invites.reduce((acc: Record<string, Invite[]>, invite) => {
//     const formatter = new Intl.DateTimeFormat('en-CA', {
//       timeZone: 'Pacific/Honolulu',
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//     });

//     // Get today's and tomorrow's date strings in HST
//     const now = new Date();
//     const todayStr = formatter.format(new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' })));

//     const tomorrow = new Date();
//     tomorrow.setDate(now.getDate() + 1);
//     const tomorrowStr = formatter.format(new Date(tomorrow.toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' })));

//     const inviteDateStr = invite.date;

//     // Always check end time
//     const [_, endStr] = invite.time.split('–');
//     const endTime = new Date(`${invite.date}T${endStr}:00-10:00`);
//     const currentHST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));

//     // 🧹 If the session has already ended (no matter what day), skip it
//     if (endTime < currentHST) return acc;

//     // Grouping logic
//     let group: string;
//     if (inviteDateStr === todayStr) {
//       group = 'Today';
//     } else if (inviteDateStr === tomorrowStr) {
//       group = 'Tomorrow';
//     } else {
//       group = 'Later';
//     }

//     acc[group] = [...(acc[group] || []), invite];
//     return acc;
//   }, { Today: [], Tomorrow: [], Later: [] });

//   const orderedGroups = ['Today', 'Tomorrow', 'Later'];

//   return (
//     <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6', borderRadius: '15px' }}>
//       <h4 className="text-center mb-3">Session Invites</h4>
//       <div
//         style={{
//           maxHeight: '330px',
//           overflowY: 'auto',
//           backgroundColor: '#f8f2ff',
//           borderRadius: '10px',
//           boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)',
//           padding: '10px 9px 3px',
//         }}
//       >
//         {invites.length === 0 ? (
//           <p className="text-center">No invites at the moment.</p>
//         ) : (
//           orderedGroups.map(group => (
//             <div key={group}>
//               <h6
//                 className="text-muted fw-bold mt-2 mb-2"
//                 style={{ cursor: 'pointer' }}
//                 onClick={() => setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }))}
//               >
//                 <span>
//                   {openGroups[group] ? '▾' : '▸'}
//                   {' '}
//                   {group}
//                 </span>
//                 {group === 'Today' && <Bell className="ms-2 text-warning" />}
//               </h6>
//               <Collapse in={openGroups[group]}>
//                 <div>
//                   {groupedInvites[group].length === 0 ? (
//                     <p className="text-muted text-center mb-3">
//                       No sessions for
//                       {' '}
//                       {group.toLowerCase()}
//                       .
//                     </p>
//                   ) : (
//                     groupedInvites[group].map(session => (
//                       <div
//                         key={session.id}
//                         className="border rounded p-3 mb-3 mx-2"
//                         style={{ backgroundColor: '#ffffff', borderRadius: '6px' }}
//                       >
//                         <p className="mb-2" role="button" onClick={() => { setSelectedInvite(session); setShowModal(true); }}>
//                           {session.creatorUsername}
//                           {' '}
//                           just created a session for
//                           <strong>
//                             {' '}
//                             {session.name}
//                           </strong>
//                           <br />
//                           <small className="text-muted">
//                             {(() => {
//                               const [year, month, day] = session.date.split('-');
//                               return `${month}/${day}/${year}`;
//                             })()}
//                             {' '}
//                             •
//                             {' '}
//                             {session.time}
//                           </small>
//                         </p>
//                         <div className="d-flex justify-content-start gap-2">
//                           <button type="button" className="custom-button-4 btn-sm" onClick={() => handleJoin(session.id)}>Join</button>
//                           <button type="button" className="custom-button-1 btn-sm" onClick={() => handleIgnore(session.id)}>Ignore</button>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </Collapse>
//             </div>
//           ))
//         )}
//       </div>

//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton><Modal.Title>Session Details</Modal.Title></Modal.Header>
//         <Modal.Body>
//           {selectedInvite && (
//             <>
//               <p>
//                 <strong>Title:</strong>
//                 {' '}
//                 {selectedInvite.name}
//               </p>
//               <p>
//                 <strong>Date:</strong>
//                 {' '}
//                 {(() => {
//                   const [year, month, day] = selectedInvite.date.split('-');
//                   return `${month}/${day}/${year}`;
//                 })()}
//               </p>
//               <p>
//                 <strong>Time:</strong>
//                 {' '}
//                 {selectedInvite.time}
//               </p>
//               <p>
//                 <strong>Location:</strong>
//                 {' '}
//                 {selectedInvite.location || 'N/A'}
//               </p>
//               <p>
//                 <strong>Mode:</strong>
//                 {' '}
//                 {selectedInvite.mode || 'N/A'}
//               </p>
//               <p>
//                 <strong>Description:</strong>
//                 {' '}
//                 {selectedInvite.description}
//               </p>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-alert */

'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { Modal, Button, Collapse } from 'react-bootstrap';
import { Bell } from 'react-bootstrap-icons';

function formatDateHST(isoString: string) {
  try {
    const dateUTC = new Date(isoString);

    // Add 10 hours (in ms) to shift to Hawaii time correctly
    const offsetDate = new Date(dateUTC.getTime() + 10 * 60 * 60 * 1000);

    return offsetDate.toLocaleDateString('en-US', {
      timeZone: 'Pacific/Honolulu',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
}



interface Invite {
  id: string;
  name: string;
  creator_id: string;
  creatorUsername: string;
  date: string;
  time: string;
  description: string;
  location?: string;
  mode?: string;
}

export default function SessionInvite() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Today: true, Tomorrow: true, Later: false });
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchUserId() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log('🔐 Authenticated user ID:', user.id);
      } else {
        console.warn('⚠️ No authenticated user found:', error);
      }
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    async function loadInvites() {
      if (!userId) return;
      const res = await fetch(`/api/invites?userId=${userId}`);
      const result = await res.json();

      if (!res.ok || !Array.isArray(result)) {
        console.error('Failed to load invites:', result);
        return;
      }

      const sorted = [...result].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setInvites(sorted);
    }
    loadInvites();
  }, [userId, refreshTrigger]);

  useEffect(() => {
    const handler = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

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

    const joined = invites.find(i => i.id === sessionId)!;
    setInvites(prev => prev.filter(i => i.id !== sessionId));

    const sessionDate = new Date(joined.date).toISOString().split('T')[0];
    const [startStr, endStr] = joined.time.split('–');
    const start = new Date(`${sessionDate}T${startStr}:00-10:00`);
    const end = new Date(`${sessionDate}T${endStr}:00-10:00`);

    const mode = joined.mode?.toLowerCase() || '';
    let defaultColor = '#d0e8ff';

    if (mode.includes('zoom') || mode.includes('online')) {
      defaultColor = '#b3e5b9';
    } else if (mode.includes('in person') || mode.includes('in-person')) {
      defaultColor = '#ffd6e7';
    }

    await supabase.from('calendar_events').insert([
      {
        user_id: userId,
        title: joined.name,
        start,
        end,
        color: defaultColor,
        description: joined.description,
        location: joined.location ?? null,
        mode: joined.mode ?? null,
      },
    ]);

    // 1️⃣ Count how many sessions the user has joined
const { count: joinedCount } = await supabase
.from('participants')
.select('*', { count: 'exact', head: true })
.eq('user_id', userId);

// 2️⃣ Get all join timestamps
const { data: joinedSessions } = await supabase
.from('participants')
.select('created_at')
.eq('user_id', userId);

// 3️⃣ Calculate study streak from those timestamps
function calculateStreak(dates: string[]): number {
const sorted = dates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
let streak = 0;
let current = new Date();
current.setHours(0, 0, 0, 0);
for (const date of sorted) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() === current.getTime()) {
    streak++;
    current.setDate(current.getDate() - 1);
  } else if (d.getTime() === current.getTime() - 86400000) {
    streak++;
    current.setDate(current.getDate() - 1);
  } else {
    break;
  }
}
return streak;
}

const streak = calculateStreak(joinedSessions?.map(s => s.created_at) || []);

// 4️⃣ Update app_users with new stats
await supabase
.from('app_users')
.update({
  sessions_joined: joinedCount || 0,
  study_streak: streak,
})
.eq('id', userId);


    // ✅ Add 3 points to user
    const { data: currentUser, error: userError } = await supabase
      .from('app_users')
      .select('points')
      .eq('id', userId)
      .single();

    if (!userError && currentUser) {
      const newPoints = (currentUser.points || 0) + 3;

      const { data: updatedUser, error: updateError } = await supabase
        .from('app_users')
        .update({ points: newPoints })
        .eq('id', userId)
        .select();

      if (updateError) {
        console.error('⚠️ Failed to update points:', updateError);
      } else if (!updatedUser || updatedUser.length === 0) {
        console.warn('⚠️ Update did not return any rows. Check if user ID exists:', userId);
      } else {
        console.log('✅ Points successfully updated:', updatedUser[0]);
      }

      if (updateError) {
        console.error('⚠️ Failed to update points:', updateError);
      } else {
        console.log('✅ Points updated to', newPoints);
      }
    } else {
      console.error('⚠️ Could not retrieve current user points:', userError);
    }
  };

  const handleIgnore = (sessionId: string) => {
    setInvites(prev => prev.filter(i => i.id !== sessionId));
  };

  const groupedInvites = invites.reduce((acc: Record<string, Invite[]>, invite) => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Pacific/Honolulu',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const now = new Date();
    const todayStr = formatter.format(new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' })));
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = formatter.format(new Date(tomorrow.toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' })));

    const inviteDate = new Date(new Date(invite.date).getTime() + 10 * 60 * 60 * 1000);
    const inviteDateStr = formatter.format(inviteDate);
    const [_, endStr] = invite.time.split('–');
    const endTime = new Date(`${invite.date}T${endStr}:00-10:00`);
    const currentHST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));

    if (endTime < currentHST) return acc;

    let group: string;
    if (inviteDateStr === todayStr) {
      group = 'Today';
    } else if (inviteDateStr === tomorrowStr) {
      group = 'Tomorrow';
    } else {
      group = 'Later';
    }

    acc[group] = [...(acc[group] || []), invite];
    return acc;
  }, { Today: [], Tomorrow: [], Later: [] });

  const orderedGroups = ['Today', 'Tomorrow', 'Later'];

  return (
    <div className="border border-dark p-4 rounded shadow" style={{ backgroundColor: '#e5d8f6', borderRadius: '15px' }}>
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
          orderedGroups.map(group => (
            <div key={group}>
              <h6
                className="text-muted fw-bold mt-2 mb-2"
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }))}
              >
                <span>
                  {openGroups[group] ? '▾' : '▸'}
                  {' '}
                  {group}
                </span>
                {group === 'Today' && <Bell className="ms-2 text-warning" />}
              </h6>
              <Collapse in={openGroups[group]}>
                <div>
                  {groupedInvites[group].length === 0 ? (
                    <p className="text-muted text-center mb-3">
                      No sessions for
                      {group.toLowerCase()}
                      .
                    </p>
                  ) : (
                    groupedInvites[group].map(session => (
                      <div key={session.id} className="border rounded p-3 mb-3 mx-2" style={{ backgroundColor: '#ffffff', borderRadius: '6px' }}>
                        <p className="mb-2" role="button" onClick={() => { setSelectedInvite(session); setShowModal(true); }}>
                          {session.creatorUsername}
                          {' '}
                          just created a session for
                          {' '}
                          <strong>{session.name}</strong>
                          <br />
                          <small className="text-muted">
                          {session.date ? formatDateHST(session.date) : 'Invalid Date'}

  {' '}•{' '}
  {(() => {
    const [startStr, endStr] = session.time.split('–');

    const formatTime = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      const t = new Date();
      t.setHours(hour, minute);
      return t.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Pacific/Honolulu',
      });
    };

    return `${formatTime(startStr)} – ${formatTime(endStr)}`;
  })()}
</small>


                        </p>
                        <div className="d-flex justify-content-start gap-2">
                          <button type="button" className="custom-button-4 btn-sm" onClick={() => handleJoin(session.id)}>Join</button>
                          <button type="button" className="custom-button-1 btn-sm" onClick={() => handleIgnore(session.id)}>Ignore</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Collapse>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Session Details</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedInvite && (
            <>
              <p>
                <strong>Title:</strong>
                {' '}
                {selectedInvite.name}
              </p>
              <p>
  <strong>Date:</strong>{' '}
  {selectedInvite.date ? formatDateHST(selectedInvite.date) : 'Invalid Date'}
</p>

<p>
  <strong>Time:</strong>{' '}
  {(() => {
    const [startStr, endStr] = selectedInvite.time.split('–');

    const formatTime = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      const t = new Date();
      t.setHours(hour, minute);
      return t.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Pacific/Honolulu',
      });
    };

    return `${formatTime(startStr)} – ${formatTime(endStr)}`;
  })()}
</p>

              <p>
                <strong>Location:</strong>
                {' '}
                {selectedInvite.location || 'N/A'}
              </p>
              <p>
                <strong>Mode:</strong>
                {' '}
                {selectedInvite.mode || 'N/A'}
              </p>
              <p>
                <strong>Description:</strong>
                {' '}
                {selectedInvite.description}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}