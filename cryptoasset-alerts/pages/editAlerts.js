// Display list of alerts (retrieve via API call) - maybe use card objects?
// Choose which ones to edit/delete
// Also, can add new alerts

import { Button, Card, Form } from 'react-bootstrap';
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import MyNavBar from "./components/MyNavBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import MySignInWall from './components/MySignInWall';

export default function EditAlerts() {

    // Keep track of user session status (i.e. whether or not user is signed-in)
    const { data: session, status } = useSession();

    // Allows for use of state variables without implementing EditAlerts component as a class
    // Useful since NextJS components are canonically written as functional components
    // Needed becuse retrieving alert list is an asynchronous operation
    const [data, setData] = useState('');
    
    useEffect(() => {

        const callData = async () => {
        const data = await fetch('/api/alerts/retrieveAlertList').then(res => res.json());
        setData(data);
        }

        callData();
    }, []);

    // Creates cards displaying all the alert options
    const fetchAlertList = () => {

        return (data === '' || data === undefined || data === null || data.result === undefined) ? (
            <Card style={{ width: '36rem', margin: '1rem' }}>
                <Card.Body>
                    <Card.Title>No alerts created yet</Card.Title>
                    <Card.Text>
                        Please create your first alert below.
                    </Card.Text>
                </Card.Body>
            </Card>
        ) : data.result.map((entry) => (
                <Card key={entry._id} style={{ width: '36rem', margin: '1rem' }}>
                    <Card.Body>
                        <Card.Title>{entry.ticker}</Card.Title>
                        <Card.Text>
                            Target Price: {entry.price} <br/>
                            Direction: {entry.direction ? "Above" : "Below"}
                        </Card.Text>
                        <div style={{display: 'flex'}}>
                            <Button id={entry._id} onClick={handleDeleteAlert} variant="danger">Delete</Button>
                        </div>
                    </Card.Body>
                </Card>
            )) 
        ;
    }

    // Handle event of pressing 'delete' button to delete an existing alert
    const handleDeleteAlert = async (event) => {
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
        const endpoint = '/api/alerts/deleteAlert'
    
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

    // Handle event of submitting form to create new alert
    const handleSubmitNewAlert = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault();

        // Retrieve data from form
        const data = {
            ticker: event.target.ticker.value,
            price: event.target.price.value,
            direction: event.target.direction.value
        };
    
        // Convert the data into a JSON strting
        const JSONdata = JSON.stringify(data)
    
        // API endpoint where we send form data.
        const endpoint = '/api/alerts/addAlert'
    
        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
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
        return(
            <>
                <MyNavBar />
                <h1>View and Edit Alert List</h1>
                { fetchAlertList() }
                <h3>Add a new alert here:</h3>
                <Form onSubmit={handleSubmitNewAlert}>
                    <Form.Group>
                        <Form.Label>Ticker</Form.Label>
                        <Form.Control type="text" name="ticker" placeholder="BTC" />
                        <Form.Text className="text-muted">
                            Enter the ticker (ex. &lsquo;BTC&rsquo;), not the name of the cryptoasset (ex. &lsquo;Bitcoin&rsquo;).
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price Target</Form.Label>
                        <Form.Control type="number" name="price" step="0.01" placeholder="56000" />
                        <Form.Text className="text-muted">
                            Enter the price at which you want your alert to trigger.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Select name="direction">
                            <option>Select Price Direction</option>
                            <option value="0">Below</option>
                            <option value="1">Above</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Select whether you want alerts to be triggered above or below price target. <br/>
                            (ex. if price target is set to 56,000 and price direction is set to &lsquo;below&rsquo;, then alerts will be triggered when price dips below 56,000)
                        </Form.Text>
                    </Form.Group>

                <Button variant="primary" type="submit">
                    Add New Alert
                </Button>
                </Form>
            </>
        );
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
}