import React from 'react';
import { Button } from 'react-bootstrap';
import { signIn } from 'next-auth/react';
import MyNavBar from './MyNavBar';

export default function MySignInWall() {
  return (
    <>
        <MyNavBar />
        <h1>Welcome to CryptoAlerts</h1>
        <p>
            Create price alerts for your favorite cryptoassets.<br/>
            Know when one drops or goes above a certain price.<br/>
            Improve your trading and investment stategies. All for free.
        </p>
        <Button variant="primary" onClick={() => signIn()}>Sign In / Sign Up</Button>
    </>
  )
}
