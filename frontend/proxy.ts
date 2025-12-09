import { NextResponse, NextRequest } from "next/server";
import {getToken} from "@/lib/cookies";

export async function proxy(req: NextRequest) {
  const token = await getToken();

  const guestOnly = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isGuestOnly = guestOnly.some(path => req.nextUrl.pathname.startsWith(path));

  if (token) {
    if (isGuestOnly) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    if (req.nextUrl.pathname !== "/" && !req.nextUrl.pathname.startsWith("/blog") && !isGuestOnly) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|pub|profile-picture.png$).*)'
  ]
};

