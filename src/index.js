import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import connectToDB from './db.js';
import models from './models/index.js';
import typeDefs from './schema.js';
import resolvers from './resolvers/index.js';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

connectToDB(DB_HOST);
const db = mongoose.connection;
db.on('error', (error) =>
  console.error('Error connecting to MongoDB database', error)
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user);
    return { models, user };
  },
});

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      new Error('Session invalid');
    }
  }
};

server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
