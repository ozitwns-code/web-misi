"use client";

import { useState } from "react";
import { inputClass } from "./AuthCard";

export type MisiAdmin = {
  id: string;
  judul: string;
  deskripsi: string;
  nominal_reward: number;
  target_url: string | null;
  aktif: boolean;
  tipe: string;
};

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

function MisiEditForm({
  misi,
  onCancel,
  onSaved,
}: {
  misi: MisiAdmin;
  onCancel: () => void;
  onSaved: (updated: MisiAdmin) => void;
}) {
  const [judul, setJudul] = useState(misi.judul);
  const [deskripsi, setDeskripsi] = useState(misi.deskripsi);
  const [nominalReward, setNominalReward] = useState(String(misi.nominal_reward));
  const [targetUrl, setTargetUrl] = useState(misi.target_url ?? "");
  const [aktif, setAktif] = useState(misi.aktif);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSimpan() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/misi/${misi.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          deskripsi,
          nominal_reward: Number(nominalReward),
          target_url: targetUrl,
          aktif,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal menyimpan misi.");
        return;
      }
      onSaved(data.misi);
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
        <div className="flex items-end">
          <label className="flex items-center gap-2 pb-2.5 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={aktif}
              onChange={(e) => setAktif(e.target.checked)}
              className="h-4 w-4 rounded border-ink/30 accent-teal"
            />
            Misi aktif
          </label>
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

  function handleSaved(updated: MisiAdmin) {
    setMisiList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setEditingId(null);
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-extrabold text-ink">Kelola misi</h2>
      <div className="mt-3 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
        {misiList.map((misi) =>
          editingId === misi.id ? (
            <MisiEditForm
              key={misi.id}
              misi={misi}
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
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">{misi.deskripsi}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {rupiah(misi.nominal_reward)} ·{" "}
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
