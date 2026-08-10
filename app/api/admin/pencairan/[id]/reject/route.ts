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
    include: { user: { select: { nama: true, no_wa: true } } },
  });
  if (!req) {
    return NextResponse.json({ error: "Pengajuan tidak ditemukan." }, { status: 404 });
  }
  if (req.status !== "diminta") {
    return NextResponse.json(
      { error: "Pengajuan ini sudah diproses sebelumnya." },
      { status: 409 },
    );
  }

  await prisma.pencairanRequest.update({
    where: { id },
    data: { status: "ditolak", tanggal_diproses: new Date() },
  });

  await catatLogAdmin(
    "reject_pencairan",
    `Tolak pencairan: ${req.user.nama} (${req.user.no_wa}), Rp${req.jumlah.toLocaleString("id-ID")}`,
  );

  return NextResponse.json({ ok: true });
}
