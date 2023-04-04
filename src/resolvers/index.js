import GraphQLDateTime from 'graphql-iso-date';
import Query from './query.js';
import Mutation from './mutation.js';
import User from './user.js';
import Note from './note.js';

export default {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDateTime,
};
