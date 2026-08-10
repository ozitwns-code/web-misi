import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/admin-auth";
import { catatLogAdmin } from "@/lib/admin-log";
import { CONTENT_DEFAULTS } from "@/lib/site-content";

export async function PATCH(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Bukan admin." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const { updates } = (body ?? {}) as Record<string, unknown>;
  if (typeof updates !== "object" || updates === null || Array.isArray(updates)) {
    return NextResponse.json({ error: "Data perubahan tidak valid." }, { status: 400 });
  }

  const entries = Object.entries(updates as Record<string, unknown>).filter(
    ([key, value]) => key in CONTENT_DEFAULTS && typeof value === "string",
  ) as [string, string][];

  if (entries.length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan yang valid." }, { status: 400 });
  }

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      }),
    ),
  );

  await catatLogAdmin(
    "update_content",
    `Update konten landing page: ${entries.length} field diubah (${entries
      .map(([key]) => key)
      .join(", ")}).`,
  );

  return NextResponse.json({ ok: true });
}
