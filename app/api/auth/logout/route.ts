import { NextResponse } from 'next/server';

// /api/auth/logout
// const response = await fetch('/api/auth/logout', {
//   method: 'POST',
//   headers: {
//     'Authorization': `Bearer ${your_jwt_token}`,
//   },
// });
// const data = await response.json();
// console.log(data);

export async function POST() {
  try {
    const res = NextResponse.json({ message: 'Logout successful' });
    res.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: -1,
    });

    return res;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}