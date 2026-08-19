import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/admin-auth";
import { catatLogAdmin } from "@/lib/admin-log";
import { validateMisiInput } from "@/lib/misi-admin-validate";

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

  const hasil = validateMisiInput((body ?? {}) as Record<string, unknown>);
  if ("error" in hasil) {
    return NextResponse.json({ error: hasil.error }, { status: 400 });
  }
  const data = hasil.data;

  const perubahan: string[] = [];
  if (misi.judul !== data.judul) perubahan.push(`judul: "${misi.judul}" → "${data.judul}"`);
  if (misi.deskripsi !== data.deskripsi) perubahan.push("deskripsi diubah");
  if (misi.nominal_reward !== data.nominal_reward)
    perubahan.push(
      `nominal: Rp${misi.nominal_reward.toLocaleString("id-ID")} → Rp${data.nominal_reward.toLocaleString("id-ID")}`,
    );
  if (misi.tipe !== data.tipe) perubahan.push(`tipe: ${misi.tipe} → ${data.tipe}`);
  if (misi.target_url !== data.target_url)
    perubahan.push(`link: ${misi.target_url ?? "(kosong)"} → ${data.target_url ?? "(kosong)"}`);
  if (misi.perlu_survei !== data.perlu_survei)
    perubahan.push(`survei: ${misi.perlu_survei ? "ya" : "tidak"} → ${data.perlu_survei ? "ya" : "tidak"}`);
  if (misi.kuota_harian !== data.kuota_harian)
    perubahan.push(`kuota harian: ${misi.kuota_harian ?? "tanpa batas"} → ${data.kuota_harian ?? "tanpa batas"}`);
  if (misi.aktif !== data.aktif) perubahan.push(`status: ${misi.aktif ? "aktif" : "nonaktif"} → ${data.aktif ? "aktif" : "nonaktif"}`);
  if (misi.cta_label !== data.cta_label)
    perubahan.push(`tombol: ${misi.cta_label ?? "Kerjakan"} → ${data.cta_label ?? "Kerjakan"}`);

  const updated = await prisma.misi.update({
    where: { id },
    data,
  });

  if (perubahan.length > 0) {
    await catatLogAdmin(
      "edit_misi",
      `Edit misi "${updated.judul}": ${perubahan.join("; ")}`,
    );
  }

  return NextResponse.json({ ok: true, misi: updated });
}
