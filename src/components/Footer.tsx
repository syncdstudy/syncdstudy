import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="footer mt-auto">
    <Container>
      <Row>
        <Col>
          Silvia Arjona Garcia, Angela Joy Almeron, Arisa Nakai, & Jaimee Yokoyama
          <br />
          University of Hawai&apos;i at Mānoa
          <br />
          Sync&apos;d Study. All rights reserved.
        </Col>
        <Col className="text-end d-flex align-items-end justify-content-end">
          <Link href="/adminsignin" className="admin-link" style={{ fontSize: '0.9rem' }}>
            Admin Sign In
          </Link>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
