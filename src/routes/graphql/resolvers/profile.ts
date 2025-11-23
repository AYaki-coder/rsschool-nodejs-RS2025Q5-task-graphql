import { GraphQLList } from 'graphql';
import { MyContext } from '../types/common.js';
import { profileType } from '../types/profile.js';
import { UUIDType } from '../types/uuid.js';

export const getALLProfiles = {
  type: new GraphQLList(profileType),
  resolve: async (_parent, _arg, _context: MyContext) => {
    return _context.prisma.profile.findMany();
  },
};

export const getProfile = {
  type: profileType,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (_, _args: { id: string }, _context: MyContext) => {
    const profile = await _context.prisma.profile.findUnique({
      where: { id: _args.id },
    });

    return profile ?? null;
  },
};

export const getProfileByParentId = {
  type: profileType,
  resolve: async (_parent: { id: string }, _args, _context: MyContext) => {
    const profile = await _context.prisma.profile.findUnique({
      where: { userId: _parent.id },
    });

    return profile ?? null;
  },
};
