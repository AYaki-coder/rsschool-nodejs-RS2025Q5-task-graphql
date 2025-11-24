import { GraphQLList, GraphQLString } from 'graphql';
import { changePostInput, createPostInput, postType } from '../types/post.js';
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

export const createPost = {
  type: postType,
  args: { dto: { type: createPostInput } },
  resolve: async (
    _parent,
    _args: { dto: { title: string; content: string; authorId: string } },
    _context: MyContext,
  ) => {
    return await _context.prisma.post.create({ data: _args.dto });
  },
};

export const changePost = {
  type: postType,
  args: { dto: { type: changePostInput }, id: { type: UUIDType } },
  resolve: async (
    _parent,
    _args: { dto: { title: string; content: string }; id: string },
    _context: MyContext,
  ) => {
    return await _context.prisma.post.update({
      where: { id: _args.id },
      data: _args.dto,
    });
  },
};

export const deletePost = {
  type: GraphQLString,
  args: { id: { type: UUIDType } },
  resolve: async (_parent, _args: { id: string }, _context: MyContext) => {
    await _context.prisma.post.delete({
      where: { id: _args.id },
    });

    return 'deleted';
  },
};
