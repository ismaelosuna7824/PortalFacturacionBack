import { IResolvers } from 'graphql-tools';
import query from './query';
import mutation from './mutation';
import subscription from './subscription';
import types from './types';


const resolvers : IResolvers = {
   ...query,
   ...types,
   ...mutation,
   ...subscription,
}

export default resolvers ;
