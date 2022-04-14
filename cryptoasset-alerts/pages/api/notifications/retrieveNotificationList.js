import { MongoClient } from 'mongodb';
import { getSession } from "next-auth/react";

// req = HTTP incoming message, res = HTTP server response
export default async function handler(req, res) {

    const session = await getSession({ req });
    if (session) {

        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.8n8pz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
            );
    
        // Retrieve the alertList collection
        const notificationList = await client.db(process.env.MONGO_DB).collection('notificationList');

        // Retrieve collections for the specified user
        const result = await notificationList.find({
            "username": session.user.username,
        }).toArray();

        res.status(200).json({ result });
    
    } else {
        // Not Signed in
        res.status(401).json({ msg: "Loading data, please wait"});
    }
}