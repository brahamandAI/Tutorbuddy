import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { notificationId } = await req.json();

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return new NextResponse('Notification not found', { status: 404 });
    }

    if (notification.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 