import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/admin-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Bukan admin." }, { status: 401 });
  }

  const { id } = await params;

  const member = await prisma.user.findUnique({ where: { id } });
  if (!member) {
    return NextResponse.json({ error: "Member tidak ditemukan." }, { status: 404 });
  }

  const [misiSelesai, direferralkan] = await Promise.all([
    prisma.progressMisi.findMany({
      where: { user_id: id, status: "selesai" },
      include: { misi: { select: { judul: true, nominal_reward: true } } },
      orderBy: { tanggal_selesai: "desc" },
    }),
    prisma.user.findMany({
      where: { direferensikan_oleh: id },
      select: { id: true, nama: true, no_wa: true, tanggal_daftar: true },
      orderBy: { tanggal_daftar: "desc" },
    }),
  ]);

  return NextResponse.json({
    riwayatMisi: misiSelesai
      .filter((p) => p.tanggal_selesai)
      .map((p) => ({
        judul: p.misi.judul,
        nominalReward: p.misi.nominal_reward,
        tanggalSelesai: p.tanggal_selesai!.toISOString(),
      })),
    direferralkan: direferralkan.map((u) => ({
      id: u.id,
      nama: u.nama,
      noWa: u.no_wa,
      tanggalDaftar: u.tanggal_daftar.toISOString(),
    })),
  });
}
