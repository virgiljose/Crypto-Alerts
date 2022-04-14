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
        const alertList = await client.db(process.env.MONGO_DB).collection('alertList');

        // Add alert here
        const result = await alertList.insertOne({
            "ticker": req.body.ticker,
            "price": parseFloat(req.body.price,10),
            "direction": (req.body.direction === '1' ? true : false),
            "username": session.user.username,
        });

        res.status(200).json({ msg: "Alert successfully added", alert: result });
    
    } else {
        // Not Signed in
        res.status(401).json({msg: "Error while adding alert, please try again"});
    }
}