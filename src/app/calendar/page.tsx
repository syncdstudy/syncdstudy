/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Container, Row, Col, Card } from 'react-bootstrap';

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

const events = [
  {
    title: 'ICS 314 Study Group',
    start: new Date(2025, 3, 23, 14, 0),
    end: new Date(2025, 3, 23, 15, 30),
    color: '#b3e5b9',
  },
  {
    title: 'MATH 307 Review',
    start: new Date(2025, 3, 25, 10, 0),
    end: new Date(2025, 3, 25, 11, 0),
    color: '#f7c6c7',
  },
  {
    title: 'ENG 100 Session',
    start: new Date(2025, 3, 26, 9, 0),
    end: new Date(2025, 3, 26, 10, 0),
    color: '#ffe79e',
  },
];

const CalendarPage = () => (
  <main className="p-4">
    <Container fluid>
      <Row className="justify-content-center mt-5">
        {/* Calendar + Sidebar */}
        <Col lg={9}>
          <Card style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2rem' }}>
            <h3 className="text-center mb-4">📅 My Study Calendar</h3>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              eventPropGetter={(event) => ({
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

        <Col lg={3}>
          {/* Legend */}
          <Card className="mb-3 p-3" style={{ backgroundColor: '#e0d7f3', borderRadius: '1rem' }}>
            <h5 className="text-center">Legend</h5>
            <ul className="list-unstyled">
              <li>
                <span style={{ backgroundColor: '#b3e5b9', padding: '4px 8px', borderRadius: '4px' }}>ICS</span>
                {' '}
                - ICS 314
              </li>
              <li>
                <span style={{ backgroundColor: '#f7c6c7', padding: '4px 8px', borderRadius: '4px' }}>MATH</span>
                {' '}
                - MATH 307
              </li>
              <li>
                <span style={{ backgroundColor: '#ffe79e', padding: '4px 8px', borderRadius: '4px' }}>ENG</span>
                {' '}
                - ENG 100
              </li>
            </ul>
          </Card>

          {/* Upcoming Events */}
          <Card className="mb-3 p-3" style={{ backgroundColor: '#e0d7f3', borderRadius: '1rem' }}>
            <h5 className="text-center">Upcoming Events</h5>
            <ul className="list-unstyled">
              <li>
                <strong>Study Jam</strong>
                <br />
                <small>Tue @ 3PM, Room 204</small>
              </li>
              <li>
                <strong>Group Review</strong>
                <br />
                <small>Thu @ 5PM, Zoom</small>
              </li>
            </ul>
          </Card>

          {/* To-Do List */}
          <Card className="p-3" style={{ backgroundColor: '#e0d7f3', borderRadius: '1rem' }}>
            <h5 className="text-center">To-Do List</h5>
            <ul className="list-unstyled">
              <li>
                <input type="checkbox" className="me-2" />
                {' '}
                Review notes
              </li>
              <li>
                <input type="checkbox" className="me-2" />
                {' '}
                Watch lecture
              </li>
              <li>
                <input type="checkbox" className="me-2" />
                {' '}
                Email TA
              </li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);

export default CalendarPage;
