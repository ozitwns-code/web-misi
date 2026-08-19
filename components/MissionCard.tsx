"use client";

import { useEffect, useRef, useState } from "react";
import { CheckDouble, ClockIcon, ExternalLink, LoaderDots } from "./icons";
import { SurveyMission } from "./SurveyMission";
import type { MisiItem } from "@/lib/dashboard-types";

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

const TIPE_BADGE: Record<string, string> = {
  baca: "Baca Artikel",
  share: "Share",
  sosial: "Follow",
  checkin: "Checkin",
  survei: "Survei Kilat",
};

export function MissionCard({
  misi,
  onSelesai,
}: {
  misi: MisiItem;
  onSelesai: (misiId: string, saldoReward: number) => void;
}) {
  const [status, setStatus] = useState(misi.status);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attemptingRef = useRef(false);

  async function handleTandaiSelesai() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/misi/${misi.id}/complete`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal menandai misi selesai.");
        return;
      }
      setStatus("selesai");
      onSelesai(misi.id, data.saldo_reward);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleKerjakan() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/misi/${misi.id}/mulai`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal memulai misi.");
        return;
      }
      window.open(data.target_url, "_blank");
      setStatus("menunggu");
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  // Misi berlink: begitu tab ini aktif lagi setelah link dibuka, coba tandai
  // selesai. Server yang memutuskan valid atau belum; kalau belum, biarin
  // nunggu event focus berikutnya.
  useEffect(() => {
    if (status !== "menunggu") return;

    async function attemptComplete() {
      if (document.visibilityState !== "visible") return;
      if (attemptingRef.current) return;
      attemptingRef.current = true;
      try {
        const res = await fetch(`/api/misi/${misi.id}/complete`, { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          setStatus("selesai");
          onSelesai(misi.id, data.saldo_reward);
        }
      } catch {
        // koneksi bermasalah -> diam, tunggu focus berikutnya
      } finally {
        attemptingRef.current = false;
      }
    }

    document.addEventListener("visibilitychange", attemptComplete);
    window.addEventListener("focus", attemptComplete);
    return () => {
      document.removeEventListener("visibilitychange", attemptComplete);
      window.removeEventListener("focus", attemptComplete);
    };
  }, [status, misi.id, onSelesai]);

  const kuotaPenuh = misi.kuota_penuh && status === "belum";
  const badge = TIPE_BADGE[misi.tipe] ?? "Misi";
  const showTeaser = status === "belum" && !kuotaPenuh && !(misi.perlu_survei && started);
  const showStepper = status === "belum" && !kuotaPenuh && misi.perlu_survei && started;

  return (
    <div className="rounded-2xl bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_8px_20px_-14px_rgba(36,28,21,0.35)]">
      <span className="inline-flex items-center rounded-full bg-teal-light px-3 py-1 text-xs font-bold text-teal-dark">
        {badge}
      </span>

      {!misi.perlu_survei && (
        <>
          <h3 className="mt-3 font-bold text-ink">{misi.judul}</h3>
          <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{misi.deskripsi}</p>
        </>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-[#B34434]">
          {error}
        </p>
      )}

      {status === "selesai" && (
        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-teal-dark">
          <CheckDouble className="h-3.5 w-3.5" />
          Selesai
        </div>
      )}

      {kuotaPenuh && (
        <p className="mt-4 text-sm font-semibold text-ink-soft">
          Kuota misi ini untuk hari ini sudah penuh — coba lagi besok.
        </p>
      )}

      {status === "menunggu" && (
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-teal-dark">
          <LoaderDots className="h-4 w-4" />
          Menunggu kamu kembali ke sini...
        </div>
      )}

      {showTeaser && (
        <div className="mt-5 text-center">
          <p className="text-3xl font-extrabold text-ink">+{rupiah(misi.nominal_reward)}</p>
          {misi.estimasi_menit !== null && (
            <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-ink-soft">
              <ClockIcon className="h-4 w-4" />
              {misi.estimasi_menit} menit
            </p>
          )}

          {misi.perlu_survei ? (
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="mt-4 w-full rounded-xl bg-teal py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-teal-dark"
            >
              Mulai Survei
            </button>
          ) : misi.target_url ? (
            <button
              type="button"
              onClick={handleKerjakan}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Membuka..." : misi.cta_label || "Mulai"}
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTandaiSelesai}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-teal py-3 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Menyimpan..." : "Tandai Selesai"}
            </button>
          )}
        </div>
      )}

      {showStepper && (
        <SurveyMission
          misiId={misi.id}
          pertanyaan={misi.survei_pertanyaan}
          hasTargetUrl={Boolean(misi.target_url)}
          ctaLabel={misi.cta_label}
          onSubmitted={(nextStatus) => setStatus(nextStatus)}
          indent={false}
        />
      )}
    </div>
  );
}
