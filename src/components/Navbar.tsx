/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
// /* eslint-disable react/jsx-indent, @typescript-eslint/indent */

// 'use client';

// import { useSession } from 'next-auth/react';
// import { usePathname } from 'next/navigation';
// import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
// import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

// const NavBar: React.FC = () => {
//   const { data: session } = useSession();
//   const currentUser = session?.user?.email;
//   const userWithRole = session?.user as { email: string; randomKey: string };
//   const role = userWithRole?.randomKey;
//   const pathName = usePathname();
//   return (
//     <Navbar className="navbar-custom" expand="lg">
//       <Container>
//         <Navbar.Brand href="/">Sync&apos;d Study</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto justify-content-start">
//             {currentUser
//               ? [
//                   // eslint-disable-next-line max-len
//                   <Nav.Link id="how-it-works-nav" href="/howitworks" key="howitworks" active={pathName === '/howitworks'}>
//                     How it Works
//                   </Nav.Link>,
//                   <Nav.Link id="locations-nav" href="/locations" key="locations" active={pathName === '/locations'}>
//                     Locations on Campus
//                   </Nav.Link>,
//                   <Nav.Link id="about-nav" href="/about" key="about" active={pathName === '/about'}>
//                     About
//                   </Nav.Link>,
//                 ]
//               : ''}
//             {currentUser && role === 'ADMIN' ? (
//               <Nav.Link id="admin-stuff-nav" href="/admin" key="admin" active={pathName === '/admin'}>
//                 Admin
//               </Nav.Link>
//             ) : (
//               ''
//             )}
//           </Nav>
//           <Nav className="gap-5 text-center">
//             <Nav.Link
//               id="how-it-works-home-nav"
//               href="/howitworks"
//               key="howitworks-home"
//               active={pathName === '/howitworks'}
//             >
//               <ins><em>How it Works</em></ins>
//             </Nav.Link>
//             <Nav.Link id="locations-home-nav" href="/locations" key="locations-home" active={pathName === '/locations'}>
//               <ins><em>Locations on Campus</em></ins>
//             </Nav.Link>
//             <Nav.Link id="about-home-nav" href="/about" key="about-home" active={pathName === '/about'}>
//               <ins><em>About</em></ins>
//             </Nav.Link>
//             <Button size="sm" className="custom-button px-3 mx-1">
//               {session ? (
//                 <NavDropdown id="login-dropdown" title={currentUser}>
//                   <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
//                     <BoxArrowRight />
//                     Sign Out
//                   </NavDropdown.Item>
//                   <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
//                     <Lock />
//                     Change Password
//                   </NavDropdown.Item>
//                 </NavDropdown>
//               ) : (
//                 <NavDropdown id="login-dropdown" title="Login">
//                   <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
//                     <PersonFill />
//                     Sign in
//                   </NavDropdown.Item>
//                   <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
//                     <PersonPlusFill />
//                     Sign up
//                   </NavDropdown.Item>
//                 </NavDropdown>
//               )}
//             </Button>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavBar;

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;
  const pathName = usePathname();

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/">Sync&apos;d Study</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="gap-4 text-center">
            {currentUser ? (
              <>
                <Nav.Link href="/calendar" active={pathName === '/calendar'}><ins><em>Calendar</em></ins></Nav.Link>
                <Nav.Link href="/sessions" active={pathName === '/sessions'}><ins><em>Study Session</em></ins></Nav.Link>
                <Nav.Link href="/courses" active={pathName === '/courses'}><ins><em>My Courses</em></ins></Nav.Link>
                <Nav.Link href="/auth/profilesignup" active={pathName === '/auth/profilesignup'}><ins><em>My Profile</em></ins></Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/howitworks" active={pathName === '/howitworks'}><ins><em>How it Works</em></ins></Nav.Link>
                <Nav.Link href="/locations" active={pathName === '/locations'}><ins><em>Locations on Campus</em></ins></Nav.Link>
                <Nav.Link href="/about" active={pathName === '/about'}><ins><em>About</em></ins></Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <Button size="sm" className="custom-button px-3 mx-1">
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  {' '}
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
                  <PersonFill />
                  {' '}
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
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
