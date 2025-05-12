import { NextResponse } from 'next/server';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    const formatted = reports.map((r) => ({
      ...r,
      userEmail: r.user?.email ?? r.contactEmail ?? 'Unknown',
    }));

    return NextResponse.json({ reports: formatted });
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json({ error: 'Could not fetch reports' }, { status: 500 });
  }
}
