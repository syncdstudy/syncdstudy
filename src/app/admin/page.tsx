'use client';

import { useState, SetStateAction } from 'react';
import { Calendar, dateFnsLocalizer, Views, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// eslint-disable-next-line max-len
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek, parse, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

// Define custom event interface
interface CustomEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description: string;
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
  const [todos, setTodos] = useState(
    [
      { id: '1', text: 'Review notes', completed: false },
      { id: '2', text: 'Watch lecture', completed: false },
      { id: '3', text: 'Email TA', completed: false },
    ],
  );
  const [newTodo, setNewTodo] = useState('');
  const [activityFeed] = useState<string[]>([
    'User 12345 joined the app',
    'User 23423 joined the app',
    'User 56789 started a new study session',
  ]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: newTodo.trim(), completed: false },
      ]);
      setNewTodo('');
    }
  };

  // eslint-disable-next-line max-len
  const toggleTodoComplete = (id: string) => setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const removeTodo = (id: string) => setTodos(todos.filter(t => t.id !== id));

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
                    backgroundColor: (event as CustomEvent).color,
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
                {activityFeed.map((activity, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={index} className="mb-2">{activity}</li>
                ))}
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
