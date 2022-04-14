import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useSession, signIn } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MyNavBar() {


  const { data: session, status } = useSession();

  return (
    <>
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="./">CryptoAlerts</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="./">Home</Nav.Link>
                    <Nav.Link href="./editAlerts">Edit Alerts</Nav.Link>

                    { status === 'authenticated' ? (<Nav.Link href="./api/auth/signout">Sign Out</Nav.Link>)
                      : (<Nav.Link href="./api/auth/signin">Sign In</Nav.Link>) }

                </Nav>
            </Container>
        </Navbar>
    </>
  )
}