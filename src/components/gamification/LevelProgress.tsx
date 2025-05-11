'use client';

import { Card } from 'react-bootstrap';

interface Level {
  name: string;
  requiredPoints: number;
  perks: string[];
}

interface LevelProgressProps {
  currentPoints: number;
}

const LevelProgress = ({ currentPoints }: LevelProgressProps) => {
  const levels: Level[] = [
    { name: 'Beginner', requiredPoints: 0, perks: ['Access to basic courses'] },
    { name: 'Intermediate', requiredPoints: 100, perks: ['Access to intermediate courses', '1 free session'] },
    { name: 'Advanced', requiredPoints: 300, perks: ['Access to advanced courses', '2 free sessions'] },
    { name: 'Expert', requiredPoints: 600, perks: ['Access to expert courses', '3 free sessions'] },
  ];

  const currentLevel = levels.find((level) => currentPoints < level.requiredPoints) || levels[levels.length - 1];

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-primary text-white">
        <h3 className="mb-0">Level Progress</h3>
      </Card.Header>
      <Card.Body>
        <h5>
          Your Current Level:
          {currentLevel.name}
        </h5>
        <p>
          Points Required for Next Level:
          {currentLevel.requiredPoints - currentPoints}
        </p>
        <ul>
          {currentLevel.perks.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default LevelProgress;
