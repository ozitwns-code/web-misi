import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/admin-auth";
import { catatLogAdmin } from "@/lib/admin-log";

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Bukan admin." }, { status: 401 });
  }

  const { id } = await params;

  const misi = await prisma.misi.findUnique({ where: { id } });
  if (!misi) {
    return NextResponse.json({ error: "Misi tidak ditemukan." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const { judul, deskripsi, nominal_reward, target_url, aktif } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof judul !== "string" || judul.trim().length < 2) {
    return NextResponse.json({ error: "Judul minimal 2 karakter." }, { status: 400 });
  }
  if (typeof deskripsi !== "string" || deskripsi.trim().length < 2) {
    return NextResponse.json({ error: "Deskripsi minimal 2 karakter." }, { status: 400 });
  }
  if (typeof nominal_reward !== "number" || !Number.isInteger(nominal_reward) || nominal_reward <= 0) {
    return NextResponse.json(
      { error: "Nominal reward harus angka bulat positif." },
      { status: 400 },
    );
  }
  if (typeof aktif !== "boolean") {
    return NextResponse.json({ error: "Status aktif tidak valid." }, { status: 400 });
  }

  let targetUrlNormalized: string | null = null;
  if (typeof target_url === "string" && target_url.trim().length > 0) {
    const trimmed = target_url.trim();
    if (!isValidUrl(trimmed)) {
      return NextResponse.json(
        { error: "Link tidak valid. Pakai URL lengkap (https://...)." },
        { status: 400 },
      );
    }
    targetUrlNormalized = trimmed;
  }

  const perubahan: string[] = [];
  if (misi.judul !== judul.trim()) perubahan.push(`judul: "${misi.judul}" → "${judul.trim()}"`);
  if (misi.deskripsi !== deskripsi.trim()) perubahan.push("deskripsi diubah");
  if (misi.nominal_reward !== nominal_reward)
    perubahan.push(`nominal: Rp${misi.nominal_reward.toLocaleString("id-ID")} → Rp${nominal_reward.toLocaleString("id-ID")}`);
  if (misi.target_url !== targetUrlNormalized)
    perubahan.push(`link: ${misi.target_url ?? "(kosong)"} → ${targetUrlNormalized ?? "(kosong)"}`);
  if (misi.aktif !== aktif) perubahan.push(`status: ${misi.aktif ? "aktif" : "nonaktif"} → ${aktif ? "aktif" : "nonaktif"}`);

  const updated = await prisma.misi.update({
    where: { id },
    data: {
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      nominal_reward,
      target_url: targetUrlNormalized,
      aktif,
    },
  });

  if (perubahan.length > 0) {
    await catatLogAdmin(
      "edit_misi",
      `Edit misi "${updated.judul}": ${perubahan.join("; ")}`,
    );
  }

  return NextResponse.json({ ok: true, misi: updated });
}
