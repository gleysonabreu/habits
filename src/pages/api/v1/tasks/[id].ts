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
}).post(authentication.userLoggedIn, taskDone);

async function taskDone(request: NextApiRequest, response: NextApiResponse) {
  const createTaskDone = z.object({
    id: z.string(),
  });

  const createTaskBody = z.object({
    date: z.coerce.date(),
  });

  const { id } = createTaskDone.parse(request.query);
  const { date } = createTaskBody.parse(request.body);

  let day = await client.day.findFirst({
    where: {
      date,
    },
  });

  if (!day) {
    day = await client.day.create({
      data: {
        date,
      },
    });
  }

  const dayTask = await client.dayTask.findUnique({
    where: {
      dayId_taskId: {
        dayId: day.id,
        taskId: id,
      },
    },
  });

  if (dayTask) {
    await client.dayTask.delete({
      where: {
        id: dayTask.id,
      },
    });
  } else {
    await client.dayTask.create({
      data: {
        dayId: day.id,
        taskId: id,
      },
    });
  }

  return response.status(200).end();
}
