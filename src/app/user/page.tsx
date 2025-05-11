'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, ProgressBar, Badge } from 'react-bootstrap';
import { useRouter } from 'next/router';
import './UserHome.css'; // Import your CSS file for custom styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

interface UserStats {
  points: number;
  level: string;
  nextLevelPoints: number;
  rank: number;
  sessionsCompleted: number;
}
interface UserData {
  firstName: string;
  stats: UserStats;
  recentAchievements?: string[];
}

const UserHome = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/user/profile');
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to demo data if fetch fails
        setUser({
          firstName: 'Alex',
          stats: {
            points: 150,
            level: 'Intermediate',
            nextLevelPoints: 300,
            rank: 5,
            sessionsCompleted: 12,
          },
          recentAchievements: ['First Study Session', 'Helpful Sensei'],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div>Loading...</div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <div>Error loading user data. Please try again later.</div>
      </Container>
    );
  }

  const calculateProgress = () => {
    const current = user.stats.points;
    const next = user.stats.nextLevelPoints;
    return (current / next) * 100;
  };

  return (
    <main className="wrapper">
      <Container className="py-5 d-flex flex-column align-items-center justify-content-center">
        <div className="info-box mb-5">
          <h2>
            Welcome back,
            {' '}
            {user.firstName}
            !
          </h2>
          <p>Ready to collaborate and learn together?</p>
        </div>
        <Row className="mb-5">
          <Col lg={8}>
            <Card className="welcome-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2>
                    Welcome back,
                    {user.firstName}
                    !
                  </h2>
                  <Badge bg="primary" className="level-badge">
                    Level:
                    {' '}
                    {user.stats.level}
                  </Badge>
                </div>
                <Card.Text>Ready to collaborate and learn together?</Card.Text>
                <div className="progress-section mt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Progress to Next Level</span>
                    <span>
                      {user.stats.points}
                      {' '}
                      /
                      {' '}
                      {user.stats.nextLevelPoints}
                      {' '}
                      points
                    </span>
                  </div>
                  <ProgressBar now={calculateProgress()} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="stats-card">
              <Card.Body>
                <h4>Your Stats</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">{user.stats.rank}</div>
                    <div className="stat-label">Current Rank</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{user.stats.sessionsCompleted}</div>
                    <div className="stat-label">Sessions Completed</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="w-100 justify-content-center">
          <Col md={4} className="mb-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>My Courses</Card.Title>
                <Card.Text>Update your Sensei and Grasshopper courses.</Card.Text>
                <Button className="custom-button" onClick={() => router.push('/profile')}>
                  Edit Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Study Sessions</Card.Title>
                <Card.Text>View or schedule study sessions.</Card.Text>
                <Button className="custom-button" onClick={() => router.push('/sessions')}>
                  Manage Sessions
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Leaderboard</Card.Title>
                <Card.Text>Check your rank and earn rewards.</Card.Text>
                <Button className="custom-button" onClick={() => router.push('/leaderboard')}>
                  View Leaderboard
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="w-100 justify-content-center mt-4">
          <Col md={4} className="mb-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Calendar</Card.Title>
                <Card.Text>See all upcoming study sessions.</Card.Text>
                <Button className="custom-button" onClick={() => router.push('/calendar')}>
                  View Calendar
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Notifications</Card.Title>
                <Card.Text>Check for new session invites and updates.</Card.Text>
                <Button className="custom-button" onClick={() => router.push('/notifications')}>
                  View Notifications
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="w-100 justify-content-center mt-4">
          <Col md={4} className="mb-4">
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>Achievements</Card.Title>
                <div className="recent-achievements mb-3">
                  {user.recentAchievements?.map((achievement) => (
                    <Badge key={achievement} bg="success" className="me-2 mb-2">
                      {achievement}
                    </Badge>
                  ))}
                </div>
                <Button className="custom-button" onClick={() => router.push('/achievements')}>
                  View All
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default UserHome;
