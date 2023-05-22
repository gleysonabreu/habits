import { getCurrentUser } from "./getCurrentUser";
import { prisma } from '../../libs/prismadb';

export const getHabits = async (userId: string) => {
  try {
    const habits = await prisma.habit.findMany({
      where: {
        userId,
      }
    });

    return habits;
  } catch (error) {
    console.log(error);
    return null;
  }
}
