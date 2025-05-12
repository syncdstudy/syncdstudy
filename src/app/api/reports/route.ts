import { NextResponse } from 'next/server';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  try {
    const { userId, message, email, topic } = await req.json();

    if (!message || (!userId && !email)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        userId: userId || null,
        message,
        contactEmail: email || null,
        topic: topic || null, // ✅ Store topic if provided
      },
    });

    await prisma.activitylog.create({
      data: {
        type: 'report_submission',
        message: `New report from: ${email || 'anonymous'}`,
      },
    });

    return NextResponse.json({ message: 'Report submitted', report });
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
