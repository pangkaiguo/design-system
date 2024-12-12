import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

interface UserPayload {
  id?: string;
  email: string;
  password?: string;
  role: string;
  username?: string;
  gender?: string;
}

// Middleware to check if the user is admin
async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('token');
  if (!token) return false;
  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as { role: string };
    return decoded.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        username: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// Create or Update a user (Admin only)
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id, email, password, role, username, gender } = (await req.json()) as UserPayload;

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    if (id) {
      // Update existing user
      const existingUser = await prisma.users.findUnique({ where: { id } });

      if (!existingUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const updatedUser = await prisma.users.update({
        where: { id },
        data: {
          email,
          role,
          username,
          gender,
          ...(password && { password: await bcrypt.hash(password, 10) }), // Hash password if provided
        },
      });

      return NextResponse.json(updatedUser, { status: 200 });
    } else {
      // Create a new user
      if (!password) {
        return NextResponse.json({ error: 'Password is required for new users' }, { status: 400 });
      }

      const existingUser = await prisma.users.findUnique({ where: { email } });

      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.users.create({
        data: { email, password: hashedPassword, role, username, gender },
      });

      return NextResponse.json(newUser, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating or updating user:', error);
    return NextResponse.json({ error: 'Failed to create or update user' }, { status: 500 });
  }
}