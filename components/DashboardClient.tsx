"use client";

import { useMemo, useState, useEffect } from "react";
import { CheckDouble } from "./icons";
import { MissionRow } from "./MissionRow";
import { MINIMAL_PENCAIRAN } from "@/lib/reward-constants";
import type { SurveiPertanyaan } from "@/lib/misi-constants";

export type MisiItem = {
  id: string;
  judul: string;
  deskripsi: string;
  nominal_reward: number;
  tipe: string;
  target_url: string | null;
  perlu_survei: boolean;
  survei_pertanyaan: SurveiPertanyaan[];
  status: "belum" | "survei_selesai" | "menunggu" | "selesai";
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
};

export type PencairanAktif = {
  jumlah: number;
  status: "diminta" | "disetujui";
} | null;

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

function tanggalIndo(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function DashboardClient({
  nama,
  saldoAwal,
  misiAwal,
  kodeReferral,
  referralCountAwal,
  pencairanAktifAwal,
}: {
  nama: string;
  saldoAwal: number;
  misiAwal: MisiItem[];
  kodeReferral: string;
  referralCountAwal: number;
  pencairanAktifAwal: PencairanAktif;
}) {
  const [saldo, setSaldo] = useState(saldoAwal);
  const [misiList, setMisiList] = useState(misiAwal);
  const [referralCount] = useState(referralCountAwal);
  const [pencairanAktif, setPencairanAktif] = useState(pencairanAktifAwal);
  const [jumlahCairkan, setJumlahCairkan] = useState(String(saldoAwal));
  const [jumlahTouched, setJumlahTouched] = useState(false);
  const [cairkanLoading, setCairkanLoading] = useState(false);
  const [cairkanError, setCairkanError] = useState<string | null>(null);

  useEffect(() => {
    if (!jumlahTouched) setJumlahCairkan(String(saldo));
  }, [saldo, jumlahTouched]);

  const bisaCairkan = saldo >= MINIMAL_PENCAIRAN;

  const riwayat = useMemo(
    () =>
      misiList
        .filter((m) => m.status === "selesai" && m.tanggal_selesai)
        .sort(
          (a, b) =>
            new Date(b.tanggal_selesai!).getTime() -
            new Date(a.tanggal_selesai!).getTime(),
        ),
    [misiList],
  );

  const misiAktif = misiList.filter((m) => m.status !== "selesai");

  const [referralLink, setReferralLink] = useState("");
  useEffect(() => {
    setReferralLink(`${window.location.origin}/daftar?ref=${kodeReferral}`);
  }, [kodeReferral]);

  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia; link tetap bisa disalin manual dari field
    }
  }

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

  async function handleCairkan() {
    setCairkanLoading(true);
    setCairkanError(null);
    const jumlah = Number(jumlahCairkan);
    try {
      const res = await fetch("/api/pencairan/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jumlah }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCairkanError(data.error ?? "Gagal mengajukan pencairan.");
        return;
      }
      setPencairanAktif({ jumlah, status: "diminta" });
    } catch {
      setCairkanError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setCairkanLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* SALDO HEADER */}
      <section className="rounded-2xl bg-teal px-6 py-6 text-paper shadow-[0_1px_0_rgba(15,79,68,0.4),0_14px_28px_-16px_rgba(15,79,68,0.7)]">
        <p className="text-sm text-teal-light/85">Halo, {nama} 👋</p>
        <p className="mt-1 text-3xl font-extrabold">{rupiah(saldo)}</p>
        <p className="mt-1 text-xs text-teal-light/80">
          Bisa dicairkan mulai Rp{MINIMAL_PENCAIRAN.toLocaleString("id-ID")} per pengajuan — nggak dibatasi jumlahnya.
        </p>

        {pencairanAktif ? (
          <p className="mt-4 rounded-xl bg-paper/15 px-4 py-2.5 text-sm font-semibold text-paper">
            {pencairanAktif.status === "disetujui" ? (
              <>Pencairan {rupiah(pencairanAktif.jumlah)} disetujui, sedang diproses transfer.</>
            ) : (
              <>Pengajuan pencairan {rupiah(pencairanAktif.jumlah)} terkirim — menunggu direview admin.</>
            )}
          </p>
        ) : (
          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="number"
                min={MINIMAL_PENCAIRAN}
                max={saldo}
                step={1000}
                value={jumlahCairkan}
                onChange={(e) => {
                  setJumlahTouched(true);
                  setJumlahCairkan(e.target.value);
                }}
                disabled={!bisaCairkan}
                className="w-full rounded-xl bg-paper/15 px-3.5 py-2.5 text-sm font-semibold text-paper placeholder:text-paper/50 disabled:cursor-not-allowed disabled:opacity-40"
              />
              <button
                type="button"
                onClick={handleCairkan}
                disabled={!bisaCairkan || cairkanLoading}
                className="shrink-0 rounded-xl bg-paper px-4 py-2.5 text-sm font-bold text-teal-dark transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                {cairkanLoading ? "Mengajukan..." : "Ajukan Pencairan"}
              </button>
            </div>
            {!bisaCairkan && (
              <p className="mt-2 text-xs text-teal-light/80">
                Kumpulkan saldo sampai minimal Rp{MINIMAL_PENCAIRAN.toLocaleString("id-ID")} dulu.
              </p>
            )}
            {cairkanError && (
              <p role="alert" className="mt-2 text-sm font-medium text-paper">
                {cairkanError}
              </p>
            )}
          </div>
        )}
      </section>

      {/* MISI AKTIF */}
      <section>
        <h2 className="text-lg font-extrabold text-ink">Misi aktif</h2>
        <div className="mt-3 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
          {misiAktif.length === 0 && (
            <p className="px-5 py-6 text-sm text-ink-soft">
              Semua misi aktif sudah kamu selesaikan. Nantikan misi baru!
            </p>
          )}
          {misiAktif.map((misi) => (
            <MissionRow key={misi.id} misi={misi} onSelesai={handleMisiSelesai} />
          ))}
        </div>
      </section>

      {/* REFERRAL */}
      <section className="rounded-2xl bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
        <h2 className="text-lg font-extrabold text-ink">Ajak teman, dapat reward</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Bagikan link ini. {referralCount} orang sudah gabung lewat kamu.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={referralLink}
            className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink-soft"
            onFocus={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark"
          >
            {copied ? "Tersalin!" : "Salin link"}
          </button>
        </div>
      </section>

      {/* RIWAYAT */}
      <section>
        <h2 className="text-lg font-extrabold text-ink">Riwayat misi selesai</h2>
        <div className="mt-3 rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
          {riwayat.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-soft">
              Belum ada misi yang diselesaikan.
            </p>
          ) : (
            <ul className="divide-y divide-ink/[0.08]">
              {riwayat.map((misi) => (
                <li
                  key={misi.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm"
                >
                  <span className="flex items-center gap-2 text-ink">
                    <CheckDouble className="h-3.5 w-3.5 text-teal" />
                    {misi.judul}
                  </span>
                  <span className="whitespace-nowrap text-ink-soft">
                    {tanggalIndo(misi.tanggal_selesai!)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
