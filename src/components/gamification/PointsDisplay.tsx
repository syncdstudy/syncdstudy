'use client';

import { Card } from 'react-bootstrap';

interface PointsDisplayProps {
  points: number;
  level: string;
  nextLevelPoints: number;
}

const PointsDisplay = ({ points, level, nextLevelPoints }: PointsDisplayProps) => {
  const progress = (points / nextLevelPoints) * 100;

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Your Progress</h4>
          <span className="badge bg-primary">{level}</span>
        </div>

        <div className="text-center mb-3">
          <h2 className="mb-0">{points}</h2>
          <small className="text-muted">Total Points</small>
        </div>

        <div className="progress mb-2">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-labelledby="progress-label"
          />
        </div>

        <small id="progress-label" className="text-muted">
          {nextLevelPoints - points}
          {' '}
          points until next level
        </small>
      </Card.Body>
    </Card>
  );
};

export default PointsDisplay;
