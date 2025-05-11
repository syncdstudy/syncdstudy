'use client';

import { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  level: string;
  sessionsLed: number;
  sessionsAttended: number;
}

const getLevelColor = (level: string): string => {
  switch (level) {
    case 'Master':
      return 'danger';
    case 'Scholar':
      return 'success';
    case 'Student':
      return 'primary';
    default:
      return 'secondary';
  }
};

const LeaderboardComponent = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const dummyData: LeaderboardEntry[] = [
          { rank: 1, username: 'JohnDoe', points: 1200, level: 'Master', sessionsLed: 15, sessionsAttended: 20 },
          { rank: 2, username: 'JaneSmith', points: 1100, level: 'Scholar', sessionsLed: 12, sessionsAttended: 18 },
          { rank: 3, username: 'BobJohnson', points: 900, level: 'Student', sessionsLed: 8, sessionsAttended: 25 },
        ];
        setLeaderboard(dummyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h3 className="mb-0">Top Contributors</h3>
      </Card.Header>
      <Card.Body>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Points</th>
              <th>Level</th>
              <th>Sessions Led</th>
              <th>Sessions Attended</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry: LeaderboardEntry) => (
              <tr key={entry.username}>
                <td>{entry.rank}</td>
                <td>{entry.username}</td>
                <td>{entry.points}</td>
                <td>
                  <span className={`badge bg-${getLevelColor(entry.level)}`}>
                    {entry.level}
                  </span>
                </td>
                <td>{entry.sessionsLed}</td>
                <td>{entry.sessionsAttended}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default LeaderboardComponent;
