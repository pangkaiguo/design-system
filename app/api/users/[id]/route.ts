import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to check if the user is an admin
async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('token')?.value;
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    return decoded.role === 'ADMIN';
  } catch {
    return false;
  }
}

// GET: Fetch a single user by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        username: true,
        gender: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
// PUT: Update a user by ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { email, role, username, gender } = (await req.json()) as {
      email: string;
      role: string;
      username?: string;
      gender?: string;
    };

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const userExists = await prisma.users.findUnique({ where: { id } });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        email,
        role,
        username,
        gender,
      },
    });

    const token = jwt.sign(
      {
        id: updatedUser.id,
        role: updatedUser.role,
        email: updatedUser.email,
        username: updatedUser.username,
        gender: updatedUser.gender,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      username: updatedUser.username,
      gender: updatedUser.gender,
    });

    // Set the new JWT as a cookie in the response
    response.cookies.set('token', token, { httpOnly: true, path: '/' });

    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE: Delete user by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const userExists = await prisma.users.findUnique({ where: { id } });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.users.delete({ where: { id } });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}