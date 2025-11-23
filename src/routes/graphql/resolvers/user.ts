import { GraphQLList } from 'graphql';
import { userType } from '../types/user.js';
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
