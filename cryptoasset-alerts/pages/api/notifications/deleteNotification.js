// todo: delete notification
import { MongoClient, ObjectId } from 'mongodb';
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    
    const session = await getSession({ req });
    if (session) {

        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.8n8pz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
            );
    
        // Retrieve the alertList collection
        const alertList = await client.db(process.env.MONGO_DB).collection('notificationList');

        // Remove the existing alert
        const result = await alertList.deleteOne({
            "_id": new ObjectId(req.body._id)
        });

        res.status(200).json({ msg: "Notification successfully deleted", alert: result });
    
    } else {
        // Not Signed in
        res.status(401).json({msg: "Error while deleting notification, please try again"});
    }
}