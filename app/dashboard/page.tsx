import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { CoffeeMark } from "@/components/icons";
import { LogoutButton } from "@/components/LogoutButton";
import { DashboardClient, type MisiItem, type PencairanAktif } from "@/components/DashboardClient";
import { parseSurveiPertanyaan } from "@/lib/misi-constants";

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

  const [misiAktifDb, progressDb, referralCount, pencairanAktifDb] = await Promise.all([
    prisma.misi.findMany({ where: { aktif: true }, orderBy: { id: "asc" } }),
    prisma.progressMisi.findMany({ where: { user_id: userId } }),
    prisma.referralLog.count({ where: { user_id_pengundang: userId } }),
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

  const misiList: MisiItem[] = misiAktifDb.map((misi) => {
    const progress = progressByMisiId.get(misi.id);
    const status: MisiItem["status"] =
      progress?.status === "selesai"
        ? "selesai"
        : progress?.status === "menunggu"
          ? "menunggu"
          : progress?.status === "survei_selesai"
            ? "survei_selesai"
            : "belum";
    return {
      id: misi.id,
      judul: misi.judul,
      deskripsi: misi.deskripsi,
      nominal_reward: misi.nominal_reward,
      tipe: misi.tipe,
      target_url: misi.target_url,
      perlu_survei: misi.perlu_survei,
      survei_pertanyaan: parseSurveiPertanyaan(misi.survei_pertanyaan),
      status,
      tanggal_mulai: progress?.tanggal_mulai?.toISOString() ?? null,
      tanggal_selesai: progress?.tanggal_selesai?.toISOString() ?? null,
    };
  });

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
              <CoffeeMark className="h-4 w-4" />
            </span>
            <span className="text-[0.95rem] font-bold tracking-tight text-ink">
              Rebahancuan
            </span>
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        <DashboardClient
          nama={user.nama}
          saldoAwal={user.saldo_reward}
          misiAwal={misiList}
          kodeReferral={user.kode_referral_sendiri}
          referralCountAwal={referralCount}
          pencairanAktifAwal={pencairanAktif}
        />
      </main>
    </>
  );
}
