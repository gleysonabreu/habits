import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import z from 'zod';
import { AppError } from '../../../../errors/AppError';
import { client } from '../../../../libs/prismadb';
import authentication from '../../../../models/authentication';
import controller from '../../../../models/controller';

export default nextConnect({
  attachParams: true,
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onHandleError,
}).get(authentication.userLoggedIn, getDays);

async function getDays(request: NextApiRequest, response: NextApiResponse) {
  const user = request.user;
  const getDayParams = z.object({
    habitId: z.string(),
    date: z.coerce.date(),
    weekDay: z.string(),
  });

  const { habitId, date, weekDay } = getDayParams.parse(request.query);

  const habit = await client.habit.findUnique({
    where: {
      id: habitId,
    },
  });

  if (!habit) {
    throw new AppError('Habit does not exists!');
  }

  if (habit.userId !== user.id) {
    throw new AppError('This habit is not yours!');
  }

  const possibleTasks = await client.task.findMany({
    where: {
      habitId,
      taskWeekDays: {
        some: {
          weekDay: Number(weekDay),
        },
      },
    },
  });

  const day = await client.$queryRaw<{ task_id: string }[]>`
      SELECT
      DT.*
      FROM days D
      JOIN day_tasks DT
        ON DT.day_id = D.id
      JOIN tasks T
        ON T.id = DT.task_id
      JOIN habits H
        ON H.id = T.habit_id
      WHERE D.date = ${date}
      AND H.id = ${habitId}
    `;

  const completedTasks =
    day.map(d => {
      return d.task_id;
    }) ?? [];

  return response.status(200).json({ completedTasks, possibleTasks });
}
