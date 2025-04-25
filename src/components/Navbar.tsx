'use client';

import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { useUser } from '@/hooks/useUser'; // ⬅️ your custom hook
import supabase from '@/lib/supabaseClient';

const NavBar: React.FC = () => {
  const user = useUser(); // 👈 replaces useSession
  const pathName = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // or router.push('/')
  };

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/">Sync&apos;d Study</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="gap-4 text-center">
            {user ? (
              <>
                <Nav.Link
                  href="/calendar"
                  active={pathName === '/calendar'}
                >
                  <ins><em>Calendar</em></ins>
                </Nav.Link>
                <Nav.Link
                  href="/sessions"
                  active={pathName === '/sessions'}
                >
                  <ins><em>Study Session</em></ins>
                </Nav.Link>
                <Nav.Link
                  href="/courses"
                  active={pathName === '/courses'}
                >
                  <ins><em>My Courses</em></ins>
                </Nav.Link>
                <Nav.Link
                  href="/auth/profilesignup"
                  active={pathName === '/auth/profilesignup'}
                >
                  <ins><em>My Profile</em></ins>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  href="/howitworks"
                  active={pathName === '/howitworks'}
                >
                  <ins><em>How it Works</em></ins>
                </Nav.Link>
                <Nav.Link
                  href="/locations"
                  active={pathName === '/locations'}
                >
                  <ins><em>Locations on Campus</em></ins>
                </Nav.Link>
                <Nav.Link href="/about" active={pathName === '/about'}><ins><em>About</em></ins></Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>

        <Nav>
          <Button size="sm" className="custom-button px-3 mx-1">
            {user ? (
              <NavDropdown id="login-dropdown" title={user.email}>
                <NavDropdown.Item onClick={handleLogout}>
                  <BoxArrowRight />
                  {' '}
                  Sign Out
                </NavDropdown.Item>
                {/* Optional feature */}
                {/* <NavDropdown.Item href="/auth/change-password">
                  <Lock />
                  {' '}
                  Change Password
                </NavDropdown.Item> */}
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item href="/auth/signin">
                  <PersonFill />
                  {' '}
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item href="/auth/signup">
                  <PersonPlusFill />
                  {' '}
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
