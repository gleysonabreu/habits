import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prismadb';
import zod, { ZodError } from 'zod';
import dayjs from 'dayjs';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: 'The user must be authenticated' },
      { status: 401 },
    );
  }

  const createHabit = zod.object({
    tasks: zod
      .array(
        zod
          .string()
          .trim()
          .min(3, {
            message:
              'A tarefa ou exercício deve conter pelo menos 3 caracteres',
          })
          .max(15, {
            message:
              'A tarefa ou exercício deve conter no máximo 15 caracteres',
          }),
        {
          required_error:
            'Você deve preencher pelo menos uma tarefa ou exercício.',
        },
      )
      .nonempty({
        message: 'Você deve preencher pelo menos uma tarefa ou exercício.',
      }),
    weekDays: zod
      .array(
        zod
          .number()
          .min(0, { message: 'Selecione um dia da semana de segunda a sexta.' })
          .max(6, {
            message: 'Selecione um dia da semana de segunda a sexta.',
          }),
        { required_error: 'Você deve selecionar pelo menos um dia da semana.' },
      )
      .nonempty({
        message: 'Você deve selecionar pelo menos um dia da semana.',
      }),
    title: zod
      .string({ required_error: 'Você deve digitar algum título' })
      .nonempty({ message: 'Você deve digitar algum título' })
      .min(3, { message: 'O título deve conter pelo menos 3 caracteres' })
      .max(15, { message: 'O título deve conter no máximo 15 caracteres' }),
  });

  try {
    const body = await request.json();
    const { tasks, weekDays, title } = createHabit.parse(body);

    const habit = await prisma.habit.create({
      data: {
        userId: session.user.id,
        title,
        tasks: {
          create: tasks.map((task) => ({
            name: task,
            taskWeekDays: {
              create: weekDays.map((weekDay) => ({
                weekDay,
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json({ habit }, { status: 201 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json({ errors: err.issues }, { status: 400 });
    }

    return NextResponse.json(
      { message: `Internal Server Error: ${err.message}` },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: 'The user must be authenticated' },
      { status: 401 },
    );
  }

  const habits = await prisma.habit.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ habits });
}
