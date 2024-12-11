import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// http://localhost:3000/api/auth/register
// Method: POST
// Content-Type: application/json
// {
//   "email": "user@example.com",
//   "password": "your_password",
//   "role": "user"
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
    const { email, password, role = 'user' } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ message: 'User registered successfully', user });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
