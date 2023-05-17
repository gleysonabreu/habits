import { NextResponse } from "next/server";
import { prisma } from '../../../../../../libs/prismadb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'The user must be authenticated' }, { status: 401 });
  }

  try {
    await prisma.user.update({
      data: {
        isPublic: true,
      },
      where: {
        id: session.user.id,
      }
    });

    return new Response(null, {
      status: 204,
    });
  } catch (err: any) {
    return NextResponse.json({ message: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}
