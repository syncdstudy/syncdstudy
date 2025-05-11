'use client';

import { useState, SetStateAction } from 'react';
import { Calendar, dateFnsLocalizer, Views, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  parse,
  getDay,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Container, Row, Col, Card, Button, Form, Tab, Tabs, Table, Badge } from 'react-bootstrap';

// Define custom event interface
interface CustomEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  level: string;
  sessionsLed: number;
  sessionsAttended: number;
}

interface GamificationSettings {
  pointsPerSession: number;
  pointsPerHosting: number;
  bonusPoints: number;
  levelThresholds: {
    [key: string]: number;
  };
}

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// initial events
const initialEvents: CustomEvent[] = [
  {
    id: '1',
    title: 'ICS 314 Study Group',
    start: new Date(2025, 3, 23, 14, 0),
    end: new Date(2025, 3, 23, 15, 30),
    color: '#b3e5b9',
    description: 'Chapter 5 Review + Homework Help',
  },
  {
    id: '2',
    title: 'MATH 307 Review',
    start: new Date(2025, 3, 25, 10, 0),
    end: new Date(2025, 3, 25, 11, 0),
    color: '#f7c6c7',
    description: 'Exam Prep for Linear Algebra',
  },
  {
    id: '3',
    title: 'ENG 100 Session',
    start: new Date(2025, 3, 26, 9, 0),
    end: new Date(2025, 3, 26, 10, 0),
    color: '#ffe79e',
    description: 'Peer review workshop in writing center',
  },
];

