import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  const token = jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  );
  return token;
}

export function verifyToken(token: string): any {
  try {
    console.log('🔍 verifyToken: Attempting to verify token');
    console.log('🔍 verifyToken: JWT_SECRET exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    console.log('🔍 verifyToken: Token verification successful:', !!decoded);
    return decoded;
  } catch (error) {
    console.log('❌ verifyToken: Token verification failed:', error);
    return null;
  }
}

export async function authenticateUser(req: NextRequest): Promise<{ user: User | null; error?: string }> {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    console.log('🔍 Debug: Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('❌ Debug: No token provided');
      return { user: null, error: 'No token provided' };
    }

    const decoded = verifyToken(token);
    console.log('🔍 Debug: Decoded token:', decoded);
    
    if (!decoded) {
      console.log('❌ Debug: Invalid token');
      return { user: null, error: 'Invalid token' };
    }

    console.log('🔍 Debug: Looking for user with ID:', decoded.userId);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    console.log('🔍 Debug: User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('🔍 Debug: User details:', { id: user.id, email: user.email, role: user.role });
    }

    if (!user) {
      console.log('❌ Debug: User not found in database');
      return { user: null, error: 'User not found' };
    }

    console.log('✅ Debug: Authentication successful');
    return { user };
  } catch (error) {
    console.log('❌ Debug: Authentication failed with error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const { user, error } = await authenticateUser(req);
    
    if (error || !user) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return handler(req, user);
  };
} 