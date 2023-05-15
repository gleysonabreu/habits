import { getCurrentUser } from "./getCurrentUser";
import { prisma } from '../../libs/prismadb';

export const getSummary = async (habitId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const summary = await prisma.$queryRaw<
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
      WHERE TWD.week_day = extract(dow from D.date)
        AND H.id = ${habitId}
    ) as amount
    FROM days D
    `;

    const filteredSummary = summary.map(item => {
      return {
        ...item,
        completed: Number(item.completed),
        amount: Number(item.amount),
      };
    });

    return filteredSummary;
  } catch (error) {
    console.log(error);
    return null;
  }
}
