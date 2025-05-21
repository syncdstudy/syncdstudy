/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-one-expression-per-line */

'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const email = localStorage.getItem('userEmail') || '';
    const name = localStorage.getItem('username') || ''; // <- from signup/signin

    setIsLoggedIn(loggedIn);
    setUserEmail(email);
    setUsername(name);
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
        <Navbar.Brand href="/">
          <Image
            src="/logo.png"
            alt="Sync'd Study Logo"
            width={170}
            height={50}
            style={{ verticalAlign: 'middle', marginRight: '10px' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="gap-4 text-center">
          {isLoggedIn ? (
  <>
    <Nav.Link href="/calendar" active={pathname === '/calendar'}>
      <span className="nav-link-text">Dashboard</span>
    </Nav.Link>
    <Nav.Link href="/study-session" active={pathname === '/study-session'}>
      <span className="nav-link-text">Study Session</span>
    </Nav.Link>
    <Nav.Link href="/locations" active={pathname === '/locations'}>
      <span className="nav-link-text">Study Spots</span>
    </Nav.Link>
    <Nav.Link href="/profile" active={pathname === '/profile'}>
      <span className="nav-link-text">My Profile</span>
    </Nav.Link>
  </>
) : (
  <>
    <Nav.Link href="/howitworks" active={pathname === '/howitworks'}>
      <span className="nav-link-text">How it Works</span>
    </Nav.Link>
    <Nav.Link href="/locations" active={pathname === '/locations'}>
      <span className="nav-link-text">Locations on Campus</span>
    </Nav.Link>
    <Nav.Link href="/about" active={pathname === '/about'}>
      <span className="nav-link-text">About</span>
    </Nav.Link>
  </>
)}

          </Nav>
        </Navbar.Collapse>

        <Nav>
          {isLoggedIn ? (
            <NavDropdown
              id="login-dropdown"
              title={username || 'User'}
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
