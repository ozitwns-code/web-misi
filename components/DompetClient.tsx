"use client";

import { useEffect, useState } from "react";
import { CheckDouble } from "./icons";
import { MINIMAL_PENCAIRAN } from "@/lib/reward-constants";
import type { PencairanAktif } from "@/lib/dashboard-types";

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

export type PayoutInfo = {
  metode_pencairan: "bank" | "e_wallet";
  nama_penyedia: string;
  nomor_tujuan: string;
  nama_pemilik: string;
} | null;

export type RiwayatMisiItem = {
  judul: string;
  nominal_reward: number;
  tanggal_selesai: string;
};

export type RiwayatPencairanItem = {
  id: string;
  jumlah: number;
  status: "diminta" | "disetujui" | "selesai" | "ditolak";
  tanggalDiminta: string;
};

const STATUS_LABEL: Record<RiwayatPencairanItem["status"], string> = {
  diminta: "Menunggu review",
  disetujui: "Disetujui, diproses transfer",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

export function DompetClient({
  saldoAwal,
  payoutInfoAwal,
  pencairanAktifAwal,
  riwayatMisi,
  riwayatPencairanAwal,
}: {
  saldoAwal: number;
  payoutInfoAwal: PayoutInfo;
  pencairanAktifAwal: PencairanAktif;
  riwayatMisi: RiwayatMisiItem[];
  riwayatPencairanAwal: RiwayatPencairanItem[];
}) {
  const [saldo] = useState(saldoAwal);
  const [pencairanAktif, setPencairanAktif] = useState(pencairanAktifAwal);
  const [riwayatPencairan, setRiwayatPencairan] = useState(riwayatPencairanAwal);

  const [payoutInfo, setPayoutInfo] = useState(payoutInfoAwal);
  const [metode, setMetode] = useState<"bank" | "e_wallet">(payoutInfoAwal?.metode_pencairan ?? "bank");
  const [namaPenyedia, setNamaPenyedia] = useState(payoutInfoAwal?.nama_penyedia ?? "");
  const [nomorTujuan, setNomorTujuan] = useState(payoutInfoAwal?.nomor_tujuan ?? "");
  const [namaPemilik, setNamaPemilik] = useState(payoutInfoAwal?.nama_pemilik ?? "");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSaved, setInfoSaved] = useState(false);

  async function handleSaveInfo() {
    setSavingInfo(true);
    setInfoError(null);
    setInfoSaved(false);
    try {
      const res = await fetch("/api/user/payout-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metode_pencairan: metode,
          nama_penyedia: namaPenyedia,
          nomor_tujuan: nomorTujuan,
          nama_pemilik: namaPemilik,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInfoError(data.error ?? "Gagal menyimpan data pembayaran.");
        return;
      }
      setPayoutInfo({
        metode_pencairan: metode,
        nama_penyedia: namaPenyedia.trim(),
        nomor_tujuan: nomorTujuan.trim(),
        nama_pemilik: namaPemilik.trim(),
      });
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 2500);
    } catch {
      setInfoError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setSavingInfo(false);
    }
  }

  const bisaCairkan = saldo >= MINIMAL_PENCAIRAN;
  const [jumlahCairkan, setJumlahCairkan] = useState(String(saldoAwal));
  const [jumlahTouched, setJumlahTouched] = useState(false);
  const [cairkanLoading, setCairkanLoading] = useState(false);
  const [cairkanError, setCairkanError] = useState<string | null>(null);

  useEffect(() => {
    if (!jumlahTouched) setJumlahCairkan(String(saldo));
  }, [saldo, jumlahTouched]);

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
      setRiwayatPencairan((prev) => [
        { id: data.request.id, jumlah, status: "diminta", tanggalDiminta: new Date().toISOString() },
        ...prev,
      ]);
    } catch {
      setCairkanError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setCairkanLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* SALDO */}
      <section className="rounded-2xl bg-teal px-6 py-6 text-paper shadow-[0_1px_0_rgba(15,79,68,0.4),0_14px_28px_-16px_rgba(15,79,68,0.7)]">
        <p className="text-sm text-teal-light/85">Saldo kamu</p>
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
                disabled={!bisaCairkan || !payoutInfo || cairkanLoading}
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
            {bisaCairkan && !payoutInfo && (
              <p className="mt-2 text-xs text-teal-light/80">
                Lengkapi data pembayaran di bawah dulu sebelum mengajukan pencairan.
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

      {/* DATA PEMBAYARAN */}
      <section className="rounded-2xl bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
        <h2 className="text-lg font-extrabold text-ink">Data pembayaran</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Rekening bank atau e-wallet tujuan transfer reward kamu.
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMetode("bank")}
              className={`flex-1 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${
                metode === "bank"
                  ? "border-teal bg-teal-light text-teal-dark"
                  : "border-ink/15 text-ink-soft hover:border-ink/30"
              }`}
            >
              Bank
            </button>
            <button
              type="button"
              onClick={() => setMetode("e_wallet")}
              className={`flex-1 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${
                metode === "e_wallet"
                  ? "border-teal bg-teal-light text-teal-dark"
                  : "border-ink/15 text-ink-soft hover:border-ink/30"
              }`}
            >
              E-wallet
            </button>
          </div>

          <input
            value={namaPenyedia}
            onChange={(e) => setNamaPenyedia(e.target.value)}
            placeholder={metode === "bank" ? "Nama bank (mis. BCA)" : "Nama e-wallet (mis. DANA)"}
            className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60"
          />
          <input
            value={nomorTujuan}
            onChange={(e) => setNomorTujuan(e.target.value)}
            placeholder={metode === "bank" ? "Nomor rekening" : "Nomor e-wallet"}
            className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60"
          />
          <input
            value={namaPemilik}
            onChange={(e) => setNamaPemilik(e.target.value)}
            placeholder="Nama pemilik rekening/e-wallet"
            className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60"
          />

          {infoError && (
            <p role="alert" className="text-sm font-medium text-[#B34434]">
              {infoError}
            </p>
          )}

          <button
            type="button"
            onClick={handleSaveInfo}
            disabled={savingInfo}
            className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {savingInfo ? "Menyimpan..." : infoSaved ? "Tersimpan" : "Simpan data pembayaran"}
          </button>
        </div>
      </section>

      {/* RIWAYAT PENCAIRAN */}
      {riwayatPencairan.length > 0 && (
        <section>
          <h2 className="text-lg font-extrabold text-ink">Riwayat pencairan</h2>
          <div className="mt-3 rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
            <ul className="divide-y divide-ink/[0.08]">
              {riwayatPencairan.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                  <div>
                    <p className="font-semibold text-ink">{rupiah(p.jumlah)}</p>
                    <p className="text-ink-soft">{STATUS_LABEL[p.status]}</p>
                  </div>
                  <span className="whitespace-nowrap text-ink-soft">
                    {tanggalIndo(p.tanggalDiminta)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* RIWAYAT MISI */}
      <section>
        <h2 className="text-lg font-extrabold text-ink">Riwayat misi selesai</h2>
        <div className="mt-3 rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
          {riwayatMisi.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-soft">
              Belum ada misi yang diselesaikan.
            </p>
          ) : (
            <ul className="divide-y divide-ink/[0.08]">
              {riwayatMisi.map((misi, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm"
                >
                  <span className="flex items-center gap-2 text-ink">
                    <CheckDouble className="h-3.5 w-3.5 text-teal" />
                    {misi.judul}
                  </span>
                  <span className="whitespace-nowrap text-ink-soft">
                    {tanggalIndo(misi.tanggal_selesai)}
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
