import { prisma } from '../../libs/prismadb';

export const getFourAvatars = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: [
          {
            username: null
          },
        ],
        isPublic: true,
      },
      include: {
        _count: {
          select: {
            habits: true,
          }
        }
      },
      take: 4,
    });

    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}
