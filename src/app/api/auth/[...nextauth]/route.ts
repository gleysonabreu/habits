import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import TwitchProvider from 'next-auth/providers/twitch';
import { prisma } from '@/libs/prismadb';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
    session: async ({ user, session }) => {
      session.user.id = user.id;

      return session;
    }
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/'
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

