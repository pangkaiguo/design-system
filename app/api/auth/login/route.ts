import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Helper function to handle errors
const handleError = (message: string, status = 500) => {
  return NextResponse.json({ error: message }, { status });
};

// Common function to parse request body
async function parseRequestBody(req: NextRequest) {
  const contentType = req.headers.get('Content-Type');
  if (contentType === 'application/json') {
    try {
      return await req.json();
    } catch {
      throw new Error('Invalid JSON format');
    }
  }
  throw new Error(`Unsupported Content-Type: ${contentType}`);
}

// Login handler
export async function POST(req: NextRequest) {
  try {
    const body = await parseRequestBody(req);
    const { email, password } = body;

    if (!email || !password) {
      return handleError('Email/Username and password are required', 400);
    }

    // Find user by email or username
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email },
        ],
      },
    });

    if (!user) {
      return handleError('Invalid email/username or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return handleError('Invalid email/username or password', 401);
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set HttpOnly cookie with JWT token
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600, // 1 hour
    });

    return response;
  } catch (error: any) {
    console.error(error.message);
    return handleError(error.message, 500);
  }
}