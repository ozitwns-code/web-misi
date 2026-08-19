"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  CheckDouble,
  ClipboardList,
  ExternalLink,
  HandCoins,
  LoaderDots,
  ShareNodes,
  UsersTwo,
} from "./icons";
import type { MisiItem } from "@/lib/dashboard-types";

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

const TIPE_ICON: Record<string, typeof BookOpen> = {
  baca: BookOpen,
  share: ShareNodes,
  sosial: UsersTwo,
  checkin: CalendarCheck,
  survei: ClipboardList,
};

export function MissionRow({
  misi,
  onSelesai,
}: {
  misi: MisiItem;
  onSelesai: (misiId: string, saldoReward: number) => void;
}) {
  const Icon = TIPE_ICON[misi.tipe] ?? HandCoins;
  const [status, setStatus] = useState(misi.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  const attemptingRef = useRef(false);

  const allAnswered = misi.survei_pertanyaan.every((q) => jawaban[q.id]);

  async function handleKirimSurvei() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/misi/${misi.id}/survei`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jawaban }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal mengirim survei.");
        return;
      }
      setStatus("survei_selesai");
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

  // Misi berlink: begitu tab ini aktif lagi setelah "Kerjakan", coba tandai selesai.
  // Server yang memutuskan valid atau belum (lihat elapsed time); kalau belum,
  // biarin nunggu event focus berikutnya.
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
        // res gagal karena belum cukup waktu -> diam, tunggu focus berikutnya
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
  const showSurvei = misi.perlu_survei && status === "belum" && !kuotaPenuh;

  return (
    <div className="px-5 py-5">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal-dark">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="font-bold text-ink">{misi.judul}</h3>
            <span className="whitespace-nowrap text-sm font-bold text-teal-dark">
              +{rupiah(misi.nominal_reward)}
            </span>
          </div>
          <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">
            {misi.deskripsi}
          </p>
          {error && (
            <p role="alert" className="mt-2 text-sm font-medium text-[#B34434]">
              {error}
            </p>
          )}

          {status === "selesai" && (
            <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-teal-dark">
              <CheckDouble className="h-3.5 w-3.5" />
              Selesai
            </div>
          )}

          {kuotaPenuh && (
            <div className="mt-3 text-sm font-semibold text-ink-soft">
              Kuota misi ini untuk hari ini sudah penuh — coba lagi besok.
            </div>
          )}

          {status !== "selesai" && !misi.target_url && !kuotaPenuh && (
            <button
              type="button"
              onClick={handleTandaiSelesai}
              disabled={loading}
              className="mt-3 rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Menyimpan..." : "Tandai Selesai"}
            </button>
          )}

          {misi.target_url && status === "menunggu" && (
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-teal-dark">
              <LoaderDots className="h-4 w-4" />
              Menunggu kamu kembali ke sini...
            </div>
          )}

          {misi.target_url && !showSurvei && status !== "menunggu" && status !== "selesai" && !kuotaPenuh && (
            <button
              type="button"
              onClick={handleKerjakan}
              disabled={loading}
              className="mt-3 flex items-center gap-1.5 rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Membuka..." : (misi.cta_label || "Kerjakan")}
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {showSurvei && (
        <div className="mt-4 ml-14 space-y-4">
          {misi.survei_pertanyaan.map((q) => (
            <div key={q.id}>
              <p className="mb-2 text-sm font-semibold text-ink">{q.text}</p>
              {q.tipe === "teks" ? (
                <input
                  type="text"
                  value={jawaban[q.id] ?? ""}
                  onChange={(e) =>
                    setJawaban((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder="Ketik jawaban kamu"
                  className="w-full rounded-xl border border-ink/15 px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-teal"
                />
              ) : (
                <div className="space-y-1.5">
                  {q.options.map((opt) => {
                    const selected = jawaban[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setJawaban((prev) => ({ ...prev, [q.id]: opt }))}
                        className={`block w-full rounded-xl border px-3.5 py-2 text-left text-sm transition-colors ${
                          selected
                            ? "border-teal bg-teal-light font-semibold text-teal-dark"
                            : "border-ink/15 text-ink-soft hover:border-ink/30"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {allAnswered && (
            <p className="text-xs text-ink-soft">
              Isi jujur, jangan sampai kehabisan waktu.
            </p>
          )}

          <button
            type="button"
            onClick={handleKirimSurvei}
            disabled={!allAnswered || loading}
            className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Mengirim..." : "Kirim Jawaban"}
          </button>
        </div>
      )}
    </div>
  );
}
