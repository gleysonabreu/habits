import { getCurrentUser } from "./getCurrentUser";
import { prisma } from '../../libs/prismadb';

export const getHabits = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: currentUser.id
      }
    });

    return habits;
  } catch (error) {
    console.log(error);
    return null;
  }
}
