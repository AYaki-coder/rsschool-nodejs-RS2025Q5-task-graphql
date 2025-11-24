import { GraphQLList, GraphQLString } from 'graphql';
import { ChangeUserInput, CreateUserInput, userType } from '../types/user.js';
import { MyContext } from '../types/common.js';
import { UUIDType } from '../types/uuid.js';

export const getALLUsers = {
  type: new GraphQLList(userType),
  resolve: async (_parent, _arg, _context: MyContext) => {
    return _context.prisma.user.findMany();
  },
};

export const getUser = {
  type: userType,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_, _args: { id: string }, _context: MyContext) => {
    const user = await _context.prisma.user.findUnique({
      where: { id: _args.id },
    });

    return user ?? null;
  },
};

export const createUser = {
  type: userType,
  args: {
    dto: { type: CreateUserInput },
  },
  resolve: async (
    _,
    _args: { dto: { balance: number; name: string } },
    _context: MyContext,
  ) => {
    return await _context.prisma.user.create({ data: _args.dto });
  },
};

export const changeUser = {
  type: userType,
  args: {
    id: { type: UUIDType },
    dto: { type: ChangeUserInput },
  },
  resolve: async (
    _,
    _args: { dto: { balance: number; name: string }; id: string },
    _context: MyContext,
  ) => {
    return await _context.prisma.user.update({
      where: { id: _args.id },
      data: _args.dto,
    });
  },
};

export const deleteUser = {
  type: GraphQLString,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_, _args: { id: string }, _context: MyContext) => {
    await _context.prisma.user.delete({
      where: { id: _args.id },
    });
    return 'deleted';
  },
};
