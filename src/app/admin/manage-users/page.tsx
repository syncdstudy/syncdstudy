'use client';

import { Card, Container, Row, Col } from 'react-bootstrap';
// eslint-disable-next-line import/extensions
import UserTableClient from '@/components/UserTableClient';
// eslint-disable-next-line import/extensions
import ReportTable from '@/components/ReportTable';

export default function ManageUsersPage() {
  return (
    <main className="p-4">
      <Container fluid>
        <Row className="justify-content-center mt-5">
          <Col xs={12}>
            <Row className="gap-4 justify-content-center">
              {/* Manage Users */}
              <Col md={5}>
                <Card
                  style={{
                    backgroundColor: '#ffffffcc',
                    borderRadius: '1rem',
                    padding: '2rem',
                    height: '700px',
                    overflowY: 'auto',
                  }}
                >
                  <h3 className="text-center mb-4">Manage Users!</h3>
                  <UserTableClient />
                </Card>
              </Col>

              {/* Reports */}
              <Col md={6}>
                <Card
                  style={{
                    backgroundColor: '#fff9f9',
                    borderRadius: '1rem',
                    padding: '2rem',
                    height: '700px',
                    overflowY: 'auto',
                  }}
                >
                  <ReportTable />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
