import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { isJawabanValid, parseSurveiPertanyaan } from "@/lib/misi-constants";

export async function POST(
  request: NextRequest,
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
  if (!misi.perlu_survei) {
    return NextResponse.json(
      { error: "Misi ini nggak pakai survei." },
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const pertanyaan = parseSurveiPertanyaan(misi.survei_pertanyaan);
  const { jawaban } = (body ?? {}) as Record<string, unknown>;

  if (!isJawabanValid(pertanyaan, jawaban)) {
    return NextResponse.json(
      { error: "Jawab semua pertanyaan dulu ya." },
      { status: 400 },
    );
  }

  await prisma.progressMisi.upsert({
    where: { user_id_misi_id: { user_id: userId, misi_id: misiId } },
    create: {
      user_id: userId,
      misi_id: misiId,
      status: "survei_selesai",
      jawaban_survei: JSON.stringify(jawaban),
    },
    update: {
      status: "survei_selesai",
      jawaban_survei: JSON.stringify(jawaban),
    },
  });

  return NextResponse.json({ ok: true });
}
