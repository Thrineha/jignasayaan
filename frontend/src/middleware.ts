import { NextResponse, type NextRequest } from "next/server";

// Edge-level check: redirect to login if the session cookie is simply
// absent, so protected pages never even start rendering for an
// unauthenticated visitor. This is NOT the security boundary -- it only
// checks presence, not validity. The real check is the backend verifying
// the JWT signature/expiry on every request (see backend/src/middleware/auth.ts).
// Never trust this middleware alone to gate sensitive data.
export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const hasSession = request.cookies.has("jignasayaan_session");

  if (!isLoginPage && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
