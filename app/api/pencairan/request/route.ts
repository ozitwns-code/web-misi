import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { MINIMAL_PENCAIRAN } from "@/lib/reward-constants";

export async function POST(request: NextRequest) {
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

  const { jumlah } = (body ?? {}) as Record<string, unknown>;
  if (typeof jumlah !== "number" || !Number.isInteger(jumlah)) {
    return NextResponse.json({ error: "Jumlah pencairan tidak valid." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
  }

  if (user.saldo_reward < MINIMAL_PENCAIRAN) {
    return NextResponse.json(
      {
        error: `Saldo kamu belum mencapai minimal pencairan (Rp${MINIMAL_PENCAIRAN.toLocaleString("id-ID")}).`,
      },
      { status: 400 },
    );
  }

  if (jumlah < MINIMAL_PENCAIRAN) {
    return NextResponse.json(
      { error: `Minimal pencairan Rp${MINIMAL_PENCAIRAN.toLocaleString("id-ID")} per pengajuan.` },
      { status: 400 },
    );
  }

  if (jumlah > user.saldo_reward) {
    return NextResponse.json(
      { error: "Jumlah pencairan lebih besar dari saldo kamu." },
      { status: 400 },
    );
  }

  const activeRequest = await prisma.pencairanRequest.findFirst({
    where: { user_id: userId, status: { in: ["diminta", "disetujui"] } },
  });
  if (activeRequest) {
    return NextResponse.json(
      { error: "Kamu masih punya pengajuan pencairan yang sedang diproses." },
      { status: 409 },
    );
  }

  const created = await prisma.pencairanRequest.create({
    data: { user_id: userId, jumlah },
  });

  return NextResponse.json({ ok: true, request: created });
}
