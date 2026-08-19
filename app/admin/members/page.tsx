import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHeader } from "@/components/AdminHeader";
import { AdminMembersClient, type MemberAdmin } from "@/components/AdminMembersClient";

export const metadata = {
  title: "Data Member — Admin Rebahancuan",
};

export default async function AdminMembersPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const [usersDb, referralCounts] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        no_wa: true,
        tanggal_daftar: true,
        saldo_reward: true,
        referrer: { select: { nama: true } },
      },
      orderBy: { tanggal_daftar: "desc" },
    }),
    prisma.user.groupBy({
      by: ["direferensikan_oleh"],
      where: { direferensikan_oleh: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const jumlahDireferralkanMap = new Map(
    referralCounts.map((r) => [r.direferensikan_oleh, r._count._all]),
  );

  const members: MemberAdmin[] = usersDb.map((u) => ({
    id: u.id,
    nama: u.nama,
    noWa: u.no_wa,
    tanggalDaftar: u.tanggal_daftar.toISOString(),
    direferensikanOlehNama: u.referrer?.nama ?? null,
    jumlahDireferralkan: jumlahDireferralkanMap.get(u.id) ?? 0,
    saldoReward: u.saldo_reward,
  }));

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <AdminMembersClient membersAwal={members} />
      </main>
    </>
  );
}
