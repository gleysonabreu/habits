import { getCurrentUser } from "./getCurrentUser";
import { prisma } from '../../libs/prismadb';

export const getHabit = async (habitId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const habit = await prisma.habit.findUnique({
      where: {
        id: habitId
      }
    });

    if (!habit) {
      return null;
    }

    if (habit.userId !== currentUser.id) {
      return null;
    }

    return habit;
  } catch (error) {
    console.log(error);
    return null;
  }
}
