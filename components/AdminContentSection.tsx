"use client";

import { useState } from "react";
import { CONTENT_FIELDS } from "@/lib/site-content";
import { Chevron } from "./icons";

const GROUPS = Array.from(new Set(CONTENT_FIELDS.map((f) => f.group)));

export function AdminContentSection({ contentAwal }: { contentAwal: Record<string, string> }) {
  const [values, setValues] = useState(contentAwal);
  const [savedValues, setSavedValues] = useState(contentAwal);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirtyKeys = Object.keys(values).filter((key) => values[key] !== savedValues[key]);

  async function handleSave() {
    if (dirtyKeys.length === 0) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updates: Record<string, string> = {};
      for (const key of dirtyKeys) updates[key] = values[key];
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal menyimpan konten.");
        return;
      }
      setSavedValues(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-extrabold text-ink">Konten landing page</h2>
        {dirtyKeys.length > 0 && (
          <span className="text-sm text-ink-soft">{dirtyKeys.length} field berubah</span>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Ubah teks yang tampil di halaman utama. Perubahan langsung tayang setelah disimpan.
      </p>

      <div className="mt-3 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
        {GROUPS.map((group) => {
          const fields = CONTENT_FIELDS.filter((f) => f.group === group);
          const isOpen = expanded === group;
          return (
            <div key={group}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : group)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-bold text-ink">{group}</span>
                <Chevron className={`h-4 w-4 text-ink-soft transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="space-y-3 px-5 pb-5">
                  {fields.map((field) => (
                    <label key={field.key} className="block">
                      <span className="mb-1 block text-xs font-semibold text-ink-soft">
                        {field.label}
                      </span>
                      {field.multiline ? (
                        <textarea
                          value={values[field.key] ?? ""}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          rows={3}
                          className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink"
                        />
                      ) : (
                        <input
                          value={values[field.key] ?? ""}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink"
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-[#B34434]">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={dirtyKeys.length === 0 || saving}
        className="mt-4 rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "Menyimpan..." : saved ? "Tersimpan" : "Simpan Perubahan"}
      </button>
    </section>
  );
}
