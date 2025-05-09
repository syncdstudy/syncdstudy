import { NextResponse } from 'next/server';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email } = body.record;
    if (!email.endsWith('@hawaii.edu')) {
      return NextResponse.json({ message: 'Ignored non-UH email' });
    }

    // Create user if not already in DB
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: 'N/A', // Supabase handles auth; you can store "N/A" or leave out
        role: 'USER',
      },
    });

    return NextResponse.json({ message: 'User synced' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
