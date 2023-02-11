import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import z from 'zod';
import { AppError } from '../../../../errors/AppError';
import { client } from '../../../../libs/prismadb';
import controller from '../../../../models/controller';

export default nextConnect({
  attachParams: true,
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onHandleError,
}).get(getUser);

async function getUser(request: NextApiRequest, response: NextApiResponse) {
  const getUserProfile = z.object({
    username: z.string(),
  });

  const { username } = getUserProfile.parse(request.query);

  const user = await client.user.findUnique({
    where: {
      username,
    },
    include: {
      Habit: true,
    },
  });

  if (!user) {
    throw new AppError('User does not exists!');
  }

  return response.status(200).json(user);
}