const AdminPage = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<string>(Views.MONTH);
  const [events] = useState<CustomEvent[]>(initialEvents);
  const [todos, setTodos] = useState([
    { id: '1', text: 'Review notes', completed: false },
    { id: '2', text: 'Watch lecture', completed: false },
    { id: '3', text: 'Email TA', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [activityFeed] = useState<{ id: string; text: string }[]>([
    { id: '1', text: 'User 12345 joined the app' },
    { id: '2', text: 'User 23423 joined the app' },
    { id: '3', text: 'User 56789 started a new study session' },
  ]);
  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      username: 'JohnDoe',
      points: 500,
      level: 'Expert',
      sessionsLed: 15,
      sessionsAttended: 20,
    },
    {
      rank: 2,
      username: 'JaneSmith',
      points: 450,
      level: 'Advanced',
      sessionsLed: 12,
      sessionsAttended: 18,
    },
  ]);

  const [gamificationSettings, setGamificationSettings] = useState<GamificationSettings>({
    pointsPerSession: 10,
    pointsPerHosting: 20,
    bonusPoints: 50,
    levelThresholds: {
      Beginner: 0,
      Intermediate: 100,
      Advanced: 300,
      Expert: 600,
    },
  });

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: newTodo.trim(), completed: false },
      ]);
      setNewTodo('');
    }
  };

  const handleGamificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update gamification settings in database
    console.log('Updating gamification settings:', gamificationSettings);
  };

  const toggleTodoComplete = (id: string) => {
    setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };
  const removeTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const moveDate = (dir: 'NEXT' | 'PREV') => {
    const amt = dir === 'NEXT' ? 1 : -1;
    let next: Date;
    switch (currentView) {
      case Views.MONTH:
        next = amt > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
        break;
      case Views.WEEK:
        next = amt > 0 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1);
        break;
      case Views.DAY:
      case Views.AGENDA:
        next = amt > 0 ? addDays(currentDate, 1) : subDays(currentDate, 1);
        break;
      default:
        next = new Date();
    }
    setCurrentDate(next);
  };

  return (
    <main className="p-4">
      <Container fluid>
        <Row className="justify-content-center mt-5">
          {/* Calendar Section */}
          <Col lg={8}>
            <Card style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2rem' }}>
              <h3 className="text-center mb-2">Calendar</h3>
              <h5 className="text-center mb-3">{format(currentDate, 'MMMM yyyy')}</h5>

              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div className="d-flex flex-wrap gap-2">
                  <Button variant="outline-secondary" onClick={() => moveDate('PREV')}>Back</Button>
                  <Button variant="outline-secondary" onClick={() => moveDate('NEXT')}>Next</Button>
                </div>
                <Button variant="outline-primary" onClick={() => setCurrentView(Views.MONTH)}>Month</Button>
                <Button variant="outline-primary" onClick={() => setCurrentView(Views.WEEK)}>Week</Button>
                <Button variant="outline-primary" onClick={() => setCurrentView(Views.DAY)}>Day</Button>
                <Button variant="outline-primary" onClick={() => setCurrentView(Views.AGENDA)}>Agenda</Button>
              </div>

              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                style={{ height: 500 }}
                views={{
                  month: true,
                  week: true,
                  day: true,
                  agenda: true,
                }}
                view={currentView as any}
                onView={(v: SetStateAction<string>) => setCurrentView(v)}
                date={currentDate}
                onNavigate={(date: SetStateAction<Date>) => setCurrentDate(date)}
                toolbar={false}
                eventPropGetter={(event: CustomEvent) => ({
                  style: {
                    backgroundColor: event.color,
                    borderRadius: '8px',
                    color: '#000',
                    padding: '4px 8px',
                    fontWeight: '500',
                  },
                })}
              />
            </Card>
          </Col>

          {/* To-Do List Section */}
          <Col lg={4}>
            <Card className="p-3" style={{ backgroundColor: '#e0d7f3', borderRadius: '1rem' }}>
              <h5 className="text-center">To-Do List</h5>
              <ul className="list-unstyled">
                {todos.map(todo => (
                  <li key={todo.id} className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <input
                        type="checkbox"
                        className="me-2"
                        checked={todo.completed}
                        onChange={() => toggleTodoComplete(todo.id)}
                      />
                      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
                    </div>
                    <Button size="sm" variant="outline-danger" onClick={() => removeTodo(todo.id)}>✕</Button>
                  </li>
                ))}
              </ul>
              <Form className="d-flex mt-2" onSubmit={e => { e.preventDefault(); addTodo(); }}>
                <Form.Control
                  type="text"
                  value={newTodo}
                  placeholder="New task..."
                  onChange={e => setNewTodo(e.target.value)}
                />
                <Button type="submit" variant="primary" className="ms-2">Add</Button>
              </Form>
            </Card>

            {/* Recent Activity Section */}
            <Card className="mt-4 p-3" style={{ backgroundColor: '#f7f7f7', borderRadius: '1rem' }}>
              <h5 className="text-center">Recent Activity</h5>
              <ul className="list-unstyled">
                {activityFeed.map((activity) => (
                  <li key={activity.id} className="mb-2">{activity.text}</li>
                ))}
              </ul>
            </Card>
          </Col>
        </Row>

        {/* Gamification Tabs */}
        <Row className="mt-4">
          <Col md={12}>
            <Tabs defaultActiveKey="gamification" id="admin-tabs" className="mb-3">
              {/* Gamification Monitoring Tab */}
              <Tab eventKey="gamification" title="Gamification Monitor">
                <Row>
                  <Col md={12} lg={8}>
                    <Card className="mb-4">
                      <Card.Header>
                        <h4 className="mb-0">Current Leaderboard</h4>
                      </Card.Header>
                      <Card.Body>
                        <Table responsive hover>
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Username</th>
                              <th>Level</th>
                              <th>Points</th>
                              <th>Sessions Led</th>
                              <th>Sessions Attended</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaderboard.map((entry) => (
                              <tr key={entry.username}>
                                <td>{entry.rank}</td>
                                <td>{entry.username}</td>
                                <td>
                                  <Badge bg={entry.level === 'Expert' ? 'danger' : 'primary'}>
                                    {entry.level}
                                  </Badge>
                                </td>
                                <td>{entry.points}</td>
                                <td>{entry.sessionsLed}</td>
                                <td>{entry.sessionsAttended}</td>
                                <td>
                                  <Button size="sm" variant="outline-primary" className="me-2">
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="outline-danger">
                                    Reset
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Header>
                        <h4 className="mb-0">Point Distribution Analytics</h4>
                      </Card.Header>
                      <Card.Body>
                        {/* Add your analytics charts/graphs here */}
                        <p>Point distribution visualization would go here</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={12} lg={4}>
                    <Card className="mb-4">
                      <Card.Header>
                        <h4 className="mb-0">Quick Actions</h4>
                      </Card.Header>
                      <Card.Body>
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Reset Leaderboard</Form.Label>
                            <div>
                              <Button variant="warning">Reset Weekly</Button>
                              <Button variant="warning" className="ms-2">Reset Monthly</Button>
                            </div>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Reward Distribution</Form.Label>
                            <Button variant="success" className="w-100">
                              Distribute Monthly Rewards
                            </Button>
                          </Form.Group>
                        </Form>
                      </Card.Body>
                    </Card>

                    <Card>
                      <Card.Header>
                        <h4 className="mb-0">System Statistics</h4>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-3">
                          <strong>Total Active Users:</strong>
                          {' '}
                          150
                        </div>
                        <div className="mb-3">
                          <strong>Points Awarded Today:</strong>
                          {' '}
                          1,250
                        </div>
                        <div className="mb-3">
                          <strong>Active Sessions:</strong>
                          {' '}
                          25
                        </div>
                        <div className="mb-3">
                          <strong>Achievement Rate:</strong>
                          {' '}
                          75%
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              {/* Settings Tab */}
              <Tab eventKey="settings" title="Gamification Settings">
                <Row className="mt-4">
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h4 className="mb-0">Point System Configuration</h4>
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleGamificationUpdate}>
                          <Form.Group className="mb-3">
                            <Form.Label>Points per Session Attendance</Form.Label>
                            <Form.Control
                              type="number"
                              value={gamificationSettings.pointsPerSession}
                              onChange={(e) => setGamificationSettings({
                                ...gamificationSettings,
                                pointsPerSession: parseInt(e.target.value, 10),
                              })}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Points per Session Led</Form.Label>
                            <Form.Control
                              type="number"
                              value={gamificationSettings.pointsPerHosting}
                              onChange={(e) => setGamificationSettings({
                                ...gamificationSettings,
                                pointsPerHosting: parseInt(e.target.value, 10),
                              })}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Bonus Points for Perfect Attendance</Form.Label>
                            <Form.Control
                              type="number"
                              value={gamificationSettings.bonusPoints}
                              onChange={(e) => setGamificationSettings({
                                ...gamificationSettings,
                                bonusPoints: parseInt(e.target.value, 10),
                              })}
                            />
                          </Form.Group>

                          <Button variant="primary" type="submit">Save Changes</Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h4 className="mb-0">Level Requirements</h4>
                      </Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleGamificationUpdate}>
                          {Object.entries(gamificationSettings.levelThresholds).map(([level, points]) => (
                            level !== 'Beginner' && (
                              <Form.Group className="mb-3" key={level}>
                                <Form.Label>
                                  {level}
                                  {' '}
                                  Level (Points)
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={points}
                                  onChange={(e) => setGamificationSettings({
                                    ...gamificationSettings,
                                    levelThresholds: {
                                      ...gamificationSettings.levelThresholds,
                                      [level]: parseInt(e.target.value, 10),
                                    },
                                  })}
                                />
                              </Form.Group>
                            )
                          ))}

                          <Form.Group className="mb-3">
                            <Form.Label>Level Up Rewards</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Enter rewards for reaching each level..."
                              defaultValue="Intermediate: Unlock special study rooms
Advanced: Priority session booking
Expert: Mentor badge and monthly rewards"
                            />
                          </Form.Group>

                          <div className="d-flex justify-content-between">
                            <Button variant="primary" type="submit">
                              Save Changes
                            </Button>
                            <Button variant="outline-secondary">
                              Reset to Defaults
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={12} className="mt-4">
                    <Card>
                      <Card.Header>
                        <h4 className="mb-0">Manual Point Adjustment</h4>
                      </Card.Header>
                      <Card.Body>
                        <Form>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>User Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter user email" />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Points to Add/Subtract</Form.Label>
                                <Form.Control type="number" placeholder="Enter points (negative for subtraction)" />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label>Reason</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                          </Form.Group>

                          <Button variant="primary">Adjust Points</Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
