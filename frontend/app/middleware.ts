import { NextRequest, NextResponse } from 'next/server';

const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export function middleware(req: NextRequest) {
  const protectedRoutes = ['/'];

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next(); // Allow access
  }

  // Allow other routes without authentication
  return NextResponse.next();
}
