import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="footer mt-auto">
    <Container>
      <Col className="text-center">
        Sync&apos;d Study
        <br />
        Developed by Silvia Arjona Garcia, Angela Joy Almeron, Arisa Nakai, Jaimee Yokoyama
        <br />
        ICS 314 University of Hawai&apos;i at Manoa
        <br />
      </Col>
    </Container>
  </footer>
);

export default Footer;
