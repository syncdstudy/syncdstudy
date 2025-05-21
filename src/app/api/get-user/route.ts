/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id } = await req.json();

  const user = await prisma.appUser.findUnique({
    where: { id },
    select: {
      email: true,
      first_name: true,
      last_name: true,
      year: true,
      major: true,
      minor: true,
      interests: true,
      created_at: true,
      bio: true,
      points: true,
      study_streak: true,
      sessions_hosted: true,
      sessions_joined: true
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
