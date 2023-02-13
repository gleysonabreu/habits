import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import z from 'zod';
import { AppError } from '../../../../../errors/AppError';
import { client } from '../../../../../libs/prismadb';
import authentication from '../../../../../models/authentication';
import controller from '../../../../../models/controller';

export default nextConnect({
  attachParams: true,
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onHandleError,
}).post(authentication.userLoggedIn, createTask);

async function createTask(request: NextApiRequest, response: NextApiResponse) {
  const user = request.user;

  const createTaskParams = z.object({
    id: z.string(),
  });
  const createTaskBody = z.object({
    task: z.string().min(1).max(255),
    weekDays: z.array(z.number().min(0).max(6)).nonempty(),
  });

  const { id } = createTaskParams.parse(request.query);
  const { weekDays, task } = createTaskBody.parse(request.body);

  const habit = await client.habit.findUnique({
    where: {
      id,
    },
  });

  if (!habit) {
    throw new AppError('This habit does not exists!');
  }

  if (habit.userId !== user.id) {
    throw new AppError('This habit is not yours!');
  }

  const today = dayjs().startOf('day').toDate();
  const createTask = await client.task.create({
    data: {
      name: task,
      habitId: id,
      createdAt: today,
      taskWeekDays: {
        create: weekDays.map(weekDay => ({
          weekDay,
        })),
      },
    },
  });

  return response.status(201).json({ task: createTask });
}
