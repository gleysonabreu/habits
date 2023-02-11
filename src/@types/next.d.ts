import 'next';

declare module 'next' {
  interface NextApiRequest {
    user: {
      id: string;
      username?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
