/* eslint-disable import/order */
/* eslint-disable import/extensions */
/* eslint-disable react/jsx-one-expression-per-line */

'use client';

import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { BoxArrowRight } from 'react-bootstrap-icons';
import { useUser } from '@/hooks/useUser';
import supabase from '@/lib/supabaseClient';

const UserNavBar: React.FC = () => {
  const pathName = usePathname();
  const user = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/">Sync&apos;d Study</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="gap-4 text-center">
            <Nav.Link href="/calendar" active={pathName === '/calendar'}>
              <ins><em>Calendar</em></ins>
            </Nav.Link>
            <Nav.Link href="/sessions" active={pathName === '/sessions'}>
              <ins><em>Study Session</em></ins>
            </Nav.Link>
            <Nav.Link href="/courses" active={pathName === '/courses'}>
              <ins><em>My Courses</em></ins>
            </Nav.Link>
            <Nav.Link href="/auth/profilesignup" active={pathName === '/auth/profilesignup'}>
              <ins><em>My Profile</em></ins>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <Button size="sm" className="custom-button px-3 mx-1">
            <NavDropdown id="login-dropdown" title={user?.email}>
              <NavDropdown.Item onClick={handleLogout}>
                <BoxArrowRight /> Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default UserNavBar;
