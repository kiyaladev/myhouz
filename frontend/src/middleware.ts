import { NextResponse } from 'next/server';

export function middleware() {
  // Authentication is handled client-side via AuthContext and localStorage.
  // Protected pages redirect to /auth/login in their component code when
  // the user is not authenticated. This middleware is a placeholder for
  // future server-side auth (e.g. cookie-based sessions).
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/messages/:path*', '/dashboard/:path*'],
};
