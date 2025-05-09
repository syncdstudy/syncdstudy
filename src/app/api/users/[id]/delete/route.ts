import { NextResponse } from 'next/server';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';

/* eslint-disable import/prefer-default-export */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = parseInt(params.id, 10);
    console.log('Deleting user with ID:', userId);

    // Step 1: Delete related CourseNotificationPreferences
    await prisma.courseNotificationPreference.deleteMany({
      where: { userId },
    });

    // Step 2: Delete the user

    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
