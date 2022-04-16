import { Button, Card } from 'react-bootstrap';
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavBar from './components/MyNavBar';
import MySignInWall from './components/MySignInWall';

export default function Home() {

    const { data: session, status } = useSession();

    // Allows for use of state variables without implementing EditAlerts component as a class
    // Useful since NextJS components are canonically written as functional components
    // Needed becuse retrieving alert list is an asynchronous operation
    const [data, setData] = useState('');
    
    useEffect(() => {

        const callData = async () => {
        const data = await fetch('/api/notifications/retrieveNotificationList').then(res => res.json());
        setData(data);
        }

        callData();
    }, []);

    // Creates cards displaying all the alert options
    const fetchNotificationList = () => {
        // { "ticker": ticker, "alertPrice": alert_price, "currPrice": curr_price, "direction": direction, "username": username, "timestamp": timestamp }
        return (data === '' || data === undefined || data === null || data.result === undefined) ? (
            <Card style={{ width: '36rem', margin: '1rem' }}>
                <Card.Body>
                    <Card.Title>No notifications yet</Card.Title>
                    <Card.Text>
                        Please wait for your alerts to trigger, or add alerts in the Edit Alerts page.
                    </Card.Text>
                </Card.Body>
            </Card>
        ) : data.result.map((entry) => (
                <Card key={entry._id} style={{ width: '36rem', margin: '1rem' }}>
                    <Card.Body>
                        <Card.Title>{entry.ticker} {entry.direction ? "Above" : "Below"} ${entry.alertPrice}</Card.Title>
                        <Card.Text>
                            Target Price: {entry.alertPrice} <br/>
                            Current Price: {entry.currPrice} <br/>
                            Date: {entry.timestamp}
                        </Card.Text>
                        <div style={{display: 'flex'}}>
                            <Button id={entry._id} onClick={handleDeleteNotification} variant="danger">Delete</Button>
                        </div>
                    </Card.Body>
                </Card>
            )) 
        ;
    }

    // Handle event of pressing 'delete' button to delete an existing notification
    const handleDeleteNotification = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault();

        // Retrieve data from form
        const data = {
            _id: event.target.id,
        };

        console.log(data);
    
        // Convert the data into a JSON strting
        const JSONdata = JSON.stringify(data)
    
        // API endpoint where we send form data.
        const endpoint = '/api/notifications/deleteNotification'
    
        // Form the request for sending data to the server.
        const options = {
            // The method is DELETE because we are deleting an alert from the database.
            method: 'DELETE',
            // Tell the server we're sending JSON.
            headers: {
            'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSONdata,
        }
    
        // Send POST request to API endpoint
        const response = await fetch(endpoint, options);
    
        // Get the response data from server as JSON.
        const result = await response.json();
        console.log(result);
    }

    if (status === "authenticated") {

        // Signed-in? Display list of alert notifications.
        // Periodically retrieve list of notifications
        // TODO: Add buttton (or a nav bar) to navigate to Edit Alerts page
        return (
            <>
                <MyNavBar />
                <h1>Notifications</h1>
                {fetchNotificationList()}
            </>
        )
    }
    else if (status === "loading") {
        return (
            <>
                <MyNavBar />
                <h1>Loading</h1>
                <p>Please wait a few moments</p>
            </>
        )
    }
    return (
        <MySignInWall />
    )
};