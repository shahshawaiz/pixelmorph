import { NextRequest, NextResponse } from 'next/server';

const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export function middleware(req: NextRequest) {
  const protectedRoutes = ['/'];

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const [authType, authValue] = basicAuth.split(' ');

      if (authType === 'Basic') {
        const credentials = Buffer.from(authValue, 'base64').toString();
        const [reqUsername, reqPassword] = credentials.split(':');

        if (reqUsername === username && reqPassword === password) {
          return NextResponse.next(); // Allow access
        }
      }
    }

    // Unauthorized: Prompt for credentials
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  // Allow other routes without authentication
  return NextResponse.next();
}
