import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// /api/auth/register
// Method: POST
// Content-Type: application/json
// {
//   "email": "user@example.com",
//   "username": "your_username",
//   "password": "your_password",
// }

const prisma = new PrismaClient();

async function parseRequestBody(req: NextRequest) {
  const contentType = req.headers.get('Content-Type');
  if (contentType === 'application/json') {
    try {
      return await req.json();
    } catch {
      throw new Error('Invalid JSON format');
    }
  }
  if (contentType === 'application/x-www-form-urlencoded') {
    const formData = await req.formData();
    return Object.fromEntries(formData.entries());
  }
  throw new Error(`Unsupported Content-Type: ${contentType}`);
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseRequestBody(req);
    const { email, username, password, gender = 'UNSPECIFIED' } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }
    if (!['MALE', 'FEMALE', 'UNSPECIFIED'].includes(gender)) {
      return NextResponse.json(
        { error: 'Invalid gender value' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        username,
        password: hashedPassword,
        gender,
      },
    });

    return NextResponse.json({ message: 'User registered successfully', user });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
