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
}).patch(authentication.userLoggedIn, patchUsername);

async function patchUsername(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const getUsername = z.object({
    username: z.string().min(1).max(15),
  });

  const { username } = getUsername.parse(request.body);

  if (username === request.user.username) {
    throw new AppError('This username is yours!');
  }

  const user = await client.user.findFirst({
    where: {
      username,
    },
  });

  if (user) {
    throw new AppError('Username already exists!');
  }

  await client.user.update({
    where: {
      id: request.user.id,
    },
    data: {
      username,
    },
  });

  return response.status(200).end();
}
