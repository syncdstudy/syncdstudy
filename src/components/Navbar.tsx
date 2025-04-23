/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;
  const pathName = usePathname();

  if (status === 'loading') {
    return null;
  }
  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container>
        <Navbar.Brand href="/">Sync&apos;d Study</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto px-5 gap-5 justify-content-start">
            {!session && (
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

            {session && role === 'USER' && (
              <>
                <Nav.Link href="/calendar" active={pathName === '/calendar'}>
                  <ins><em>Calendar</em></ins>
                </Nav.Link>
                <Nav.Link href="/courses" active={pathName === '/courses'}>
                  <ins><em>Study Session</em></ins>
                </Nav.Link>
                <Nav.Link href="/courses" active={pathName === '/courses'}>
                  <ins><em>My Courses</em></ins>
                </Nav.Link>
                <Nav.Link href="/profile" active={pathName === '/profile'}>
                  <ins><em>My Profile</em></ins>
                </Nav.Link>
              </>
            )}

            {session && role === 'ADMIN' && (
              <>
                <Nav.Link href="/admin/dashboard" active={pathName === '/admin/dashboard'}>
                  <ins><em>Leaderboard</em></ins>
                </Nav.Link>
                <Nav.Link href="/admin/manage-users" active={pathName === '/admin/manage-users'}>
                  <ins><em>Manage Users</em></ins>
                </Nav.Link>
                <Nav.Link href="/admin/reports" active={pathName === '/admin/reports'}>
                  <ins><em>Student Reports</em></ins>
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="gap-5 text-center">
            <Button size="sm" className="custom-button px-3 mx-1">
              {session ? (
                <NavDropdown id="login-dropdown" title={currentUser}>
                  <NavDropdown.Item href="/api/auth/signout">
                    <BoxArrowRight />
                      Sign Out
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/auth/change-password">
                    <Lock />
                    Change Password
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown id="login-dropdown" title="Login">
                  <NavDropdown.Item href="/auth/signin">
                    <PersonFill />
                    Sign in
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/auth/signup">
                    <PersonPlusFill />
                    Sign up
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
