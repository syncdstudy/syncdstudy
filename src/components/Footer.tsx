import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="footer mt-auto">
    <Container>
      <Row>
        <Col>
          © 2025 Sync&apos;d Study. All rights reserved.
          <br />
          University of Hawai&apos;i at Mānoa
        </Col>
        <Col className="text-end">
          <div className="d-flex flex-column align-items-end">
            <Link href="/contact" className="footer-link mb-2" style={{ fontSize: '0.9rem', color: '#576CBC' }}>
              Contact Us
            </Link>
            <Link href="/adminsignin" className="footer-link" style={{ fontSize: '0.9rem', color: '#576CBC' }}>
              Admin Sign In
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
