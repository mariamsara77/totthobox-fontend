// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/account',
  '/messages',
];

const GUEST_ONLY_ROUTES = [
  '/login',
  '/register',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cookie থেকে token চেক (auth_token বা laravel_token)
  const token =
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('laravel_token')?.value;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isGuestOnly = GUEST_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Protected route — token না থাকলে login-এ পাঠাবে
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Guest-only route — token থাকলে dashboard-এ পাঠাবে
  if (isGuestOnly && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)',
  ],
};