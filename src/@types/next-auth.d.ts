import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    isPublic: boolean;
    username?: string | null;
  }
  interface Session {
    user: {
      id: string;
      isPublic: boolean;
      username?: string | null;
    } & DefaultSession['user'];
  }
}

