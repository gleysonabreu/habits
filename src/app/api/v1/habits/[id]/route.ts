import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import z, { ZodError } from 'zod';
import { prisma } from '../../../../../libs/prismadb';

type ContextParams = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, context: ContextParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: 'The user must be authenticated' },
      { status: 401 },
    );
  }

  try {
    const getHabitParams = z.object({
      id: z.string(),
    });
    const { id } = getHabitParams.parse(context.params);

    const habit = await prisma.habit.findUnique({
      where: {
        id,
      },
    });

    if (!habit) {
      return NextResponse.json(
        { message: 'Hábito não encontrado.' },
        { status: 400 },
      );
    }

    if (habit.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Esse hábito não pertence a você.' },
        { status: 400 },
      );
    }

    return NextResponse.json(habit, { status: 200 });
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
