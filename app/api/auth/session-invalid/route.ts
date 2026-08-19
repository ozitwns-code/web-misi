import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

/**
 * Dipanggil server component dashboard saat sesi JWT valid tapi user-nya
 * sudah nggak ada di database (misal dihapus). Hapus cookie sesi di sini
 * (server component nggak boleh ubah cookie langsung) supaya nggak jadi
 * redirect loop /login <-> /dashboard.
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
