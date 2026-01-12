import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an authenticated session
const protectedRoutes = ["/dashboard", "/gigs", "/my-bids", "/gigs/create"];
// Routes that should be inaccessible to logged-in users
const authRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 1. Handle Protected Routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    // Redirect to login but keep the original destination in query params
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Handle Auth Routes (Prevent logged-in users from hitting /login)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && token) {
    // If user is already logged in, send them to the dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Ensure middleware doesn't run on static assets or internal Next.js paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};