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
        const authors = await _context.prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: _parent.id },
          include: { author: true },
        });

        return authors.map((el) => el.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (_parent: { id: string }, _args, _context: MyContext) => {
        const subscribers = await _context.prisma.subscribersOnAuthors.findMany({
          where: { authorId: _parent.id },
          include: { subscriber: true },
        });

        return subscribers.map((el) => el.subscriber);
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
