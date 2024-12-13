// pages/api/auth/current-user
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const handleError = (message: string, status = 500) => {
  return NextResponse.json({ error: message }, { status });
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return handleError('Not authenticated', 401);
    }

    // verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json(decoded); // Return the decoded JWT payload (user info)
  } catch (error: unknown) {
    console.error(error);
    return handleError('Invalid or expired token', 401);
  }
}