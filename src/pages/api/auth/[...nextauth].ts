import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import TwitchProvider from 'next-auth/providers/twitch';
import { client } from '../../../libs/prismadb';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(client),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_ID ?? '',
      clientSecret: process.env.TWITCH_SECRET ?? '',
    }),
  ],
  callbacks: {
    session: async ({ session, token, user }) => {
      session.user.id = user.id;
      session.user.username = user.username;
      return session;
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
    newUser: '/dashboard/account',
  },
};

export default NextAuth(authOptions);
