import  GraphQLDateTime  from 'graphql-iso-date';
import Query from './query.js';
import Mutation from './mutation.js';

export default {
  Query,
  Mutation,
  DateTime: GraphQLDateTime,
};
