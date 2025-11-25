import DataLoader from 'dataloader';

export interface Loader {
  memberTypes: DataLoader<string, MemberType | null, string>;
  profiles: DataLoader<string, Profile | null, string>;
  posts: DataLoader<string, Post[], string>;
  userSubscribedTo: DataLoader<string, (string | User)[], string>;
  subscribedToUser: DataLoader<string, (string | User)[], string>;
}

interface User {
  id: string;
  name: string;
  balance: number;
}

interface MemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}
