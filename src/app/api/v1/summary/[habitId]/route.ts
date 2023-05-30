import { NextResponse } from 'next/server';
import z, { ZodError } from 'zod';
import { prisma } from '../../../../../libs/prismadb';

type ContextParams = {
  params: {
    habitId: string;
  };
};

export async function GET(_request: Request, context: ContextParams) {
  try {
    const getDayParams = z.object({
      habitId: z.string(),
    });
    const { habitId } = getDayParams.parse(context.params);

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

    const filteredSummary = summary.map((item) => {
      return {
        ...item,
        completed: Number(item.completed),
        amount: Number(item.amount),
      };
    });

    return NextResponse.json(filteredSummary, { status: 200 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json({ errors: err.issues }, { status: 400 });
    }

    console.log(err);
    return NextResponse.json(
      { message: `Internal Server Error: ${err.message}` },
      { status: 500 },
    );
  }
}
