import { NextResponse } from 'next/server';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  try {
    const logs = await prisma.activitylog.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    const formattedLogs = logs.map(log => ({
      ...log,
      message: `${log.message} (${new Date(log.created_at!).toLocaleString()})`,
    }));

    return NextResponse.json(formattedLogs);
  } catch (error) {
    console.error('Failed to fetch activity logs:', error);
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}
