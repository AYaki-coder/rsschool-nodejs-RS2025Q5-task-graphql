import { PrismaClient } from '@prisma/client';
import { Loader } from '../loader/types.js';

export interface MyContext {
  prisma: PrismaClient;
  loader: Loader;
}
