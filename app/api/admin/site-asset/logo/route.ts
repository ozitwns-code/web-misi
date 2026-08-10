import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/admin-auth";
import { catatLogAdmin } from "@/lib/admin-log";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_SIZE = 2 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Bukan admin." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File logo wajib diisi." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format file harus PNG, JPEG, WebP, atau SVG." },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Ukuran file maksimal 2MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  await prisma.siteAsset.upsert({
    where: { key: "logo" },
    create: { key: "logo", mime_type: file.type, data: buffer },
    update: { mime_type: file.type, data: buffer },
  });

  await catatLogAdmin("update_logo", "Ganti logo/branding web.");

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Bukan admin." }, { status: 401 });
  }

  await prisma.siteAsset.deleteMany({ where: { key: "logo" } });
  await catatLogAdmin("reset_logo", "Kembalikan logo web ke default.");

  return NextResponse.json({ ok: true });
}
