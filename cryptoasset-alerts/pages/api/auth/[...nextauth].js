import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from 'mongodb';
// import { compare } from 'bcryptjs';

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "zmwang" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                // Connect to database
                const client = await MongoClient.connect(
                `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.8n8pz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
                { useNewUrlParser: true, useUnifiedTopology: true }
                );

                // Get list of users
                const users = await client.db(process.env.MONGO_DB).collection('users');
                // Check whether the username exists
                const result = await users.findOne({
                    "username": credentials.username,
                });

                // If the username doesn't exist, then create a new user. Sign-in page also functions as a sign-up page
                if (result === null) {
                    await users.insertOne({
                        "username": credentials.username,
                        "password": credentials.password
                    });
                }

                // TODO: implement hashing. need to store hashed password in database
                //Check hased password with DB password
                //const checkPassword = await compare(credentials.password, result.password);
                //Incorrect password - send response
                else if (result.password !== credentials.password) {
                    client.close();
                    throw new Error('Password doesnt match');
                }

                //Else send success response
                client.close();
                return { username: credentials.username };
            }
        }),
        // ...add more providers here
    ],
    // Needed to create and pass around Session object (which contains username)
    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = user)
            return token
        },
        session: async ({ session, token }) => {
            session.user = token.user
            return session
        }
    } 
});