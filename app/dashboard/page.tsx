import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { HomeClient } from "@/components/HomeClient";
import { toMisiItem, type PencairanAktif } from "@/lib/dashboard-types";

export const metadata = {
  title: "Dashboard — Rebahancuan",
};

export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect("/login");
  }

  const [misiAktifDb, progressDb, pencairanAktifDb] = await Promise.all([
    prisma.misi.findMany({ where: { aktif: true }, orderBy: { id: "asc" } }),
    prisma.progressMisi.findMany({ where: { user_id: userId } }),
    prisma.pencairanRequest.findFirst({
      where: { user_id: userId, status: { in: ["diminta", "disetujui"] } },
      orderBy: { tanggal_diminta: "desc" },
    }),
  ]);

  const pencairanAktif: PencairanAktif = pencairanAktifDb
    ? {
        jumlah: pencairanAktifDb.jumlah,
        status: pencairanAktifDb.status as "diminta" | "disetujui",
      }
    : null;

  const progressByMisiId = new Map(progressDb.map((p) => [p.misi_id, p]));
  const misiList = misiAktifDb.map((misi) => toMisiItem(misi, progressByMisiId.get(misi.id)));

  return (
    <HomeClient
      nama={user.nama}
      saldoAwal={user.saldo_reward}
      misiAwal={misiList}
      pencairanAktif={pencairanAktif}
    />
  );
}
