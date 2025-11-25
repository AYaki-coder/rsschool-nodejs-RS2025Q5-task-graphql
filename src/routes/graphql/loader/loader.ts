import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { batchOneToOne, batchOneToMany } from './batch.js';

export const genLoader = (prisma: PrismaClient) => {
  return {
    memberTypes: new DataLoader(async (ids: readonly string[]) => {
      const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: [...ids] } },
      });

      return batchOneToOne(ids, memberTypes, 'id');
    }),

    profiles: new DataLoader(async (ids: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: [...ids] } },
      });

      return batchOneToOne(ids, profiles, 'userId');
    }),

    posts: new DataLoader(async (ids: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: [...ids] } },
      });

      return batchOneToMany(ids, posts, 'authorId');
    }),

    userSubscribedTo: new DataLoader(async (ids: readonly string[]) => {
      const authors = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: [...ids] } },
        include: { author: true },
      });

      return batchOneToMany(ids, authors, 'subscriberId', 'author');
    }),

    subscribedToUser: new DataLoader(async (ids: readonly string[]) => {
      const subscribers = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: [...ids] } },
        include: { subscriber: true },
      });

      return batchOneToMany(ids, subscribers, 'authorId', 'subscriber');
    }),
  };
};
