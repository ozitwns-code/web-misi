"use client";

import type { SurveiPertanyaan } from "@/lib/misi-constants";
import { inputClass } from "./AuthCard";

function idBaru() {
  return `q${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function SurveiEditor({
  pertanyaan,
  onChange,
}: {
  pertanyaan: SurveiPertanyaan[];
  onChange: (next: SurveiPertanyaan[]) => void;
}) {
  function tambahPertanyaan() {
    onChange([...pertanyaan, { id: idBaru(), text: "", tipe: "pilihan", options: ["", ""] }]);
  }

  function hapusPertanyaan(index: number) {
    onChange(pertanyaan.filter((_, i) => i !== index));
  }

  function ubahTeks(index: number, text: string) {
    onChange(pertanyaan.map((q, i) => (i === index ? { ...q, text } : q)));
  }

  function ubahTipe(index: number, tipe: "pilihan" | "teks") {
    onChange(
      pertanyaan.map((q, i) =>
        i === index
          ? { ...q, tipe, options: tipe === "teks" ? [] : q.options.length >= 2 ? q.options : ["", ""] }
          : q,
      ),
    );
  }

  function tambahOpsi(index: number) {
    onChange(pertanyaan.map((q, i) => (i === index ? { ...q, options: [...q.options, ""] } : q)));
  }

  function hapusOpsi(index: number, optionIndex: number) {
    onChange(
      pertanyaan.map((q, i) =>
        i === index ? { ...q, options: q.options.filter((_, oi) => oi !== optionIndex) } : q,
      ),
    );
  }

  function ubahOpsi(index: number, optionIndex: number, value: string) {
    onChange(
      pertanyaan.map((q, i) =>
        i === index
          ? { ...q, options: q.options.map((o, oi) => (oi === optionIndex ? value : o)) }
          : q,
      ),
    );
  }

  return (
    <div className="space-y-3">
      {pertanyaan.map((q, index) => (
        <div key={q.id} className="rounded-xl border border-ink/15 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              className={inputClass}
              placeholder={`Pertanyaan ${index + 1}`}
              value={q.text}
              onChange={(e) => ubahTeks(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => hapusPertanyaan(index)}
              className="shrink-0 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
            >
              Hapus
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-ink-soft">
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name={`tipe-${q.id}`}
                checked={(q.tipe ?? "pilihan") === "pilihan"}
                onChange={() => ubahTipe(index, "pilihan")}
                className="accent-teal"
              />
              Pilihan ganda
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name={`tipe-${q.id}`}
                checked={q.tipe === "teks"}
                onChange={() => ubahTipe(index, "teks")}
                className="accent-teal"
              />
              Isian teks bebas
            </label>
          </div>
          {(q.tipe ?? "pilihan") === "pilihan" && (
            <div className="ml-3 space-y-1.5">
              {q.options.map((opt, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    className={`${inputClass} py-1.5`}
                    placeholder={`Opsi ${optionIndex + 1}`}
                    value={opt}
                    onChange={(e) => ubahOpsi(index, optionIndex, e.target.value)}
                  />
                  {q.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => hapusOpsi(index, optionIndex)}
                      className="shrink-0 text-xs font-bold text-ink-soft hover:text-ink"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => tambahOpsi(index)}
                className="text-xs font-bold text-teal-dark"
              >
                + Tambah opsi
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={tambahPertanyaan}
        className="rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
      >
        + Tambah pertanyaan
      </button>
    </div>
  );
}
