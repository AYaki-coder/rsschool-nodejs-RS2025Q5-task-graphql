import { GraphQLList, GraphQLString } from 'graphql';
import { MyContext } from '../types/common.js';
import { changeProfileInput, createProfileInput, profileType } from '../types/profile.js';
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
    return _context.loader.profiles.load(_parent.id);
  },
};

export const createProfile = {
  type: profileType,
  args: {
    dto: { type: createProfileInput },
  },
  resolve: async (
    _parent,
    _args: {
      dto: { isMale: boolean; yearOfBirth: number; memberTypeId: string; userId: string };
    },
    _context: MyContext,
  ) => {
    return await _context.prisma.profile.create({ data: _args.dto });
  },
};

export const changeProfile = {
  type: profileType,
  args: {
    id: { type: UUIDType },
    dto: { type: changeProfileInput },
  },
  resolve: async (
    _parent,
    _args: {
      id: string;
      dto: { isMale: boolean; yearOfBirth: number; memberTypeId: string };
    },
    _context: MyContext,
  ) => {
    return await _context.prisma.profile.update({
      where: { id: _args.id },
      data: _args.dto,
    });
  },
};

export const deleteProfile = {
  type: GraphQLString,
  args: {
    id: { type: UUIDType },
  },
  resolve: async (
    _parent,
    _args: {
      id: string;
    },
    _context: MyContext,
  ) => {
    await _context.prisma.profile.delete({
      where: { id: _args.id },
    });

    return 'deleted';
  },
};
