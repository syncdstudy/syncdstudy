/* eslint-disable no-nested-ternary */

'use client';

import { useState, useEffect } from 'react';
import { useRedirectIfUnauthorized } from '@/lib/useRedirectIfUnauthorized';
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
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import supabase from '@/lib/supabaseClient';

interface CustomEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
  location?: string;
  mode?: string;
}

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const AdminPage = () => {
  // block non-admins
  const checking = useRedirectIfUnauthorized(true);

  // state for all sessions
  const [events, setEvents] = useState<CustomEvent[]>([]);

  // other UI state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<string>(Views.MONTH);
  const [todos, setTodos] = useState([
    { id: '1', text: 'Review notes', completed: false },
    { id: '2', text: 'Watch lecture', completed: false },
    { id: '3', text: 'Email TA', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [activityFeed, setActivityFeed] = useState<string[]>([]);

  // load all sessions on mount
  useEffect(() => {
    async function loadAllSessions() {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*');

      if (error) {
        console.error('Error loading admin events:', error);
        return;
      }

      const parsed = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        color: e.color || '#d0e8ff',
        description: e.description || '',
        location: e.location || '',
        mode: e.mode || '',
      }));

      setEvents(parsed);
    }
    loadAllSessions();
  }, []);

  // load activity feed
  useEffect(() => {
    async function fetchActivity() {
      const res = await fetch('/api/activitylog');
      const data = await res.json();
      setActivityFeed(data.map((item: any) => item.message));
    }
    fetchActivity();
  }, []);

  if (checking) {
    return <div className="text-center mt-5">Loading...</div>;
  }

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
              <h3 className="text-center mb-2">Admin Calendar</h3>
              <h5 className="text-center mb-3">{format(currentDate, 'MMMM yyyy')}</h5>

              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div className="d-flex flex-wrap gap-2">
                  <Button variant="outline-secondary" onClick={() => moveDate('PREV')}>
                    Back
                  </Button>
                  <Button variant="outline-secondary" onClick={() => moveDate('NEXT')}>
                    Next
                  </Button>
                </div>
                { [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA].map(view => (
                  <Button
                    key={view}
                    variant={currentView === view ? 'primary' : 'outline-primary'}
                    onClick={() => setCurrentView(view)}
                  >
                    {view}
                  </Button>
                )) }
              </div>

              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                style={{ height: 500 }}
                view={currentView as any}
                onView={v => setCurrentView(v)}
                date={currentDate}
                onNavigate={date => setCurrentDate(date)}
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

          {/* Sidebar */}
          <Col lg={4} className="d-flex flex-column" style={{ height: '700px' }}>
            {/* To‑Do List */}
            <Card className="p-3 mb-3" style={{ backgroundColor: '#e0d7f3', borderRadius: '1rem' }}>
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
                      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                        {todo.text}
                      </span>
                    </div>
                    <Button size="sm" variant="outline-danger" onClick={() => removeTodo(todo.id)}>
                      ✕
                    </Button>
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

            {/* Recent Activity */}
            <Card
              className="p-3 flex-grow-1"
              style={{
                backgroundColor: '#f7f7f7',
                borderRadius: '1rem',
                overflowY: 'auto',
              }}
            >
              <h5 className="text-center">Recent Activity</h5>
              <ul className="list-unstyled mb-0">
                {activityFeed.map((activity, idx) => {
                  const newUserMatch = activity.match(/^New user:\s*(.+)$/i);
                  const reportMatch = activity.match(/^New report from:\s*(.+)$/i);
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={idx} className="mb-2">
                      {newUserMatch ? (
                        <>
                          <strong>New user:</strong>
                          {' '}
                          {newUserMatch[1]}
                        </>
                      ) : reportMatch ? (
                        <>
                          <strong style={{ color: 'rgb(115, 18, 119)' }}>
                            New report from:
                          </strong>
                          {' '}
                          {reportMatch[1]}
                        </>
                      ) : (
                        <span>{activity}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </Col>

        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
