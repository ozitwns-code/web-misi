import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sessionCookieOptions, signSessionToken, verifyPassword, SESSION_COOKIE } from "@/lib/auth";
import { normalizeNoWa } from "@/lib/validate";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const { no_wa, password } = (body ?? {}) as Record<string, unknown>;

  if (typeof no_wa !== "string" || typeof password !== "string" || !no_wa || !password) {
    return NextResponse.json({ error: "Nomor WA dan password wajib diisi." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { no_wa: normalizeNoWa(no_wa) },
  });

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: "Nomor WA atau password salah." }, { status: 401 });
  }

  const token = await signSessionToken(user.id);
  const response = NextResponse.json({ id: user.id, nama: user.nama });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
