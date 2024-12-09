import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// deal with the request
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // verify the JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ valid: true, decoded });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}