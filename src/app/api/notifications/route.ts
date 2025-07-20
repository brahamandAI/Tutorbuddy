import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to 10 most recent notifications
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { type, title, message } = await req.json();

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 