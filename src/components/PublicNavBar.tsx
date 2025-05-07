'use client';

import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar } from 'react-bootstrap';

const PublicNavBar: React.FC = () => {
  const pathName = usePathname();

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/">Sync&apos;d Study</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="gap-4 text-center">
            <Nav.Link href="/howitworks" active={pathName === '/howitworks'}>
              <ins><em>How it Works</em></ins>
            </Nav.Link>
            <Nav.Link href="/locations" active={pathName === '/locations'}>
              <ins><em>Locations on Campus</em></ins>
            </Nav.Link>
            <Nav.Link href="/about" active={pathName === '/about'}>
              <ins><em>About</em></ins>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default PublicNavBar;
