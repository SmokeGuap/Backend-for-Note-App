import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ApolloServer, ForbiddenError } from 'apollo-server-express';
import gravatar from 'gravatar';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  newNote: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }
    return await models.Note.create({
      content: args.content,
      author: new mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (parent, { id }, { models }) => {
    try {
      await models.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models }) => {
    return await models.Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          content,
        },
      },
      {
        new: true,
      }
    );
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email);
    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      });
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error('Error creating account');
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }
    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      throw new AuthenticationError('Error signing in');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error signing in');
    }
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
};
