import { NextResponse } from 'next/server';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id, 10);
    const { resolved } = await req.json();

    const updated = await prisma.report.update({
      where: { id },
      data: { resolved },
    });

    return NextResponse.json({ message: 'Updated', updated });
  } catch (error) {
    console.error('Failed to update report:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
