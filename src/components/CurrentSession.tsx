import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const sessions = [
  { date: '05/07/2025', subject: 'ICS 211', time: '2:00 PM', format: 'Online' },
  { date: '05/08/2025', subject: 'MATH 307', time: '3:30 PM', format: 'In-person' },
  { date: '05/09/2025', subject: 'ENG 100', time: '10:00 AM', format: 'Online' },
  { date: '05/10/2025', subject: 'CHEM 161', time: '1:00 PM', format: 'In-person' },
  { date: '05/11/2025', subject: 'PHY 151', time: '9:00 AM', format: 'Online' },
];

const CurrentSessions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sessions.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sessions.length) % sessions.length);
  };

  const currentSession = sessions[currentIndex];

  return (
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
            {currentSession.date}
            :
            {' '}
            {currentSession.subject}
            {' '}
            at
            {' '}
            {currentSession.time}
          </p>
          <button type="button" className="custom-button btn-sm">{currentSession.format}</button>
        </div>
        <button type="button" onClick={handleNext} className="custom-button-3 btn-sm">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CurrentSessions;
