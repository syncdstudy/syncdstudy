'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  dateEarned?: Date;
}

const AchievementsComponent = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchAchievements = async () => {
      // Simulated data - replace with actual API fetch
      const dummyAchievements: Achievement[] = [
        {
          id: '1',
          name: 'First Session',
          description: 'Complete your first study session',
          icon: '🎓',
          earned: true,
          dateEarned: new Date(),
        },
        {
          id: '2',
          name: 'Helpful Sensei',
          description: 'Help 5 students in study sessions',
          icon: '⭐',
          earned: false,
        },
        // Add more achievements as needed
      ];
      setAchievements(dummyAchievements);
    };

    fetchAchievements();
  }, []);

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-success text-white">
        <h3 className="mb-0">Achievements</h3>
      </Card.Header>
      <Card.Body>
        <Row>
          {achievements.map((achievement) => (
            <Col key={achievement.id} xs={12} md={6} lg={4} className="mb-3">
              <Card className={`h-100 ${!achievement.earned ? 'bg-light' : ''}`}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <span className="fs-2 me-2">{achievement.icon}</span>
                    <div>
                      <h5 className="mb-0">{achievement.name}</h5>
                      <small className={achievement.earned ? 'text-success' : 'text-muted'}>
                        {achievement.earned ? 'Earned!' : 'Not earned yet'}
                      </small>
                    </div>
                  </div>
                  <p className="mb-0 small">{achievement.description}</p>
                  {achievement.dateEarned && (
                    <small className="text-muted">
                      Earned on:
                      {' '}
                      {achievement.dateEarned.toLocaleDateString()}
                    </small>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AchievementsComponent;
