import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import z from 'zod';
import { client } from '../../../../libs/prismadb';
import controller from '../../../../models/controller';

export default nextConnect({
  attachParams: true,
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onHandleError,
}).get(getSummary);

async function getSummary(request: NextApiRequest, response: NextApiResponse) {
  const getDayParams = z.object({
    habitId: z.string(),
  });
  const { habitId } = getDayParams.parse(request.query);

  const summary = await client.$queryRaw<
    { id: string; date: Date; completed: number; amount: number }[]
  >`
    SELECT D.id, D.date,
    (
      SELECT
      CAST(COUNT(*) AS DECIMAL)
      FROM day_tasks DT
      JOIN tasks T
        ON T.id = DT.task_id
      JOIN habits H
        ON H.id = T.habit_id
      WHERE DT.day_id = D.id AND H.id = ${habitId}
    ) as completed,
    (
      SELECT
      CAST(COUNT(*) AS DECIMAL)
      FROM task_week_days TWD
      JOIN tasks T
        ON T.id = TWD.task_id
      JOIN habits H
        ON H.id = T.habit_id
      WHERE TWD.week_day = (DAYOFWEEK(D.date) - 1)
        AND H.id = ${habitId}
    ) as amount
    FROM days D
    `;

  return response.status(200).json({ summary });
}
