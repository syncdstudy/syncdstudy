'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PointsDisplay from './PointsDisplay';
import LevelProgress from './LevelProgress';
import AchievementsComponent from './AchievementsComponent';
import LeaderboardComponent from './LeaderboardComponent';

interface UserGamificationData {
  points: number;
  level: string;
  nextLevelPoints: number;
  achievements: any[];
}

export default function GamificationPage() {
  const [userData] = useState<UserGamificationData>({
    points: 0,
    level: 'Beginner',
    nextLevelPoints: 100,
    achievements: [],
  });

  useEffect(() => {
    // TODO: Fetch user's gamification data
    // This is where you'll make an API call to get the user's current stats
  }, []);

  return (
    <Container className="py-4">
      <h1 className="mb-4">Your Progress</h1>
      <Row>
        <Col md={4}>
          <PointsDisplay
            points={userData.points}
            level={userData.level}
            nextLevelPoints={userData.nextLevelPoints}
          />
        </Col>
        <Col md={8}>
          <LevelProgress currentPoints={userData.points} />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <AchievementsComponent />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <LeaderboardComponent />
        </Col>
      </Row>
    </Container>
  );
}
