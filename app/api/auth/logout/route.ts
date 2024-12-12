import { NextRequest, NextResponse } from 'next/server';

// /api/auth/logout
// const response = await fetch('/api/auth/logout', {
//   method: 'POST',
//   headers: {
//     'Authorization': `Bearer ${your_jwt_token}`,
//   },
// });
// const data = await response.json();
// console.log(data);

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({ message: 'Logout successful' });
    res.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: -1,
    });

    return res;
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
