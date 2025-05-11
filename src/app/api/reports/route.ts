import { NextResponse } from 'next/server';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  try {
    const { userId, message } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ error: 'Missing userId or message' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        userId,
        message,
      },
    });

    return NextResponse.json({ message: 'Report submitted', report });
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
