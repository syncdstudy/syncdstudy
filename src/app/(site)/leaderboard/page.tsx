'use client';

import React from 'react';
import '@/app/globals.css';

const LeaderboardPage = () => {
  const announcements = 'No announcement yet. Stay tuned for updates & awards.';
  const leaderboardData = [
    { username: 'User948', points: 150 },
    { username: 'User456', points: 120 },
    { username: 'User789', points: 100 },
    { username: 'User101', points: 80 },
    { username: 'User102', points: 70 },
    { username: 'User567', points: 60 },
    { username: 'User890', points: 50 },
    { username: 'User654', points: 40 },
    { username: 'User321', points: 30 },
    { username: 'User123', points: 20 },
    { username: 'User111', points: 10 },
    { username: 'User222', points: 5 },
    { username: 'User333', points: 2 },
    { username: 'User444', points: 1 },
  ];

  // Helper function for rank icons
  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <div className="leaderboard-container">
      <div className="info-box">
        <h2>📢 Announcements</h2>
        <p>{announcements}</p>
      </div>

      <div className="leaderboard">
        <h2 className="leaderboard-title">🏆 Leaderboard</h2>
        <ul className="leaderboard-list">
          {leaderboardData.map((user, index) => (
            <li key={user.username} className="leaderboard-item">
              <span>
                {getRankIcon(index)}
                {' '}
                {user.username}
              </span>
              <span>
                {user.points}
                {' '}
                points
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeaderboardPage;
