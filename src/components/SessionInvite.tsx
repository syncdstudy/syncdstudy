import React from 'react';

const SessionInvites = () => (
  <div
    className="border border-dark p-4 rounded shadow"
    style={{ backgroundColor: '#e5d8f6', borderRadius: '15px' }}
  >
    <h4 className="text-center mb-3">Session Invites</h4>
    <div
      style={{
        maxHeight: '330px',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        msOverflowStyle: 'auto',
        paddingRight: '9px',
        backgroundColor: '#f8f2ff',
        borderRadius: '10px',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)',
        paddingTop: '10px',
        paddingBottom: '3px',
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="border rounded p-3 mb-3 mx-3"
          style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
        >
          <p className="mb-2">
            [Name] just created a session for
            {i === 4 ? 'CHEM 161 RIGHT NOW!' : ['ICS 211', 'MATH 307', 'CHEM 161'][i - 1]}
          </p>
          <div className="d-flex justify-content-start gap-2">
            <button type="button" className="custom-button-4 btn-sm">Join</button>
            <button type="button" className="custom-button-1 btn-sm">Ignore</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SessionInvites;
