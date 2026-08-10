import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { MISI_MIN_DELAY_MS } from "@/lib/misi-constants";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Kamu harus login dulu." }, { status: 401 });
  }

  const { id: misiId } = await params;

  const misi = await prisma.misi.findUnique({ where: { id: misiId } });
  if (!misi || !misi.aktif) {
    return NextResponse.json({ error: "Misi tidak ditemukan." }, { status: 404 });
  }

  const existing = await prisma.progressMisi.findUnique({
    where: { user_id_misi_id: { user_id: userId, misi_id: misiId } },
  });

  if (existing?.status === "selesai") {
    return NextResponse.json(
      { error: "Misi ini sudah kamu selesaikan sebelumnya." },
      { status: 409 },
    );
  }

  if (misi.target_url) {
    if (existing?.status !== "menunggu" || !existing.tanggal_mulai) {
      return NextResponse.json(
        { error: "Klik \"Kerjakan\" dulu, buka link-nya, baru balik ke sini." },
        { status: 400 },
      );
    }
    const elapsed = Date.now() - existing.tanggal_mulai.getTime();
    if (elapsed < MISI_MIN_DELAY_MS) {
      return NextResponse.json(
        { error: "Belum cukup waktu sejak kamu buka link-nya. Coba lagi sebentar." },
        { status: 400 },
      );
    }
  }

  const user = await prisma.$transaction(async (tx) => {
    await tx.progressMisi.upsert({
      where: { user_id_misi_id: { user_id: userId, misi_id: misiId } },
      create: {
        user_id: userId,
        misi_id: misiId,
        status: "selesai",
        tanggal_selesai: new Date(),
      },
      update: {
        status: "selesai",
        tanggal_selesai: new Date(),
      },
    });

    return tx.user.update({
      where: { id: userId },
      data: { saldo_reward: { increment: misi.nominal_reward } },
      select: { saldo_reward: true },
    });
  });

  return NextResponse.json({ ok: true, saldo_reward: user.saldo_reward });
}
