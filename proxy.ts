import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_TOKEN_KEY = "raphacure_auth_token";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/profile"];

// Routes that should redirect to home if already authenticated
const AUTH_ROUTES: string[] = [];

// Public routes that don't need any checks
const PUBLIC_ROUTES = ["/", "/privacy-policy", "/terms"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Static files like .ico, .svg, etc.
  ) {
    return NextResponse.next();
  }

  // Get auth token from cookie
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const isAuthenticated = !!token;

  // Check if trying to access protected route without auth
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Check if trying to access auth routes while already authenticated
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
