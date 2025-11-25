import { GraphQLNonNull, GraphQLString } from 'graphql';
import { MyContext } from '../types/common.js';
import { UUIDType } from '../types/uuid.js';

export const subscribeTo = {
  type: GraphQLString,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },

  resolve: async (
    _parent,
    _args: { userId: string; authorId: string },
    _context: MyContext,
  ) => {
    await _context.prisma.subscribersOnAuthors.create({
      data: { subscriberId: _args.userId, authorId: _args.authorId },
    });

    return 'subscribed';
  },
};

export const unsubscribeFrom = {
  type: GraphQLString,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },

  resolve: async (
    _parent,
    _args: { userId: string; authorId: string },
    _context: MyContext,
  ) => {
    await _context.prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: { subscriberId: _args.userId, authorId: _args.authorId },
      },
    });
    return 'unsubscribed';
  },
};
