"use client";

import { useEffect, useRef, useState } from "react";
import type { SurveiPertanyaan } from "@/lib/misi-constants";

export function SurveyMission({
  misiId,
  pertanyaan,
  hasTargetUrl,
  ctaLabel,
  onSubmitted,
  indent = true,
}: {
  misiId: string;
  pertanyaan: SurveiPertanyaan[];
  hasTargetUrl: boolean;
  ctaLabel: string | null;
  onSubmitted: (status: "survei_selesai" | "menunggu") => void;
  /** false untuk dipakai di luar row bermika (mis. dalam kartu tanpa avatar ikon). */
  indent?: boolean;
}) {
  const total = pertanyaan.length;
  const [step, setStep] = useState(0);
  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  const [teksDraft, setTeksDraft] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const pertanyaanSaatIni = pertanyaan[step];
  const ditutup = step >= total;
  const persen = Math.round((Math.min(step, total) / total) * 100);

  function majuKeStep(next: number, delayMs: number) {
    setTransitioning(true);
    setError(null);
    advanceTimer.current = setTimeout(() => {
      setStep(next);
      setTransitioning(false);
    }, delayMs);
  }

  function pilihOpsi(opt: string) {
    if (!pertanyaanSaatIni || transitioning) return;
    setJawaban((prev) => ({ ...prev, [pertanyaanSaatIni.id]: opt }));
    majuKeStep(step + 1, 320);
  }

  function lanjutTeks() {
    if (!pertanyaanSaatIni) return;
    const nilai = teksDraft.trim();
    if (!nilai) return;
    setJawaban((prev) => ({ ...prev, [pertanyaanSaatIni.id]: nilai }));
    setTeksDraft("");
    majuKeStep(step + 1, 150);
  }

  async function handleFinalSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/misi/${misiId}/survei`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jawaban }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal mengirim survei.");
        return;
      }

      if (!hasTargetUrl) {
        onSubmitted("survei_selesai");
        return;
      }

      const res2 = await fetch(`/api/misi/${misiId}/mulai`, { method: "POST" });
      const data2 = await res2.json();
      if (!res2.ok) {
        setError(data2.error ?? "Gagal memulai misi.");
        return;
      }
      window.open(data2.target_url, "_blank");
      onSubmitted("menunggu");
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`mt-4 space-y-4 ${indent ? "ml-14" : ""}`}>
      <div>
        {!ditutup && (
          <p className="mb-1.5 text-xs font-semibold text-ink-soft">
            Pertanyaan {step + 1} dari {total}
          </p>
        )}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-teal-light">
          <div
            className="h-full rounded-full bg-teal transition-all duration-300 ease-out"
            style={{ width: `${persen}%` }}
          />
        </div>
      </div>

      {!ditutup && pertanyaanSaatIni && (
        <div key={step} className="motion-safe:animate-step-in">
          <p className="mb-2 text-sm font-semibold text-ink">{pertanyaanSaatIni.text}</p>
          {pertanyaanSaatIni.tipe === "teks" ? (
            <div className="space-y-2">
              <input
                type="text"
                value={teksDraft}
                onChange={(e) => setTeksDraft(e.target.value)}
                placeholder="Ketik jawaban kamu"
                disabled={transitioning}
                className="w-full rounded-xl border border-ink/15 px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-teal disabled:opacity-60"
              />
              <button
                type="button"
                onClick={lanjutTeks}
                disabled={teksDraft.trim().length === 0 || transitioning}
                className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Lanjut
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {pertanyaanSaatIni.options.map((opt) => {
                const selected = jawaban[pertanyaanSaatIni.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => pilihOpsi(opt)}
                    disabled={transitioning}
                    className={`block w-full rounded-xl border px-3.5 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed ${
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
      )}

      {ditutup && (
        <div key="closing" className="motion-safe:animate-step-in space-y-3">
          <p className="text-xs text-ink-soft">Isi jujur, jangan sampai kehabisan waktu.</p>
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={loading}
            className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Mengirim..." : ctaLabel || (hasTargetUrl ? "Kerjakan" : "Kirim Jawaban")}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm font-medium text-[#B34434]">
          {error}
        </p>
      )}
    </div>
  );
}
