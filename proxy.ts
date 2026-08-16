import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/session-constants";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-session-constants";

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

async function hasValidAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

const REF_COOKIE = "ref_code";
const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const refCode = searchParams.get("ref")?.trim();

  function withRefCookie(response: NextResponse) {
    if (refCode) {
      response.cookies.set(REF_COOKIE, refCode, {
        path: "/",
        maxAge: REF_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }
    return response;
  }

  if (pathname.startsWith("/admin")) {
    const adminLoggedIn = await hasValidAdminSession(request);
    if (pathname === "/admin/login") {
      if (adminLoggedIn) {
        return withRefCookie(NextResponse.redirect(new URL("/admin", request.url)));
      }
      return withRefCookie(NextResponse.next());
    }
    if (!adminLoggedIn) {
      return withRefCookie(NextResponse.redirect(new URL("/admin/login", request.url)));
    }
    return withRefCookie(NextResponse.next());
  }

  const loggedIn = await hasValidSession(request);

  if (pathname.startsWith("/dashboard") && !loggedIn) {
    const loginUrl = new URL("/login", request.url);
    return withRefCookie(NextResponse.redirect(loginUrl));
  }

  if ((pathname === "/login" || pathname === "/daftar") && loggedIn) {
    return withRefCookie(NextResponse.redirect(new URL("/dashboard", request.url)));
  }

  return withRefCookie(NextResponse.next());
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/daftar", "/admin/:path*"],
};
