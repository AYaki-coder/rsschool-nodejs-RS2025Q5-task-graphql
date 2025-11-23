import { GraphQLList } from 'graphql';
import { postType } from '../types/post.js';
import { MyContext } from '../types/common.js';
import { UUIDType } from '../types/uuid.js';

export const getAllPosts = {
  type: new GraphQLList(postType),
  resolve: async (_parent, _arg, _context: MyContext) => {
    return _context.prisma.post.findMany();
  },
};

export const getPost = {
  type: postType,
  args: { id: { type: UUIDType } },
  resolve: async (_parent, _args: { id: string }, _context: MyContext) => {
    const post = await _context.prisma.post.findUnique({
      where: { id: _args.id },
    });

    return post ?? null;
  },
};

export const getPostsByParentId = {
  type: new GraphQLList(postType),
  resolve: async (_parent: { id: string }, _args, _context: MyContext) => {
    const post = await _context.prisma.post.findMany({
      where: { authorId: _parent.id },
    });

    return post ?? null;
  },
};
