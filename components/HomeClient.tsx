"use client";

import { useState } from "react";
import Link from "next/link";
import { MissionCard } from "./MissionCard";
import { MINIMAL_PENCAIRAN } from "@/lib/reward-constants";
import type { MisiItem, PencairanAktif } from "@/lib/dashboard-types";

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

function tanggalJamIndo(iso: string) {
  const tanggal = new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const jam = new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${tanggal}, ${jam}`;
}

export type RiwayatItem = {
  judul: string;
  nominal_reward: number;
  tanggal_selesai: string;
};

export function HomeClient({
  nama,
  saldoAwal,
  misiAwal,
  pencairanAktif,
  riwayatAwal,
}: {
  nama: string;
  saldoAwal: number;
  misiAwal: MisiItem[];
  pencairanAktif: PencairanAktif;
  riwayatAwal: RiwayatItem[];
}) {
  const [saldo, setSaldo] = useState(saldoAwal);
  const [misiList, setMisiList] = useState(misiAwal);

  const bisaCairkan = saldo >= MINIMAL_PENCAIRAN;
  const misiAktif = misiList.filter((m) => m.status !== "selesai");

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

        {misiAktif.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-bubble px-5 py-6 text-sm text-ink-soft shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
            Semua misi aktif sudah kamu selesaikan. Nantikan misi baru!
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {misiAktif.map((misi) => (
              <MissionCard key={misi.id} misi={misi} onSelesai={handleMisiSelesai} />
            ))}
          </div>
        )}
      </section>

      {/* RIWAYAT TRANSAKSI */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink">Riwayat Transaksi</h2>
          {riwayatAwal.length > 0 && (
            <Link href="/dashboard/dompet" className="text-sm font-semibold text-teal">
              Lihat semua →
            </Link>
          )}
        </div>

        {riwayatAwal.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-bubble px-5 py-6 text-sm text-ink-soft shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
            Belum ada transaksi. Yuk selesaikan misi pertamamu!
          </p>
        ) : (
          <div className="mt-3 rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
            <ul className="divide-y divide-ink/[0.08]">
              {riwayatAwal.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{r.judul}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">{tanggalJamIndo(r.tanggal_selesai)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-bold text-teal">+{rupiah(r.nominal_reward)}</p>
                    <span className="mt-1 inline-flex items-center rounded-full bg-teal-light px-2 py-0.5 text-[10px] font-bold text-teal-dark">
                      Berhasil
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
