import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    isPublic: boolean;
  }
  interface Session {
    user: {
      id: string;
      isPublic: boolean;
    } & DefaultSession['user'];
  }
}

