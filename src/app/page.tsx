import Image from 'next/image';
import { Container, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main>
    <Container id="landing-page" fluid className="py-3">
      <Row className="justify-content-center text-center">
        <div style={{ width: '150px', height: '150px', position: 'relative' }}>
          <Image src="/next.svg" alt="Logo" fill style={{ objectFit: 'contain' }} />
        </div>
      </Row>
    </Container>
  </main>
);

export default Home;
