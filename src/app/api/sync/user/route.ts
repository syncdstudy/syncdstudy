import { NextResponse } from 'next/server';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.endsWith('@hawaii.edu')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: 'N/A',
        role: 'USER',
      },
    });

    return NextResponse.json({ message: 'User synced' });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
