import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { prisma } from '../../../../../../libs/prismadb';

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: 'The user must be authenticated' },
      { status: 401 },
    );
  }

  try {
    const schema = z.object({
      username: z
        .string({ required_error: 'Preencha o seu nome de usuário.' })
        .trim()
        .min(3, { message: 'Digite pelo menos 3 caractres.' })
        .max(15, 'Digite no máximo 15 caracteres.')
        .nonempty({ message: 'Preencha o seu nome de usuário.' }),
    });

    const body = await request.json();
    const { username } = schema.parse(body);

    if (session.user.username === username) {
      return NextResponse.json(
        { message: 'Esse nome de usuário já é seu!' },
        { status: 400 },
      );
    }

    const findUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (findUsername) {
      return NextResponse.json(
        { message: 'Nome de usuário já está cadastrado em outra conta!' },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
      },
    });

    return new Response(null, {
      status: 204,
    });
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
