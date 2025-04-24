import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseId, notify } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.courseNotificationPreference.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: Number(courseId),
        },
      },
      update: { notify },
      create: {
        userId: user.id,
        courseId: Number(courseId),
        notify,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Toggle API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
