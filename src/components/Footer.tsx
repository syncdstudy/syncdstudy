import { Col, Container, Row } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="footer mt-auto">
    <Container>
      <Row>
        <Col>
          Sync&apos;d Study
          <br />
          Developed by Silvia Arjona Garcia, Angela Joy Almeron, Arisa Nakai, & Jaimee Yokoyama
          <br />
          University of Hawai&apos;i at Manoā
          <br />
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
