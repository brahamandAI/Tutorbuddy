import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

// Verify Google access token and get user info
async function verifyGoogleToken(accessToken: string): Promise<GoogleUserInfo> {
  try {
    // First, verify the token with Google
    const tokenInfoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
    );

    if (!tokenInfoResponse.ok) {
      throw new Error('Invalid access token');
    }

    const tokenInfo = await tokenInfoResponse.json();

    // Verify the audience (client ID)
    if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Token audience mismatch');
    }

    // Get user info using the access token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();
    return userInfo;
  } catch (error) {
    console.error('Google token verification error:', error);
    throw new Error('Failed to verify Google token');
  }
}

// Find or create user in database
async function findOrCreateUser(userInfo: GoogleUserInfo, role: string = 'STUDENT') {
  try {
    console.log('Database: Looking for existing user with email:', userInfo.email);
    
    // Check if user exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (existingUser) {
      console.log('Database: Found existing user:', existingUser.id);
      
      // Update last login and Google info
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          lastLogin: new Date(),
          googleId: userInfo.id,
          picture: userInfo.picture,
          provider: 'google',
          emailVerified: userInfo.verified_email,
        },
      });
      
      console.log('Database: Updated existing user');

      // Check if profile exists, create if missing
      if (existingUser.role === 'TUTOR') {
        const tutorProfile = await prisma.tutorProfile.findUnique({
          where: { userId: existingUser.id },
        });
        
        if (!tutorProfile) {
          console.log('Database: Creating missing tutor profile');
          await prisma.tutorProfile.create({
            data: {
              userId: existingUser.id,
              bio: '',
              subjects: [],
              hourlyRate: 0,
              availability: [],
              qualifications: '',
              mode: '',
              location: '',
              experience: '',
              contact: '',
              languages: [],
              profilePicture: userInfo.picture || '',
            },
          });
        }
      } else if (existingUser.role === 'STUDENT') {
        const studentProfile = await prisma.studentProfile.findUnique({
          where: { userId: existingUser.id },
        });
        
        if (!studentProfile) {
          console.log('Database: Creating missing student profile');
          await prisma.studentProfile.create({
            data: {
              userId: existingUser.id,
              grade: '',
              subjects: [],
            },
          });
        }
      }
      
      return updatedUser;
    }

    console.log('Database: Creating new user with role:', role);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        role: role,
        provider: 'google',
        googleId: userInfo.id,
        emailVerified: userInfo.verified_email,
        lastLogin: new Date(),
      },
    });

    console.log('Database: Created new user:', newUser.id);

    // Create profile based on role
    if (role === 'TUTOR') {
      console.log('Database: Creating tutor profile');
      await prisma.tutorProfile.create({
        data: {
          userId: newUser.id,
          bio: '',
          subjects: [],
          hourlyRate: 0,
          availability: [],
          qualifications: '',
          mode: '',
          location: '',
          experience: '',
          contact: '',
          languages: [],
          profilePicture: userInfo.picture || '',
        },
      });
      console.log('Database: Created tutor profile');
    } else if (role === 'STUDENT') {
      console.log('Database: Creating student profile');
      await prisma.studentProfile.create({
        data: {
          userId: newUser.id,
          grade: '',
          subjects: [],
        },
      });
      console.log('Database: Created student profile');
    }

    return newUser;
  } catch (error) {
    console.error('Database operation error:', error);
    throw new Error('Failed to create or find user');
  }
}

// Generate JWT token
function generateJWT(user: any): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    provider: user.provider,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, role } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    console.log('Google OAuth: Starting authentication process...');
    console.log('Role:', role);

    // 1. Verify Google access token and get user info
    const userInfo = await verifyGoogleToken(accessToken);
    console.log('Google OAuth: User info received:', { email: userInfo.email, name: userInfo.name });

    // 2. Find or create user in database
    const user = await findOrCreateUser(userInfo, role);
    console.log('Google OAuth: User found/created:', { id: user.id, email: user.email, role: user.role });

    // 3. Generate JWT token
    const token = generateJWT(user);
    console.log('Google OAuth: JWT token generated');

    // 4. Return user data and token
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.picture,
        provider: user.provider,
      },
      token,
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { 
        error: 'Google authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 401 }
    );
  }
} 