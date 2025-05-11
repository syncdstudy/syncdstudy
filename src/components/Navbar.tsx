/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */

'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const status = localStorage.getItem('loggedIn');
    const email = localStorage.getItem('userEmail');
    setIsLoggedIn(status === 'true');
    setUserEmail(email || '');
  }, [pathname]);

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
          <Nav className="gap-4 text-center">
            {isLoggedIn ? (
              <>
                <Nav.Link href="/calendar" active={pathname === '/calendar'}>
                  <ins><em>Calendar</em></ins>
                </Nav.Link>
                <Nav.Link href="/sessions" active={pathname === '/sessions'}>
                  <ins><em>Study Session</em></ins>
                </Nav.Link>
                <Nav.Link href="/courses" active={pathname === '/courses'}>
                  <ins><em>My Courses</em></ins>
                </Nav.Link>
                <Nav.Link href="/profile" active={pathname === '/profile'}>
                  <ins><em>My Profile</em></ins>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/howitworks" active={pathname === '/howitworks'}>
                  <ins><em>How it Works</em></ins>
                </Nav.Link>
                <Nav.Link href="/locations" active={pathname === '/locations'}>
                  <ins><em>Locations on Campus</em></ins>
                </Nav.Link>
                <Nav.Link href="/about" active={pathname === '/about'}>
                  <ins><em>About</em></ins>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>

        <Nav>
          {isLoggedIn ? (
            <NavDropdown
              id="login-dropdown"
              title={(userEmail && userEmail.split('@')[0]) || 'User'}
              className="custom-button px-3 mx-1"
            >
              <NavDropdown.Item onClick={handleLogout}>
                <BoxArrowRight /> Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <NavDropdown
              id="login-dropdown"
              title="Login"
              className="custom-button px-3 mx-1"
            >
              <NavDropdown.Item href="/auth/signin">
                <PersonFill /> Sign in
              </NavDropdown.Item>
              <NavDropdown.Item href="/auth/signup">
                <PersonPlusFill /> Sign up
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
