import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await authenticateUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const subject = url.searchParams.get('subject');
    const maxRate = url.searchParams.get('maxRate');
    const minRating = url.searchParams.get('minRating');
    const search = url.searchParams.get('search');

    // Build the where clause
    const where: any = {
      subjects: subject ? { has: subject } : undefined,
      hourlyRate: maxRate ? { lte: parseFloat(maxRate) } : undefined,
      rating: minRating ? { gte: parseFloat(minRating) } : undefined,
    };

    // If search is provided, add name/bio search
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tutors = await prisma.tutorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    // Format the response
    const formattedTutors = tutors.map(tutor => ({
      id: tutor.id,
      user: {
        name: tutor.user.name,
      },
      subjects: tutor.subjects,
      hourlyRate: tutor.hourlyRate,
      bio: tutor.bio,
      rating: tutor.rating,
      reviewCount: tutor.reviews.length,
    }));

    return NextResponse.json(formattedTutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 