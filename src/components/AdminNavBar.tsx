'use client';

import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight } from 'react-bootstrap-icons';
import supabase from '@/lib/supabaseClient';

const AdminNavBar = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/admin">Admin Panel</Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-between">
          <Nav className="mx-auto gap-4">
            <Nav.Link href="/admin/dashboard">
              <ins><em>Dashboard</em></ins>
            </Nav.Link>
            <Nav.Link href="/admin/manage-users">
              <ins><em>Manage Users</em></ins>
            </Nav.Link>
            <Nav.Link href="/admin/manage-content">
              <ins><em>Manage Content</em></ins>
            </Nav.Link>
            <Nav.Link href="/admin/analytics">
              <ins><em>Analytics</em></ins>
            </Nav.Link>
            <Nav.Link href="/admin/settings">
              <ins><em>Settings</em></ins>
            </Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown
              title="Admin"
              id="admin-dropdown"
              className="custom-button px-3 mx-1"
            >
              <NavDropdown.Item onClick={handleLogout}>
                <BoxArrowRight /> Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavBar;
