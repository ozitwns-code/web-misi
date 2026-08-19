"use client";

import { useState } from "react";
import { MissionCard } from "./MissionCard";
import { BlogInfoSection } from "./BlogInfoSection";
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

  return (
    <>
      <section>
        <h2 className="text-lg font-extrabold text-ink">Semua misi</h2>
        <p className="mt-1 text-sm text-ink-soft">Daftar lengkap misi yang tersedia buat kamu.</p>

        {misiList.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-bubble px-5 py-6 text-sm text-ink-soft shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
            Belum ada misi tersedia.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {misiList.map((misi) => (
              <MissionCard key={misi.id} misi={misi} onSelesai={handleMisiSelesai} />
            ))}
          </div>
        )}
      </section>

      <BlogInfoSection />
    </>
  );
}
