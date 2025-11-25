import { GraphQLList, GraphQLResolveInfo, GraphQLString } from 'graphql';
import { ChangeUserInput, CreateUserInput, userType } from '../types/user.js';
import { MyContext, UserInfo, UserInfoExtended, UserSubsInfo } from '../types/common.js';
import { UUIDType } from '../types/uuid.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const getALLUsers = {
  type: new GraphQLList(userType),
  resolve: async (
    _parent,
    _arg,
    _context: MyContext,
    resolveInfo: GraphQLResolveInfo,
  ) => {
    const parsedResolveInfoFragment = parseResolveInfo(resolveInfo) as ResolveTree;
    const { fields }: { fields: Record<string, unknown> } =
      simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment,
        resolveInfo.returnType,
      );
    const include: Record<string, unknown> = {};
    if (fields['userSubscribedTo']) {
      include.userSubscribedTo = true;
    }
    if (fields['subscribedToUser']) {
      include.subscribedToUser = true;
    }

    if (Object.entries(include).length === 0) {
      return _context.prisma.user.findMany();
    }

    const users: UserInfoExtended[] = await _context.prisma.user.findMany({ include });

    const dataUsers = new Map(
      users.map((user) => [
        user.id,
        { name: user.name, balance: user.balance, id: user.id },
      ]),
    );
    users.forEach(({ id, subscribedToUser, userSubscribedTo }) => {
      const authors: UserInfo[] = [];
      const subscribers: UserInfo[] = [];

      if (userSubscribedTo && userSubscribedTo.length) {
        userSubscribedTo.forEach(({ authorId }: UserSubsInfo) => {
          const author = dataUsers.get(authorId);
          if (author) {
            authors.push(author);
          }
        });
      }

      if (subscribedToUser && subscribedToUser.length) {
        subscribedToUser.forEach(({ subscriberId }: UserSubsInfo) => {
          const subscriber = dataUsers.get(subscriberId);
          if (subscriber) {
            subscribers.push(subscriber);
          }
        });
      }

      _context.loader.subscribedToUser.prime(id, subscribers);
      _context.loader.userSubscribedTo.prime(id, authors);
    });

    return users;
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
