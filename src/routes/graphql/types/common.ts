import { PrismaClient } from '@prisma/client';
import { Loader } from '../loader/types.js';

export interface MyContext {
  prisma: PrismaClient;
  loader: Loader;
}

export interface UserInfo {
  id: string;
  name: string;
  balance: number;
}

export interface UserSubsInfo {
  authorId: string;
  subscriberId: string;
}
export interface UserInfoExtended extends UserInfo {
  subscribedToUser?: Array<UserSubsInfo>;
  userSubscribedTo?: Array<UserSubsInfo>;
}
