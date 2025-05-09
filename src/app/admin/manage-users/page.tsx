import { User } from '@prisma/client';
import { Card, Container, Row, Col } from 'react-bootstrap';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';
// eslint-disable-next-line import/extensions
import UserTableClient from '@/components/UserTableClient';
// eslint-disable-next-line import/extensions
import ReportTable from '@/components/ReportTable';

export default async function ManageUsersPage() {
  const users: User[] = await prisma.user.findMany();

  return (
    <main className="p-4">
      <Container fluid>
        <Row className="justify-content-start mt-5" xs={1} md={2}>
          {/* Manage Users Table */}
          <Col lg={5}>
            <Card style={{ backgroundColor: '#ffffffcc', borderRadius: '1rem', padding: '2rem' }}>
              <h3 className="text-center mb-4">Manage Users</h3>
              <UserTableClient initialUsers={users} />
            </Card>
          </Col>

          {/* User Reports Table */}
          <Col lg={6}>
            <ReportTable />
          </Col>
        </Row>
      </Container>
    </main>
  );
}
