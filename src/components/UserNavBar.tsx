'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { BoxArrowRight } from 'react-bootstrap-icons';

const UserNavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const status = localStorage.getItem('loggedIn');
    const email = localStorage.getItem('userEmail');
    setIsLoggedIn(status === 'true');
    setUserEmail(email || '');
  }, [pathname]); // re-run on route changes

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/">Sync&apos;d Study</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          {isLoggedIn && (
            <Nav className="gap-4 text-center">
              <Nav.Link href="/calendar" active={pathname === '/calendar'}>
                <ins><em>Calendar</em></ins>
              </Nav.Link>
              <Nav.Link href="/sessions" active={pathname === '/sessions'}>
                <ins><em>Study Session</em></ins>
              </Nav.Link>
              <Nav.Link href="/courses" active={pathname === '/courses'}>
                <ins><em>My Courses</em></ins>
              </Nav.Link>
              <Nav.Link href="/auth/profilesignup" active={pathname === '/auth/profilesignup'}>
                <ins><em>My Profile</em></ins>
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
        <Nav>
          {isLoggedIn ? (
            <Button size="sm" className="custom-button px-3 mx-1">
              <NavDropdown id="login-dropdown" title={userEmail}>
                <NavDropdown.Item onClick={handleLogout}>
                  <BoxArrowRight />
                  {' '}
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            </Button>
          ) : (
            <div className="d-flex gap-2">
              <Button variant="outline-primary" size="sm" onClick={() => router.push('/auth/signin')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/auth/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default UserNavBar;
