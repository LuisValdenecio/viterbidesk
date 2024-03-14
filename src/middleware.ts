export { default } from 'next-auth/middleware';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('next-auth.session-token')?.value;

  // get the params object from the request

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/login')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard/', request.url));
    }
  }
}
