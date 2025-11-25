import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getPostsByParentId } from '../resolvers/post.js';
import { getProfileByParentId } from '../resolvers/profile.js';
import { MyContext } from './common.js';

export const userType: GraphQLObjectType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: getProfileByParentId,
    posts: getPostsByParentId,
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (_parent: { id: string }, _args, _context: MyContext) => {
        return _context.loader.userSubscribedTo.load(_parent.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (_parent: { id: string }, _args, _context: MyContext) => {
        return _context.loader.subscribedToUser.load(_parent.id);
      },
    },
  }),
});

export const CreateUserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
