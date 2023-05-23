import { NextResponse } from 'next/server';
import z, { ZodError } from 'zod';
import { prisma } from '../../../../../libs/prismadb';

type ContextParams = {
  params: {
    habitId: string;
  }
}

export async function GET(request: Request, context: ContextParams) {
  const { searchParams } = new URL(request.url);
  const dateQuery = searchParams.get('date');
  const weekDayQuery = searchParams.get('weekDay');

  try {
    const getDayParams = z.object({
      habitId: z.string(),
      date: z.coerce.date(),
      weekDay: z.string(),
    });

    const { habitId, date, weekDay } = getDayParams.parse({ date: dateQuery, weekDay: weekDayQuery, habitId: context.params.habitId });

    const habit = await prisma.habit.findUnique({
      where: {
        id: habitId,
      },
    });

    if (!habit) {
      return NextResponse.json({ message: 'Hábito não encontrado!' }, { status: 404 });
    }

    const possibleTasks = await prisma.task.findMany({
      where: {
        habitId,
        taskWeekDays: {
          some: {
            weekDay: Number(weekDay),
          },
        },
      },
    });

    const day = await prisma.$queryRaw<{ task_id: string }[]>`
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
      day.map((d) => {
        return d.task_id;
      }) ?? [];

    return NextResponse.json({ completedTasks, possibleTasks }, { status: 200 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json({ errors: err.issues }, { status: 400 });
    }

    return NextResponse.json({ message: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}
