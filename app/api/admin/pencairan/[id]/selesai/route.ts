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

  const req = await prisma.pencairanRequest.findUnique({
    where: { id },
    include: { user: { select: { nama: true, no_wa: true, saldo_reward: true } } },
  });
  if (!req) {
    return NextResponse.json({ error: "Pengajuan tidak ditemukan." }, { status: 404 });
  }
  if (req.status !== "disetujui") {
    return NextResponse.json(
      { error: "Pengajuan ini belum disetujui, atau sudah selesai." },
      { status: 409 },
    );
  }

  await prisma.$transaction([
    prisma.pencairanRequest.update({
      where: { id },
      data: { status: "selesai", tanggal_selesai: new Date() },
    }),
    prisma.user.update({
      where: { id: req.user_id },
      data: { saldo_reward: { decrement: req.jumlah } },
    }),
  ]);

  await catatLogAdmin(
    "selesai_pencairan",
    `Tandai pencairan selesai: ${req.user.nama} (${req.user.no_wa}), Rp${req.jumlah.toLocaleString("id-ID")} sudah ditransfer manual`,
  );

  return NextResponse.json({ ok: true });
}
