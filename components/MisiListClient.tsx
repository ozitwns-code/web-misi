"use client";

import { useState } from "react";
import { MissionRow } from "./MissionRow";
import { SurveyQuickCard } from "./SurveyQuickCard";
import type { MisiItem } from "@/lib/dashboard-types";

export function MisiListClient({ misiAwal }: { misiAwal: MisiItem[] }) {
  const [misiList, setMisiList] = useState(misiAwal);

  function handleMisiSelesai(misiId: string) {
    setMisiList((prev) =>
      prev.map((m) =>
        m.id === misiId
          ? { ...m, status: "selesai", tanggal_selesai: new Date().toISOString() }
          : m,
      ),
    );
  }

  const misiKartu = misiList.filter((m) => m.estimasi_menit !== null);
  const misiBiasa = misiList.filter((m) => m.estimasi_menit === null);

  return (
    <section>
      <h2 className="text-lg font-extrabold text-ink">Semua misi</h2>
      <p className="mt-1 text-sm text-ink-soft">Daftar lengkap misi yang tersedia buat kamu.</p>

      {misiKartu.length > 0 && (
        <div className="mt-4 space-y-3">
          {misiKartu.map((misi) => (
            <SurveyQuickCard key={misi.id} misi={misi} onSelesai={handleMisiSelesai} />
          ))}
        </div>
      )}

      {(misiBiasa.length > 0 || misiList.length === 0) && (
        <div className="mt-4 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
          {misiList.length === 0 && (
            <p className="px-5 py-6 text-sm text-ink-soft">Belum ada misi tersedia.</p>
          )}
          {misiBiasa.map((misi) => (
            <MissionRow key={misi.id} misi={misi} onSelesai={handleMisiSelesai} />
          ))}
        </div>
      )}
    </section>
  );
}
