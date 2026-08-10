import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { isAdminSession } from "@/lib/admin-auth";
import { SiteLogo } from "@/components/SiteLogo";
import { LogoutButton } from "@/components/LogoutButton";
import {
  AdminDashboardClient,
  type PencairanItem,
  type PendingReferral,
} from "@/components/AdminDashboardClient";
import { AdminMisiSection, type MisiAdmin } from "@/components/AdminMisiSection";
import { AdminContentSection } from "@/components/AdminContentSection";
import { AdminLogoSection } from "@/components/AdminLogoSection";
import { AdminStatsSection, type AdminStats } from "@/components/AdminStatsSection";
import { buildContentMap } from "@/lib/site-content";

export const metadata = {
  title: "Admin — Rebahancuan",
};

export default async function AdminPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const [
    referralLogs,
    pencairanDb,
    adminLogs,
    misiDb,
    siteContentDb,
    totalUser,
    userSelesaiMisiRows,
    totalMisiSelesai,
    saldoTertahanAgg,
    saldoDicairkanAgg,
  ] = await Promise.all([
    prisma.referralLog.findMany({
      where: { status: "pending_review" },
      orderBy: { created_at: "asc" },
      include: {
        pengundang: { select: { nama: true, no_wa: true } },
        user_baru: { select: { nama: true, no_wa: true, ip_daftar: true } },
      },
    }),
    prisma.pencairanRequest.findMany({
      where: { status: { in: ["diminta", "disetujui"] } },
      orderBy: { tanggal_diminta: "asc" },
      include: { user: { select: { nama: true, no_wa: true } } },
    }),
    prisma.adminLog.findMany({ orderBy: { created_at: "desc" }, take: 50 }),
    prisma.misi.findMany({ orderBy: { id: "asc" } }),
    prisma.siteContent.findMany(),
    prisma.user.count(),
    prisma.progressMisi.findMany({
      where: { status: "selesai" },
      select: { user_id: true },
      distinct: ["user_id"],
    }),
    prisma.progressMisi.count({ where: { status: "selesai" } }),
    prisma.user.aggregate({ _sum: { saldo_reward: true } }),
    prisma.pencairanRequest.aggregate({
      where: { status: "selesai" },
      _sum: { jumlah: true },
    }),
  ]);

  const contentMap = buildContentMap(siteContentDb);

  const stats: AdminStats = {
    totalUser,
    totalUserAktifMisi: userSelesaiMisiRows.length,
    totalMisiSelesai,
    totalSaldoTertahan: saldoTertahanAgg._sum.saldo_reward ?? 0,
    totalSaldoDicairkan: saldoDicairkanAgg._sum.jumlah ?? 0,
  };

  const misiList: MisiAdmin[] = misiDb.map((m) => ({
    id: m.id,
    judul: m.judul,
    deskripsi: m.deskripsi,
    nominal_reward: m.nominal_reward,
    target_url: m.target_url,
    aktif: m.aktif,
    tipe: m.tipe,
  }));

  const pendingReferrals: PendingReferral[] = referralLogs.map((log) => ({
    id: log.id,
    pengundangNama: log.pengundang.nama,
    pengundangNoWa: log.pengundang.no_wa,
    userBaruNama: log.user_baru.nama,
    userBaruNoWa: log.user_baru.no_wa,
    userBaruIp: log.user_baru.ip_daftar,
    nominalDidapat: log.nominal_didapat,
    createdAt: log.created_at.toISOString(),
  }));

  const pencairan: PencairanItem[] = pencairanDb.map((p) => ({
    id: p.id,
    nama: p.user.nama,
    noWa: p.user.no_wa,
    jumlah: p.jumlah,
    status: p.status as "diminta" | "disetujui",
    tanggalDiminta: p.tanggal_diminta.toISOString(),
    metodePencairan: p.metode_pencairan as "bank" | "e_wallet",
    namaPenyedia: p.nama_penyedia,
    nomorTujuan: p.nomor_tujuan,
    namaPemilik: p.nama_pemilik,
  }));

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
              <SiteLogo className="h-4 w-4 object-cover" />
            </span>
            <span className="text-[0.95rem] font-bold tracking-tight text-ink">
              Rebahancuan <span className="font-medium text-ink-soft">admin</span>
            </span>
          </Link>
          <LogoutButton endpoint="/api/admin/logout" redirectTo="/admin/login" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <AdminStatsSection stats={stats} />

        <div className="mt-10">
          <AdminDashboardClient
            pendingReferralsAwal={pendingReferrals}
            pencairanAwal={pencairan}
          />
        </div>

        <AdminMisiSection misiListAwal={misiList} />

        <AdminLogoSection />

        <AdminContentSection contentAwal={contentMap} />

        <section className="mt-10">
          <h2 className="text-lg font-extrabold text-ink">Log aktivitas</h2>
          <div className="mt-3 rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
            {adminLogs.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink-soft">
                Belum ada aksi admin yang tercatat.
              </p>
            ) : (
              <ul className="divide-y divide-ink/[0.08]">
                {adminLogs.map((entry) => (
                  <li key={entry.id} className="px-5 py-3.5 text-sm">
                    <p className="text-ink">{entry.keterangan}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {entry.created_at.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
