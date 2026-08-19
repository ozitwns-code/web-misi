"use client";

import { useState } from "react";
import { inputClass } from "./AuthCard";
import { SurveiEditor } from "./SurveiEditor";
import type { SurveiPertanyaan } from "@/lib/misi-constants";

export type MisiAdmin = {
  id: string;
  judul: string;
  deskripsi: string;
  nominal_reward: number;
  target_url: string | null;
  aktif: boolean;
  tipe: string;
  perlu_survei: boolean;
  survei_pertanyaan: SurveiPertanyaan[];
  kuota_harian: number | null;
  cta_label: string | null;
  estimasi_menit: number | null;
};

const TIPE_OPTIONS = [
  { value: "baca", label: "Baca artikel" },
  { value: "share", label: "Share sosial" },
  { value: "sosial", label: "Sosial (follow, dll)" },
  { value: "checkin", label: "Checkin" },
  { value: "survei", label: "Survei" },
];

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

const MISI_KOSONG = {
  judul: "",
  deskripsi: "",
  nominal_reward: "5000",
  tipe: "baca",
  target_url: "",
  aktif: true,
  perlu_survei: false,
  survei_pertanyaan: [] as SurveiPertanyaan[],
  kuota_harian: "",
  cta_label: "",
  estimasi_menit: "",
};

