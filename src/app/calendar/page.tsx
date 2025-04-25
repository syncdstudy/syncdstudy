/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { Calendar, dateFnsLocalizer, Views, SlotInfo, Event } from 'react-big-calendar';
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
  subDays,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Container, Row, Col, Card, Modal, Button, Form, Badge, ButtonGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';

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

const STORAGE_KEY = 'study-calendar-events';

const CalendarPage = () => {
  // controlled calendar date & view
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<string>(Views.MONTH);

  // load & store events
  const loadSavedEvents = (): CustomEvent[] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved).map((e: any) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }));
        } catch {
          console.error('could not parse events');
        }
      }
    }
    return initialEvents;
  };
  const [events, setEvents] = useState<CustomEvent[]>(loadSavedEvents);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  // modal & add-event state
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventData, setNewEventData] = useState<{
    title: string;
    description: string;
    start: Date | null;
    end: Date | null;
    color: string;
  }>({ title: '', description: '', start: null, end: null, color: '#d0e8ff' });

  // clock
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // todos
  const [todos, setTodos] = useState(
    [
      { id: '1', text: 'Review notes', completed: false },
      { id: '2', text: 'Watch lecture', completed: false },
      { id: '3', text: 'Email TA', completed: false },
    ],
  );
  const [newTodo, setNewTodo] = useState('');
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: newTodo.trim(), completed: false },
      ]);
      setNewTodo('');
    }
  };
  const toggleTodoComplete = (id: string) => setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const removeTodo = (id: string) => setTodos(todos.filter(t => t.id !== id));

  // event handlers
  const handleEventClick = (e: CustomEvent) => {
    setSelectedEvent(e);
    setShowModal(true);
  };
  const handleSlotSelect = (slot: SlotInfo) => {
    setNewEventData({
      title: '',
      description: '',
      start: slot.start as Date,
      end: slot.end as Date,
      color: '#d0e8ff',
    });
    setShowAddModal(true);
  };
  const handleAddEvent = () => {
    if (newEventData.title && newEventData.start && newEventData.end) {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          title: newEventData.title,
          description: newEventData.description,
          start: newEventData.start,
          end: newEventData.end,
          color: newEventData.color,
        },
      ]);
      setShowAddModal(false);
    }
  };
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
    }
    setShowModal(false);
    setSelectedEvent(null);
  };
  const handleClose = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };
  const handleColorSelect = (color: string) => {
    setNewEventData({ ...newEventData, color });
  };

  // navigate calendar
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

  function parseISO(value: string): Date | null {
    throw new Error('Function not implemented.');
  }

  return (
    <main className="p-4">
      <Container fluid>
        <Row className="justify-content-center mt-5">
          <Col lg={8}>
            <Card style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2rem' }}>
              <h3 className="text-center mb-2">📅 My Study Calendar</h3>

              {/* live month-year header */}
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
  <Button onClick={() => setShowAddModal(true)}>+ Add Event</Button>
</div>






              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                style={{ height: 600 }}
                views={{
                  month: true,
                  week: true,
                  day: true,
                  agenda: true,
                }}
                view={currentView as any}
                onView={(v) => setCurrentView(v)}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                toolbar={false}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: (event as CustomEvent).color,
                    borderRadius: '8px',
                    color: '#000',
                    padding: '4px 8px',
                    fontWeight: '500',
                  },
                })}
                onSelectEvent={handleEventClick}
                onSelectSlot={handleSlotSelect}
              />
            </Card>
          </Col>

          <Col lg={4}>
            {/* Clock */}
            <Card className="mb-3 p-3 text-center" style={{ backgroundColor: '#f4f1ff', borderRadius: '1rem' }}>
              <h5>🕒 Today</h5>
              <h2 className="fw-bold mt-2">{clock.toLocaleTimeString()}</h2>
              <h6>{clock.toDateString()}</h6>
            </Card>

            {/* Legend */}
            <Card className="mb-3 p-3" style={{ backgroundColor: '#e0d7f3', borderRadius: '1rem' }}>
  <h5 className="text-center">Legend</h5>
  <ul className="list-unstyled">
    {Array.from(new Set(events.map(e => e.title))).map((title, idx) => {
      const color = events.find(e => e.title === title)?.color || '#ccc';
      return (
        <li key={idx} className="mb-2">
          <span
            style={{
              backgroundColor: color,
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              width: '60px',
            }}
          />{' '}- {title}
        </li>
      );
    })}
  </ul>
</Card>

            {/* Upcoming Events */}
            <Card className="mb-3 p-3" style={{ backgroundColor: '#e0d7f3', borderRadius: '1rem' }}>
  <h5 className="text-center">Upcoming Events</h5>
  <ul className="list-unstyled">
    {events
      .filter(event => event.start > new Date())
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5)
      .map((event, idx) => (
        <li key={idx} className="mb-2">
          <strong>{event.title}</strong>
          <br />
          <small>{format(event.start, 'EEE MMM d, h:mm a')}</small>
        </li>
      ))}
    {events.filter(event => event.start > new Date()).length === 0 && (
      <li className="text-center text-muted">No upcoming events — add in a session!</li>
    )}
  </ul>
</Card>
            {/* To-Do List */}
            <Card className="p-3" style={{ backgroundColor: '#e0d7f3', borderRadius: '1rem' }}>
              <h5 className="text-center">To-Do List</h5>
              <ul className="list-unstyled">
                {todos.map(todo => (
                  <li key={todo.id} className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <input type="checkbox" className="me-2" checked={todo.completed} onChange={() => toggleTodoComplete(todo.id)} />
                      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
                    </div>
                    <Button size="sm" variant="outline-danger" onClick={() => removeTodo(todo.id)}>✕</Button>
                  </li>
                ))}
              </ul>
              <Form className="d-flex mt-2" onSubmit={e => { e.preventDefault(); addTodo(); }}>
                <Form.Control type="text" value={newTodo} placeholder="New task..." onChange={e => setNewTodo(e.target.value)} />
                <Button type="submit" variant="primary" className="ms-2">Add</Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* View/Delete Event Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Start:</strong>
            {' '}
            {selectedEvent?.start.toLocaleString()}
          </p>
          <p>
            <strong>End:</strong>
            {' '}
            {selectedEvent?.end.toLocaleString()}
          </p>
          <p>
            <strong>Details:</strong>
            {' '}
            {selectedEvent?.description}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteEvent}>Delete Event</Button>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Event Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newEventData.title}
                onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEventData.description}
                onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
  <Form.Label>Start Time</Form.Label>
  <Form.Control
    type="datetime-local"
    value={newEventData.start ? format(newEventData.start, "yyyy-MM-dd'T'HH:mm") : ''}
    onChange={(e) =>
      setNewEventData({
        ...newEventData,
        start: e.target.value ? parseISO(e.target.value) : null,
      })
    }
  />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>End Time</Form.Label>
  <Form.Control
    type="datetime-local"
    value={newEventData.end ? format(newEventData.end, "yyyy-MM-dd'T'HH:mm") : ''}
    onChange={(e) =>
      setNewEventData({
        ...newEventData,
        end: e.target.value ? parseISO(e.target.value) : null,
      })
    }
  />
</Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {['#b3e5b9', '#f7c6c7', '#ffe79e', '#d0e8ff', '#ffd6e7', '#c5c5ff'].map(color => (
                  <div
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: color,
                      cursor: 'pointer',
                      borderRadius: '4px',
                      border: newEventData.color === color ? '2px solid #333' : '1px solid #ddd',
                    }}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleAddEvent}
            disabled={!newEventData.title || !newEventData.start || !newEventData.end}
          >
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default CalendarPage;
