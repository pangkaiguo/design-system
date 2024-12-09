import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const isLoginPage = req.nextUrl.pathname === '/login';
  const isRegisterPage = req.nextUrl.pathname === '/register';
  const adminPageRedirect = new URL('/admin', req.url);
  const loginPageRedirect = new URL('/login', req.url);

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const response = NextResponse.next(); // Create a default response

  // Add custom header for login and register pages
  if (isLoginPage || isRegisterPage) {
    response.headers.set('x-auth-page', 'true');
    return response;
  }


  if (!token) {
    if (!isLoginPage && !isRegisterPage) {
      return NextResponse.redirect(loginPageRedirect);
    }
    return response;
  }

  // If token exists, verify it with the server
  return fetch(`${req.nextUrl.origin}/api/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Invalid token');

      // Token verification passed
      if (isLoginPage) {
        // If user is already logged in and access /login, redirect to /admin
        return NextResponse.redirect(adminPageRedirect);
      }
      return response; // Allow access to other pages
    })
    .catch((err) => {
      console.error('JWT verification failed in middleware:', err);

      // Token verification failed, clear cookie and redirect to /login
      const failedResponse = NextResponse.redirect(loginPageRedirect);
      failedResponse.cookies.delete('token');
      return failedResponse;
    });
}

// Define protected paths
export const config = {
  matcher: ['/admin/:path*', '/'],
};