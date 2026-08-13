import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { MisiListClient } from "@/components/MisiListClient";
import { toMisiItem } from "@/lib/dashboard-types";
import { buildKuotaPenuhMap } from "@/lib/misi-constants";

export const metadata = {
  title: "Misi — Rebahancuan",
};

export default async function MisiPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const [misiDb, progressDb] = await Promise.all([
    prisma.misi.findMany({ where: { aktif: true }, orderBy: { id: "asc" } }),
    prisma.progressMisi.findMany({ where: { user_id: userId } }),
  ]);

  const progressByMisiId = new Map(progressDb.map((p) => [p.misi_id, p]));
  const kuotaPenuhMap = await buildKuotaPenuhMap(misiDb);
  const misiList = misiDb.map((misi) =>
    toMisiItem(misi, progressByMisiId.get(misi.id), kuotaPenuhMap.get(misi.id) ?? false),
  );

  return <MisiListClient misiAwal={misiList} />;
}
