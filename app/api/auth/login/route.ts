import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// error handler
const handleError = (message: string, status = 500) => {
  return NextResponse.json({ error: message }, { status });
};

// common function to parse Request
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

// login
export async function POST(req: NextRequest) {
  try {
    const body = await parseRequestBody(req);
    const { email, password } = body;

    if (!email || !password) {
      return handleError('Email and password are required', 400);
    }

    // query user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return handleError('Invalid email or password', 401);
    }

    // verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return handleError('Invalid email or password', 401);
    }

    // create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' } // token expires in 1 hour
    );

    // set HttpOnly Cookie
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600, // token expires in 1 hour
    });

    return response;
  } catch (error: any) {
    console.error(error.message);
    return handleError(error.message, 500);
  }
}