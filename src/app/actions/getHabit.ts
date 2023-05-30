import { prisma } from '../../libs/prismadb';

export const getHabit = async (habitId: string) => {
  try {
    const habit = await prisma.habit.findUnique({
      where: {
        id: habitId,
      },
    });

    if (!habit) {
      return null;
    }

    return habit;
  } catch (error) {
    console.log(error);
    return null;
  }
};
