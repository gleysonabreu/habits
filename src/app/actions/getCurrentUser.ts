import { getServerSession } from 'next-auth';
import { prisma } from '../../libs/prismadb';
import { authOptions } from '../api/auth/[...nextauth]/route';

export const getCurrentUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });


    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error) {
    return null;
  }
}
