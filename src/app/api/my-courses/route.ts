import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// eslint-disable-next-line import/extensions
import authOptions from '@/lib/authOptions';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const session = await getServerSession(authOptions);
  console.log('API session:', session);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const courses = await prisma.course.findMany({
    where: {
      users: {
        some: { id: user.id },
      },
    },
    include: {
      preferences: true,
    },
  });

  return NextResponse.json(courses);
}