function MisiForm({
  awal,
  endpoint,
  method,
  onCancel,
  onSaved,
}: {
  awal: typeof MISI_KOSONG;
  endpoint: string;
  method: "POST" | "PATCH";
  onCancel: () => void;
  onSaved: (updated: MisiAdmin) => void;
}) {
  const [judul, setJudul] = useState(awal.judul);
  const [deskripsi, setDeskripsi] = useState(awal.deskripsi);
  const [nominalReward, setNominalReward] = useState(awal.nominal_reward);
  const [tipe, setTipe] = useState(awal.tipe);
  const [targetUrl, setTargetUrl] = useState(awal.target_url);
  const [aktif, setAktif] = useState(awal.aktif);
  const [perluSurvei, setPerluSurvei] = useState(awal.perlu_survei);
  const [surveiPertanyaan, setSurveiPertanyaan] = useState<SurveiPertanyaan[]>(
    awal.survei_pertanyaan.length > 0
      ? awal.survei_pertanyaan
      : [{ id: "q1", text: "", options: ["", ""] }],
  );
  const [kuotaHarian, setKuotaHarian] = useState(awal.kuota_harian);
  const [ctaLabel, setCtaLabel] = useState(awal.cta_label);
  const [estimasiMenit, setEstimasiMenit] = useState(awal.estimasi_menit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSimpan() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          deskripsi,
          nominal_reward: Number(nominalReward),
          tipe,
          target_url: targetUrl,
          aktif,
          perlu_survei: perluSurvei,
          survei_pertanyaan: perluSurvei ? surveiPertanyaan : null,
          kuota_harian: kuotaHarian.trim() === "" ? null : Number(kuotaHarian),
          cta_label: ctaLabel,
          estimasi_menit: estimasiMenit.trim() === "" ? null : Number(estimasiMenit),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal menyimpan misi.");
        return;
      }
      onSaved({
        id: data.misi.id,
        judul: data.misi.judul,
        deskripsi: data.misi.deskripsi,
        nominal_reward: data.misi.nominal_reward,
        target_url: data.misi.target_url,
        aktif: data.misi.aktif,
        tipe: data.misi.tipe,
        perlu_survei: data.misi.perlu_survei,
        survei_pertanyaan: perluSurvei ? surveiPertanyaan : [],
        kuota_harian: data.misi.kuota_harian,
        cta_label: data.misi.cta_label,
        estimasi_menit: data.misi.estimasi_menit,
      });
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 px-5 py-4">
      <div>
        <label className="mb-1 block text-xs font-semibold text-ink-soft">Judul</label>
        <input className={inputClass} value={judul} onChange={(e) => setJudul(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-ink-soft">Deskripsi</label>
        <textarea
          className={`${inputClass} min-h-20 resize-y`}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">
            Nominal reward (Rp)
          </label>
          <input
            className={inputClass}
            type="number"
            min={1}
            value={nominalReward}
            onChange={(e) => setNominalReward(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Jenis misi</label>
          <select
            className={inputClass}
            value={tipe}
            onChange={(e) => setTipe(e.target.value)}
          >
            {TIPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-ink-soft">
          Link tujuan (opsional — kosongkan kalau misi self-report biasa)
        </label>
        <input
          className={inputClass}
          type="text"
          placeholder="https://..."
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-ink-soft">
          Label tombol buka link (opsional — kosongkan untuk pakai "Kerjakan")
        </label>
        <input
          className={inputClass}
          type="text"
          placeholder="Kerjakan"
          value={ctaLabel}
          onChange={(e) => setCtaLabel(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">
            Kuota harian (opsional — kosongkan untuk tanpa batas)
          </label>
          <input
            className={inputClass}
            type="number"
            min={1}
            placeholder="Tanpa batas"
            value={kuotaHarian}
            onChange={(e) => setKuotaHarian(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">
            Estimasi waktu, menit (opsional — isi untuk tampilan kartu survei kilat)
          </label>
          <input
            className={inputClass}
            type="number"
            min={1}
            placeholder="Kosongkan"
            value={estimasiMenit}
            onChange={(e) => setEstimasiMenit(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-1">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={aktif}
            onChange={(e) => setAktif(e.target.checked)}
            className="h-4 w-4 rounded border-ink/30 accent-teal"
          />
          Misi aktif
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={perluSurvei}
            onChange={(e) => setPerluSurvei(e.target.checked)}
            className="h-4 w-4 rounded border-ink/30 accent-teal"
          />
          Pakai survei dulu
        </label>
      </div>

      {perluSurvei && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
            Pertanyaan survei
          </label>
          <SurveiEditor pertanyaan={surveiPertanyaan} onChange={setSurveiPertanyaan} />
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm font-medium text-[#B34434]">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleSimpan}
          disabled={loading}
          className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-bold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export function AdminMisiSection({ misiListAwal }: { misiListAwal: MisiAdmin[] }) {
  const [misiList, setMisiList] = useState(misiListAwal);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  function handleSaved(updated: MisiAdmin) {
    setMisiList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setEditingId(null);
  }

  function handleCreated(created: MisiAdmin) {
    setMisiList((prev) => [...prev, created]);
    setCreating(false);
  }

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-extrabold text-ink">Kelola misi</h2>
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark"
          >
            + Tambah Misi Baru
          </button>
        )}
      </div>

      <div className="mt-3 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
        {creating && (
          <MisiForm
            awal={MISI_KOSONG}
            endpoint="/api/admin/misi"
            method="POST"
            onCancel={() => setCreating(false)}
            onSaved={handleCreated}
          />
        )}
        {misiList.map((misi) =>
          editingId === misi.id ? (
            <MisiForm
              key={misi.id}
              awal={{
                judul: misi.judul,
                deskripsi: misi.deskripsi,
                nominal_reward: String(misi.nominal_reward),
                tipe: misi.tipe,
                target_url: misi.target_url ?? "",
                aktif: misi.aktif,
                perlu_survei: misi.perlu_survei,
                survei_pertanyaan: misi.survei_pertanyaan,
                kuota_harian: misi.kuota_harian !== null ? String(misi.kuota_harian) : "",
                cta_label: misi.cta_label ?? "",
                estimasi_menit: misi.estimasi_menit !== null ? String(misi.estimasi_menit) : "",
              }}
              endpoint={`/api/admin/misi/${misi.id}`}
              method="PATCH"
              onCancel={() => setEditingId(null)}
              onSaved={handleSaved}
            />
          ) : (
            <div key={misi.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-ink">{misi.judul}</h3>
                  {!misi.aktif && (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold text-ink-soft">
                      Nonaktif
                    </span>
                  )}
                  {misi.kuota_harian !== null && (
                    <span className="rounded-full bg-teal-light px-2 py-0.5 text-xs font-semibold text-teal-dark">
                      Kuota {misi.kuota_harian}/hari
                    </span>
                  )}
                  {misi.estimasi_menit !== null && (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold text-ink-soft">
                      Kartu survei kilat · {misi.estimasi_menit} menit
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">{misi.deskripsi}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {rupiah(misi.nominal_reward)} · {misi.tipe}
                  {misi.perlu_survei ? " · pakai survei" : ""} ·{" "}
                  {misi.target_url ? (
                    <a
                      href={misi.target_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-dark underline decoration-teal/40 underline-offset-2"
                    >
                      {misi.target_url}
                    </a>
                  ) : (
                    "tanpa link (self-report)"
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingId(misi.id)}
                className="shrink-0 rounded-full border border-ink/15 px-4 py-1.5 text-sm font-bold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
              >
                Edit
              </button>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
