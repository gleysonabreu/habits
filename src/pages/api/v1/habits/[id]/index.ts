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
}).get(authentication.userLoggedIn, getHabits);

async function getHabits(request: NextApiRequest, response: NextApiResponse) {
  const user = request.user;

  const getHabitParams = z.object({
    id: z.string(),
  });
  const { id } = getHabitParams.parse(request.query);

  const habit = await client.habit.findUnique({
    where: {
      id,
    },
  });

  if (!habit) {
    throw new AppError('This habit not exists!');
  }

  if (habit.userId !== user.id) {
    throw new AppError('This habit is not yours!');
  }

  return response.status(201).json({ habit });
}
