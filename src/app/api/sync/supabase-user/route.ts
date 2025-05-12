import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body.record;

    if (!email || !email.endsWith('@hawaii.edu')) {
      return NextResponse.json({ message: 'Ignored non-UH email' });
    }

    // Upsert user into Prisma-managed User table
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: 'N/A', // Supabase handles auth separately
        role: 'USER',
      },
    });

    // Log the signup in activitylog
    await prisma.activitylog.create({
      data: {
        type: 'user_signup',
        message: `New user: ${email}`,
      },
    });

    return NextResponse.json({ message: 'User synced and logged' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
