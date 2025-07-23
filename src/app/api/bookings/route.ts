import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await authenticateUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can book sessions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { tutorId, startTime, endTime } = body;

    // Validate input
    if (!tutorId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Check if tutor exists
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: 'Tutor not found' },
        { status: 404 }
      );
    }

    // Validate booking time against tutor's availability
    const bookingDate = new Date(startTime);
    const dayOfWeek = bookingDate.getDay();
    const bookingStartTime = `${bookingDate.getHours().toString().padStart(2, '0')}:${bookingDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Parse availability JSON and check if tutor is available
    const availability = tutor.availability as any;
    const isAvailable = availability && Array.isArray(availability) && availability.some((slot: any) => 
      slot.dayOfWeek === dayOfWeek &&
      slot.startTime <= bookingStartTime &&
      slot.endTime > bookingStartTime
    );

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Tutor is not available at this time' },
        { status: 400 }
      );
    }

    // Check for existing bookings in the same time slot
    const existingBooking = await prisma.booking.findFirst({
      where: {
        tutorId,
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        tutorId,
        studentId: studentProfile.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        subject: 'General', // Default subject since it's required
        status: 'pending',
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await authenticateUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let bookings;
    if (user.role === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
      });

      if (!studentProfile) {
        return NextResponse.json(
          { error: 'Student profile not found' },
          { status: 404 }
        );
      }

      bookings = await prisma.booking.findMany({
        where: { studentId: studentProfile.id },
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startTime: 'desc' },
      });
    } else {
      const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: user.id },
      });

      if (!tutorProfile) {
        return NextResponse.json(
          { error: 'Tutor profile not found' },
          { status: 404 }
        );
      }

      bookings = await prisma.booking.findMany({
        where: { tutorId: tutorProfile.id },
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startTime: 'desc' },
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 