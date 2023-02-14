import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import z from 'zod';
import { client } from '../../../../libs/prismadb';
import authentication from '../../../../models/authentication';
import controller from '../../../../models/controller';

export default nextConnect({
  attachParams: true,
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onHandleError,
})
  .post(authentication.userLoggedIn, createHabit)
  .get(authentication.userLoggedIn, getHabits);

async function getHabits(request: NextApiRequest, response: NextApiResponse) {
  const user = request.user;

  const habits = await client.habit.findMany({
    where: {
      userId: user.id,
    },
    include: {
      tasks: true,
    },
  });

  return response.status(200).json({ habits });
}

async function createHabit(request: NextApiRequest, response: NextApiResponse) {
  const user = request.user;

  const createHabit = z.object({
    tasks: z.array(z.string().trim().min(3)).nonempty(),
    weekDays: z.array(z.number().min(0).max(6)).nonempty(),
    title: z.string().min(1).max(50),
  });

  const { tasks, weekDays } = createHabit.parse(request.body);
  const today = dayjs().startOf('day').toDate();

  const habit = await client.habit.create({
    data: {
      userId: user.id,
      title: request.body.title,
      tasks: {
        create: tasks.map(task => ({
          createdAt: today,
          name: task,
          taskWeekDays: {
            create: weekDays.map(weekDay => ({
              weekDay,
            })),
          },
        })),
      },
    },
    include: {
      tasks: true,
    },
  });

  return response.status(201).json({ habit });
}
