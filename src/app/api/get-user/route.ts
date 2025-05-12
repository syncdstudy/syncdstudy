/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = await req.json();

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      email: true,
      first_name: true,
      last_name: true,
      year: true,
      major: true,
      minor: true, // ✅ add this
      interests: true, // ✅ add this
      created_at: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
