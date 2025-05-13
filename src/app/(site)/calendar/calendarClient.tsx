/* eslint-disable default-case */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Views, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  sub,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  ButtonGroup,
} from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
// eslint-disable-next-line import/extensions
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

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const COLOR_OPTIONS = [
  '#b3e5b9', '#f7c6c7', '#ffe79e', '#d0e8ff', '#ffd6e7',
  '#c5c5ff', '#c5ffd7', '#ffd7c5', '#d7c5ff', '#ffc5d7',
];

export default function CalendarClient() {
  // ─── STATE ──────────────────────────────────────────────────────────────
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<string>(Views.MONTH);
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<CustomEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [clock, setClock] = useState(new Date());
  // ─── TODO STATE WITH LOCAL STORAGE ─────────────────────────────────────
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [
      { id: '1', text: 'Review notes', completed: false },
      { id: '2', text: 'Watch lecture', completed: false },
      { id: '3', text: 'Email TA', completed: false },
    ];
  });
  const [newTodo, setNewTodo] = useState('');

  // ─── LOAD EVENTS ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadEvents() {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      const { data, error } = await supabase
        .from('calendar_events')
        .select('id, title, start, end, color, description, location, mode')
        .eq('user_id', userId);

      if (!data || error) {
        console.error('Error loading events:', error);
        return;
      }

      const parsed = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        color: e.color || '#d0e8ff',
        description: e.description ?? '',
        location: e.location?.trim() || 'N/A',
        mode: e.mode?.trim() || 'N/A',
      }));
      setEvents(parsed);

      const now = new Date();
      const upcoming = parsed
        .filter(ev => ev.start >= now)
        .sort((a, b) => a.start.getTime() - b.start.getTime());
      setUpcomingSessions(upcoming);
    }
    loadEvents();
  }, []);

  // ─── CLOCK ───────────────────────────────────────────────────────────────
  useEffect(() => {
    setHydrated(true);
    const iv = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // ─── HANDLERS ───────────────────────────────────────────────────────────
  const moveDate = (dir: 'NEXT' | 'PREV') => {
    let next = new Date();
    switch (currentView) {
      case Views.MONTH:
        next = dir === 'NEXT' ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
        break;
      case Views.WEEK:
        next = dir === 'NEXT' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1);
        break;
      case Views.DAY:
      case Views.AGENDA:
        next = dir === 'NEXT' ? addDays(currentDate, 1) : sub(currentDate, { days: 1 });
        break;
    }
    setCurrentDate(next);
  };

  const handleEventClick = (evt: CustomEvent) => {
    setSelectedEvent(evt);
    setShowModal(true);
  };

  // ─── SAVE TODOS TO LOCALSTORAGE ─────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleUpcomingClick = (evt: CustomEvent) => {
    setCurrentDate(evt.start);
    setCurrentView(Views.WEEK);
    setTimeout(() => {
      setSelectedEvent(evt);
      setShowModal(true);
    }, 400);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleColorChange = async (color: string) => {
    if (!selectedEvent) return;
    const { error } = await supabase
      .from('calendar_events')
      .update({ color })
      .eq('id', selectedEvent.id);
    if (!error) {
      setEvents((prev: CustomEvent[]) => prev.map((e: CustomEvent) => (e.id === selectedEvent.id ? { ...e, color } : e)));
      setSelectedEvent({ ...selectedEvent, color });
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', selectedEvent.id);
    if (!error) {
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      setShowModal(false);
      setSelectedEvent(null);
    }
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos((prev: Todo[]) => [...prev, { id: Date.now().toString(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodoComplete = (id: string) => setTodos((prev: Todo[]) => prev.map((t: Todo) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const removeTodo = (id: string) => setTodos((prev: Todo[]) => prev.filter((t: Todo) => t.id !== id));

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <main className="p-4">
      <Container fluid>
        <Row className="justify-content-center mt-5">
          {/* Calendar Column */}
          <Col lg={8}>
            <Card style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2rem' }}>
              <h3 className="text-center mb-2">📅 My Study Calendar</h3>
              <h5 className="text-center mb-3">{format(currentDate, 'MMMM yyyy')}</h5>

              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div className="d-flex flex-wrap gap-2">
                  <ButtonGroup className="me-2">
                    <Button variant="outline-secondary" onClick={() => setCurrentDate(new Date())}>Today</Button>
                    <Button variant="outline-secondary" onClick={() => moveDate('PREV')}>Back</Button>
                    <Button variant="outline-secondary" onClick={() => moveDate('NEXT')}>Next</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button variant={currentView === Views.MONTH ? 'secondary' : 'outline-secondary'} onClick={() => setCurrentView(Views.MONTH)}>Month</Button>
                    <Button variant={currentView === Views.WEEK ? 'secondary' : 'outline-secondary'} onClick={() => setCurrentView(Views.WEEK)}>Week</Button>
                    <Button variant={currentView === Views.DAY ? 'secondary' : 'outline-secondary'} onClick={() => setCurrentView(Views.DAY)}>Day</Button>
                    <Button variant={currentView === Views.AGENDA ? 'secondary' : 'outline-secondary'} onClick={() => setCurrentView(Views.AGENDA)}>Agenda</Button>
                  </ButtonGroup>
                </div>
              </div>

              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                style={{ height: 600 }}
                views={{ month: true, week: true, day: true, agenda: true }}
                view={currentView as any}
                onView={setCurrentView as any}
                date={currentDate}
                onNavigate={setCurrentDate}
                toolbar={false}
                eventPropGetter={evt => ({
                  style: {
                    backgroundColor: (evt as CustomEvent).color,
                    borderRadius: '8px',
                    color: '#000',
                    padding: '4px 8px',
                    fontWeight: '500',
                  },
                })}
                onSelectEvent={handleEventClick}
              />
            </Card>
          </Col>

          {/* Sidebar Column */}
          <Col lg={4}>
            {/* Clock */}
            {hydrated && (
              <Card className="mb-3 p-3 text-center" style={{ backgroundColor: '#f4f1ff', borderRadius: '1rem' }}>
                <h5>🕒 Today</h5>
                <h2 className="fw-bold mt-2">{clock.toLocaleTimeString()}</h2>
                <h6>{clock.toDateString()}</h6>
              </Card>
            )}

            {/* Upcoming Sessions */}
            <Card className="mb-3 p-4" style={{ backgroundColor: '#e9ddfb', borderRadius: '1rem', maxHeight: '326px', overflowY: 'scroll' }}>
              <h5 className="text-center">Upcoming Sessions</h5>
              {upcomingSessions.length === 0 ? (
                <p className="text-muted text-center">No upcoming sessions</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {upcomingSessions.map(session => (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      key={session.id}
                      className="p-3 rounded shadow-sm"
                      style={{ backgroundColor: '#ffffff', border: '1px solid #ccc', cursor: 'pointer' }}
                      onClick={() => handleUpcomingClick(session)}
                    >
                      <strong style={{ color: '#6f42c1' }}>{session.title}</strong>
                      <div><small>{format(session.start, 'PPP p')}</small></div>
                      <div><small className="text-muted">{session.description || 'No description'}</small></div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* To‑Do List */}
            <Card className="p-0 d-flex flex-column" style={{ backgroundColor: '#e0d7f3', borderRadius: '1rem', height: '100%', maxHeight: '300px', overflow: 'hidden' }}>
              <div className="p-3 border-bottom text-center"><h5 className="fw-bold">📝 To-Do List</h5></div>
              <div style={{ overflowY: 'auto', padding: '1rem', flex: 1 }}>
                <AnimatePresence mode="popLayout">
                  {todos.map((todo: Todo) => (
                    <motion.li
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="d-flex align-items-center justify-content-between px-3 py-2 mb-2"
                      style={{ backgroundColor: todo.completed ? '#e2e2e2' : '#f6f0ff', borderRadius: '0.75rem', listStyle: 'none' }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="d-flex align-items-center">
                        <Form.Check type="checkbox" className="me-2" checked={todo.completed} onChange={() => toggleTodoComplete(todo.id)} />
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', opacity: todo.completed ? 0.6 : 1, fontWeight: 500, fontSize: '1rem' }}>
                          {todo.text}
                        </span>
                      </div>
                      <Button size="sm" variant="outline-danger" onClick={() => removeTodo(todo.id)} style={{ padding: '0 8px', borderRadius: '6px' }}>
                        ✕
                      </Button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </div>
              <Form className="d-flex p-3 border-top" onSubmit={e => { e.preventDefault(); addTodo(); }}>
                <Form.Control type="text" value={newTodo} placeholder="Add a new task..." onChange={e => setNewTodo(e.target.value)} className="me-2" />
                <Button type="submit" variant="primary">Add</Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Event Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton style={{ borderBottom: 'none' }} />
        <Modal.Body>
          <h5>{selectedEvent?.title}</h5>
          <p>
            <strong>Start Time:</strong>
            {' '}
            {selectedEvent?.start.toLocaleString()}
          </p>
          <p>
            <strong>End Time:</strong>
            {' '}
            {selectedEvent?.end.toLocaleString()}
          </p>
          <p>
            <strong>Location:</strong>
            {' '}
            {selectedEvent?.location?.trim() ? selectedEvent.location : 'N/A'}
          </p>
          <p>
            <strong>Mode:</strong>
            {' '}
            {selectedEvent?.mode?.trim() ? selectedEvent.mode : 'N/A'}
          </p>
          <p>
            <strong>Details:</strong>
            {' '}
            {selectedEvent?.description ?? ''}
          </p>
          <hr />
          <p><strong>Change Color:</strong></p>
          <div className="d-flex flex-wrap gap-2">
            {COLOR_OPTIONS.map(col => (
              <button
                key={col}
                type="button"
                aria-label={`Select color ${col}`}
                title={`Select color ${col}`}
                onClick={() => handleColorChange(col)}
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: col,
                  border: selectedEvent?.color === col ? '2px solid #000' : '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteEvent}>Delete Event</Button>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
