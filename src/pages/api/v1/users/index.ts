import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import z from 'zod';
import { client } from '../../../../libs/prismadb';
import controller from '../../../../models/controller';

export default nextConnect({
  attachParams: true,
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onHandleError,
}).get(getUsers);

async function getUsers(request: NextApiRequest, response: NextApiResponse) {
  const getUserProfile = z.object({
    username: z.string().min(3).max(20),
  });

  const { username } = getUserProfile.parse(request.query);

  const users = await client.user.findMany({
    where: {
      username: { contains: username },
    },
    select: {
      id: true,
      name: true,
      image: true,
      username: true,
    },
  });

  return response.status(200).json(users);
}
