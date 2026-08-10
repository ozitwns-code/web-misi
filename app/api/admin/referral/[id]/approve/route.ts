import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/admin-auth";
import { catatLogAdmin } from "@/lib/admin-log";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Bukan admin." }, { status: 401 });
  }

  const { id } = await params;

  const log = await prisma.referralLog.findUnique({
    where: { id },
    include: {
      pengundang: { select: { nama: true } },
      user_baru: { select: { nama: true } },
    },
  });
  if (!log) {
    return NextResponse.json({ error: "Referral tidak ditemukan." }, { status: 404 });
  }
  if (log.status !== "pending_review") {
    return NextResponse.json(
      { error: "Referral ini sudah diproses sebelumnya." },
      { status: 409 },
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.referralLog.update({
      where: { id },
      data: { status: "approved" },
    });

    await tx.user.update({
      where: { id: log.user_id_pengundang },
      data: { saldo_reward: { increment: log.nominal_didapat } },
    });
  });

  await catatLogAdmin(
    "approve_referral",
    `Setujui referral: ${log.pengundang.nama} mengundang ${log.user_baru.nama} (+Rp${log.nominal_didapat.toLocaleString("id-ID")})`,
  );

  return NextResponse.json({ ok: true });
}
