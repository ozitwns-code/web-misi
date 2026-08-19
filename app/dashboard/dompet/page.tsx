import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { DompetClient, type PayoutInfo } from "@/components/DompetClient";
import type { PencairanAktif } from "@/lib/dashboard-types";

export const metadata = {
  title: "Dompet — Rebahancuan",
};

export default async function DompetPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect("/api/auth/session-invalid");
  }

  const [progressSelesai, pencairanAktifDb, pencairanHistoryDb] = await Promise.all([
    prisma.progressMisi.findMany({
      where: { user_id: userId, status: "selesai" },
      include: { misi: { select: { judul: true, nominal_reward: true } } },
      orderBy: { tanggal_selesai: "desc" },
    }),
    prisma.pencairanRequest.findFirst({
      where: { user_id: userId, status: { in: ["diminta", "disetujui"] } },
      orderBy: { tanggal_diminta: "desc" },
    }),
    prisma.pencairanRequest.findMany({
      where: { user_id: userId },
      orderBy: { tanggal_diminta: "desc" },
    }),
  ]);

  const pencairanAktif: PencairanAktif = pencairanAktifDb
    ? {
        jumlah: pencairanAktifDb.jumlah,
        status: pencairanAktifDb.status as "diminta" | "disetujui",
      }
    : null;

  const payoutInfo: PayoutInfo =
    user.metode_pencairan && user.nama_penyedia && user.nomor_tujuan && user.nama_pemilik
      ? {
          metode_pencairan: user.metode_pencairan as "bank" | "e_wallet",
          nama_penyedia: user.nama_penyedia,
          nomor_tujuan: user.nomor_tujuan,
          nama_pemilik: user.nama_pemilik,
        }
      : null;

  const riwayatMisi = progressSelesai
    .filter((p) => p.tanggal_selesai)
    .map((p) => ({
      judul: p.misi.judul,
      nominal_reward: p.misi.nominal_reward,
      tanggal_selesai: p.tanggal_selesai!.toISOString(),
    }));

  const riwayatPencairan = pencairanHistoryDb.map((p) => ({
    id: p.id,
    jumlah: p.jumlah,
    status: p.status as "diminta" | "disetujui" | "selesai" | "ditolak",
    tanggalDiminta: p.tanggal_diminta.toISOString(),
  }));

  return (
    <DompetClient
      saldoAwal={user.saldo_reward}
      payoutInfoAwal={payoutInfo}
      pencairanAktifAwal={pencairanAktif}
      riwayatMisi={riwayatMisi}
      riwayatPencairanAwal={riwayatPencairan}
    />
  );
}
