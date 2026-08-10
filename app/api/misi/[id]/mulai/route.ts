import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

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
  if (!misi.target_url) {
    return NextResponse.json(
      { error: "Misi ini nggak pakai alur buka-link." },
      { status: 400 },
    );
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
  if (misi.perlu_survei && existing?.status !== "survei_selesai") {
    return NextResponse.json(
      { error: "Isi survei-nya dulu ya." },
      { status: 400 },
    );
  }

  const tanggal_mulai = new Date();
  await prisma.progressMisi.upsert({
    where: { user_id_misi_id: { user_id: userId, misi_id: misiId } },
    create: {
      user_id: userId,
      misi_id: misiId,
      status: "menunggu",
      tanggal_mulai,
    },
    update: {
      status: "menunggu",
      tanggal_mulai,
    },
  });

  return NextResponse.json({ ok: true, target_url: misi.target_url });
}
