import dayjs from "dayjs";
import { NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { prisma } from '../../../../../libs/prismadb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type Context = {
  params: {
    taskId: string;
  }
}

export async function POST(request: Request, context: Context) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'The user must be authenticated' }, { status: 401 });
  }

  try {
    const createTaskDone = z.object({
      id: z.string(),
    });

    const createTaskDoneBody = z.object({
      date: z.coerce.date(),
    });

    const body = await request.json();
    const { date } = createTaskDoneBody.parse(body);
    const { id } = createTaskDone.parse({ id: context.params.taskId });

    const today = dayjs().toDate();
    const dateNow = dayjs(today).utc().local().format();
    const dateConvert = dayjs(date).utc().local().format();
    const compareInDays = dayjs(dateNow).diff(dateConvert, 'days')

    if (compareInDays >= 1) {
      return NextResponse.json({ message: 'Você só pode marcar tarefas para o dia de hoje.' }, { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        habit: {
          include: {
            user: true,
          }
        }
      }
    });

    if (!task) {
      return NextResponse.json({ message: 'Essa tarefa não existe.' }, { status: 400 });
    }

    if (task.habit.user.id !== session.user.id) {
      return NextResponse.json({ message: 'Essa tarefa não é sua para executar essa ação.' }, { status: 400 });
    }

    let day = await prisma.day.findFirst({
      where: {
        date
      }
    });

    if (!day) {
      day = await prisma.day.create({
        data: {
          date,
        }
      });
    }

    const dayTask = await prisma.dayTask.findUnique({
      where: {
        dayId_taskId: {
          dayId: day.id,
          taskId: id,
        }
      }
    });


    if (dayTask) {
      await prisma.dayTask.delete({
        where: {
          id: dayTask.id,
        }
      });
    } else {
      await prisma.dayTask.create({
        data: {
          dayId: day.id,
          taskId: id,
        }
      });
    }

    return NextResponse.json({}, { status: 201 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json({ errors: err.issues }, { status: 400 });
    }

    return NextResponse.json({ message: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}
