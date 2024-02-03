export { default } from 'next-auth/middleware';
import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

/*
export function middleware(req : NextRequest) {
  console.log("request", req.nextUrl.pathname);
}
*/
export const config = {
  matcher: ['/dashboard/:path*', '/organizations/:path*'],
};
