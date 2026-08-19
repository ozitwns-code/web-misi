import { NextRequest, NextResponse } from "next/server";

/** Format link referral pendek: rebahancuan.com/ref/KODE -> /daftar?ref=KODE */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kode: string }> },
) {
  const { kode } = await params;
  return NextResponse.redirect(new URL(`/daftar?ref=${encodeURIComponent(kode)}`, request.url));
}
