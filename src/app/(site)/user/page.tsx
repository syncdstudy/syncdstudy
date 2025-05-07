'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserHome = () => {
  const router = useRouter();

  // Simulated user data; replace with actual authentication logic
  const [user] = useState({ firstName: 'Alex' });

  useEffect(() => {
    // TODO: Implement real user authentication and data fetching
  }, []);

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
      </Container>
    </main>
  );
};

export default UserHome;
