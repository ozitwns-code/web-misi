import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

const METODE_VALID = ["bank", "e_wallet"];

export async function PATCH(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Kamu harus login dulu." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const { metode_pencairan, nama_penyedia, nomor_tujuan, nama_pemilik } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof metode_pencairan !== "string" || !METODE_VALID.includes(metode_pencairan)) {
    return NextResponse.json({ error: "Metode pencairan tidak valid." }, { status: 400 });
  }
  if (typeof nama_penyedia !== "string" || nama_penyedia.trim().length === 0) {
    return NextResponse.json(
      { error: "Nama bank/e-wallet wajib diisi." },
      { status: 400 },
    );
  }
  if (typeof nomor_tujuan !== "string" || nomor_tujuan.trim().length === 0) {
    return NextResponse.json(
      { error: "Nomor rekening/e-wallet tujuan wajib diisi." },
      { status: 400 },
    );
  }
  if (typeof nama_pemilik !== "string" || nama_pemilik.trim().length === 0) {
    return NextResponse.json(
      { error: "Nama pemilik rekening/e-wallet wajib diisi." },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      metode_pencairan,
      nama_penyedia: nama_penyedia.trim(),
      nomor_tujuan: nomor_tujuan.trim(),
      nama_pemilik: nama_pemilik.trim(),
    },
  });

  return NextResponse.json({ ok: true });
}
