'use client';

import { Container, Row, Col, Form, Button, Card, Table } from 'react-bootstrap';
import { useState } from 'react';

interface LevelSettings {
  name: string;
  requiredPoints: number;
  perks: string[];
}

export default function GamificationAdminPage() {
  const [levels] = useState<LevelSettings[]>([
    { name: 'Beginner', requiredPoints: 0, perks: ['Access to basic courses'] },
    { name: 'Intermediate', requiredPoints: 100, perks: ['Access to intermediate courses', '1 free session'] },
    { name: 'Advanced', requiredPoints: 300, perks: ['Access to advanced courses', '2 free sessions'] },
    { name: 'Expert', requiredPoints: 600, perks: ['Access to expert courses', '3 free sessions'] },
  ]);

  const [pointSettings, setPointSettings] = useState({
    sessionAttendance: 10,
    sessionHosting: 20,
    feedbackSubmission: 5,
    perfectAttendance: 15,
  });

  const handlePointSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update point settings in database
  };

  const handleManualPointsAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement manual points adjustment
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Gamification Administration</h1>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h3>Point Settings</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePointSettingsUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Session Attendance Points</Form.Label>
                  <Form.Control
                    type="number"
                    value={pointSettings.sessionAttendance}
                    onChange={(e) => setPointSettings({
                      ...pointSettings,
                      sessionAttendance: parseInt(e.target.value, 10),
                    })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Session Hosting Points</Form.Label>
                  <Form.Control
                    type="number"
                    value={pointSettings.sessionHosting}
                    onChange={(e) => setPointSettings({
                      ...pointSettings,
                      sessionHosting: parseInt(e.target.value, 10),
                    })}
                  />
                </Form.Group>

                <Button type="submit">Update Settings</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h3>Manual Points Adjustment</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleManualPointsAdjustment}>
                <Form.Group className="mb-3">
                  <Form.Label>User Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter user email" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Points to Add/Subtract</Form.Label>
                  <Form.Control type="number" placeholder="Enter points (negative for subtraction)" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Reason</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>

                <Button type="submit">Adjust Points</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h3>Level Settings</h3>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Level Name</th>
                    <th>Required Points</th>
                    <th>Perks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((level) => (
                    <tr key={level.name}>
                      <td>{level.name}</td>
                      <td>{level.requiredPoints}</td>
                      <td>{level.perks.join(', ')}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
