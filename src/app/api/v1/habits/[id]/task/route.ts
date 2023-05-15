import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import z, { ZodError } from 'zod';
import { prisma } from '../../../../../../libs/prismadb';
import dayjs from "dayjs";

type Context = {
  params: {
    id: string;
  }
}

export async function POST(request: Request, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'The user must be authenticated' }, { status: 401 });
  }

  const createTaskParams = z.object({
    id: z.string().nonempty(),
  });

  const createTaskBody = z.object({
    task: z.string({ required_error: 'Você deve digtar pelo menos um exercício ou tarefa.' }).nonempty({ message: 'Você deve digtar pelo menos um exercício ou tarefa.' }).min(3, { message: 'A tarefa ou exercício deve conter pelo menos 3 caracteres' }).max(15, { message: 'A tarefa ou exercício deve conter no máximo 15 caracteres' }),
    weekDays: z.array(z.number({ required_error: 'Selecione um dia da semana de segunda a sexta.' }).min(0, { message: "Selecione um dia da semana de segunda a sexta." }).max(6, { message: "Selecione um dia da semana de segunda a sexta." }), { required_error: 'Você deve selecionar pelo menos um dia da semana.' }).nonempty({ message: 'Você deve selecionar pelo menos um dia da semana.' }),
  });

  try {
    const body = await request.json();
    const { id } = createTaskParams.parse(context.params);
    const { task, weekDays } = createTaskBody.parse(body);


    const habit = await prisma.habit.findUnique({
      where: {
        id,
      }
    });


    if (!habit) {
      return NextResponse.json({ message: 'Hábito não encontrado.' }, { status: 404 });
    }

    if (habit.userId !== session.user.id) {
      return NextResponse.json({ message: 'O usuário não tem permissão para acessar esse hábito.' }, { status: 403 });
    }

    const createTask = await prisma.task.create({
      data: {
        name: task,
        habitId: id,
        taskWeekDays: {
          create: weekDays.map((weekDay) => ({
            weekDay,
          })),
        }
      }
    });

    return NextResponse.json(createTask, { status: 201 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json({ errors: err.issues }, { status: 400 });
    }

    return NextResponse.json({ message: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
} 
