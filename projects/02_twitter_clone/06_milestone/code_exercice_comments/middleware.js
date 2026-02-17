import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Get the JWT token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if accessing protected routes
  const isProtectedPage = pathname.startsWith("/favorites");
  const isProtectedAPI = pathname.startsWith("/api/favorites");

  // If accessing protected route without token, redirect/reject
  if ((isProtectedPage || isProtectedAPI) && !token) {
    if (isProtectedAPI) {
      // For API routes, return 401 Unauthorized
      return NextResponse.json(
        { error: "Unauthorized - Please login to access this resource" },
        { status: 401 }
      );
    }

    // For pages, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/favorites/:path*",
    "/api/favorites/:path*",
  ],
};
