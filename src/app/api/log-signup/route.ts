import { NextResponse } from 'next/server';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  try {
    await prisma.activitylog.create({
      data: {
        type: 'user_signup',
        message: `New user: ${email}`,
      },
    });

    return NextResponse.json({ message: 'Signup logged' });
  } catch (error) {
    console.error('Activity log insert failed:', error);
    return NextResponse.json({ error: 'Failed to log signup' }, { status: 500 });
  }
}
