"use client";

import { useState } from "react";
import Link from "next/link";
import { MissionRow } from "./MissionRow";
import { SurveyQuickCard } from "./SurveyQuickCard";
import { MINIMAL_PENCAIRAN } from "@/lib/reward-constants";
import type { MisiItem, PencairanAktif } from "@/lib/dashboard-types";

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

export function HomeClient({
  nama,
  saldoAwal,
  misiAwal,
  pencairanAktif,
}: {
  nama: string;
  saldoAwal: number;
  misiAwal: MisiItem[];
  pencairanAktif: PencairanAktif;
}) {
  const [saldo, setSaldo] = useState(saldoAwal);
  const [misiList, setMisiList] = useState(misiAwal);

  const bisaCairkan = saldo >= MINIMAL_PENCAIRAN;
  const misiAktif = misiList.filter((m) => m.status !== "selesai");
  const misiKartu = misiAktif.filter((m) => m.estimasi_menit !== null);
  const misiBiasa = misiAktif.filter((m) => m.estimasi_menit === null);

  function handleMisiSelesai(misiId: string, saldoReward: number) {
    setSaldo(saldoReward);
    setMisiList((prev) =>
      prev.map((m) =>
        m.id === misiId
          ? { ...m, status: "selesai", tanggal_selesai: new Date().toISOString() }
          : m,
      ),
    );
  }

  return (
    <div className="space-y-8">
      {/* SALDO HEADER */}
      <section className="rounded-2xl bg-teal px-6 py-6 text-paper shadow-[0_1px_0_rgba(15,79,68,0.4),0_14px_28px_-16px_rgba(15,79,68,0.7)]">
        <p className="text-sm text-teal-light/85">Halo, {nama} 👋</p>
        <p className="mt-1 text-3xl font-extrabold">{rupiah(saldo)}</p>

        {pencairanAktif ? (
          <p className="mt-4 rounded-xl bg-paper/15 px-4 py-2.5 text-sm font-semibold text-paper">
            {pencairanAktif.status === "disetujui" ? (
              <>Pencairan {rupiah(pencairanAktif.jumlah)} disetujui, sedang diproses transfer.</>
            ) : (
              <>Pengajuan pencairan {rupiah(pencairanAktif.jumlah)} terkirim — menunggu direview admin.</>
            )}
          </p>
        ) : bisaCairkan ? (
          <Link
            href="/dashboard/dompet"
            className="mt-4 inline-block rounded-xl bg-paper px-4 py-2.5 text-sm font-bold text-teal-dark transition-colors"
          >
            Cairkan reward →
          </Link>
        ) : (
          <p className="mt-4 text-xs text-teal-light/80">
            Bisa dicairkan mulai Rp{MINIMAL_PENCAIRAN.toLocaleString("id-ID")} — nggak dibatasi jumlahnya.
          </p>
        )}
      </section>

      {/* MISI AKTIF */}
      <section>
        <h2 className="text-lg font-extrabold text-ink">Misi aktif</h2>

        {misiKartu.length > 0 && (
          <div className="mt-3 space-y-3">
            {misiKartu.map((misi) => (
              <SurveyQuickCard key={misi.id} misi={misi} onSelesai={handleMisiSelesai} />
            ))}
          </div>
        )}

        {(misiBiasa.length > 0 || misiAktif.length === 0) && (
          <div className="mt-3 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
            {misiAktif.length === 0 && (
              <p className="px-5 py-6 text-sm text-ink-soft">
                Semua misi aktif sudah kamu selesaikan. Nantikan misi baru!
              </p>
            )}
            {misiBiasa.map((misi) => (
              <MissionRow key={misi.id} misi={misi} onSelesai={handleMisiSelesai} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
