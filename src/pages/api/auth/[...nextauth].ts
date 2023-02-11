import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import TwitchProvider from 'next-auth/providers/twitch';
import { client } from '../../../libs/prismadb';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(client),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_ID,
      clientSecret: process.env.TWITCH_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.sub = user.id;
        token.username = user.username;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token!.sub as string;
      session.user.username = token!.username as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
    signOut: '/',
    newUser: '/dashboard/account',
  },
};

export default NextAuth(authOptions);
