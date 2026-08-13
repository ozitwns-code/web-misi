import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/admin-auth";
import { catatLogAdmin } from "@/lib/admin-log";
import { validateMisiInput } from "@/lib/misi-admin-validate";

export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Bukan admin." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const hasil = validateMisiInput((body ?? {}) as Record<string, unknown>);
  if ("error" in hasil) {
    return NextResponse.json({ error: hasil.error }, { status: 400 });
  }

  const misi = await prisma.misi.create({ data: hasil.data });

  await catatLogAdmin("tambah_misi", `Tambah misi baru: "${misi.judul}" (${misi.tipe})`);

  return NextResponse.json({ ok: true, misi });
}
