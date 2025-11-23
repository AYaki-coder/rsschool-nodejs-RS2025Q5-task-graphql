import { GraphQLList } from 'graphql';
import { memberType } from '../types/member-type.js';
import { MyContext } from '../types/common.js';
import { MemberTypeId } from '../types/member-type-id.js';

export const getAllMemberTypes = {
  type: new GraphQLList(memberType),
  resolve: async (_parent, _arg, _context: MyContext) => {
    return _context.prisma.memberType.findMany();
  },
};

export const getMemberType = {
  type: memberType,
  args: {
    id: { type: MemberTypeId },
  },
  resolve: async (_, _args: { id: string }, _context: MyContext) => {
    const mt = await _context.prisma.memberType.findUnique({
      where: { id: _args.id },
    });

    return mt ?? null;
  },
};

export const getMemberTypeByParentId = {
  type: memberType,
  resolve: async (_parent: { memberTypeId: string }, _args, _context: MyContext) => {
    const memberType = await _context.prisma.memberType.findUnique({
      where: { id: _parent.memberTypeId },
    });

    return memberType ?? null;
  },
};
