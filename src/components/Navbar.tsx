/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */

'use client';

import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import supabase from '@/lib/supabaseClient';
import { useUser } from '@/hooks/useUser';

const NavBar: React.FC = () => {
  const user = useUser();
  const pathName = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
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
            {user ? (
              <>
                <Nav.Link href="/calendar" active={pathName === '/calendar'}>
                  <ins><em>Calendar</em></ins>
                </Nav.Link>
                <Nav.Link href="/sessions" active={pathName === '/sessions'}>
                  <ins><em>Study Session</em></ins>
                </Nav.Link>
                <Nav.Link href="/courses" active={pathName === '/courses'}>
                  <ins><em>My Courses</em></ins>
                </Nav.Link>
                <Nav.Link href="/profile" active={pathName === '/profile'}>
                  <ins><em>My Profile</em></ins>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/howitworks" active={pathName === '/howitworks'}>
                  <ins><em>How it Works</em></ins>
                </Nav.Link>
                <Nav.Link href="/locations" active={pathName === '/locations'}>
                  <ins><em>Locations on Campus</em></ins>
                </Nav.Link>
                <Nav.Link href="/about" active={pathName === '/about'}>
                  <ins><em>About</em></ins>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>

        <Nav>
          {user ? (
            <NavDropdown
              id="login-dropdown"
              title={user.email || 'User'}
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
