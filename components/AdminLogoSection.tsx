"use client";

import { useRef, useState } from "react";

export function AdminLogoSection() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [logoVersion, setLogoVersion] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSaved(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/site-asset/logo", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal upload logo.");
        return;
      }
      setSaved(true);
      setFile(null);
      setPreview(null);
      setLogoVersion((v) => v + 1);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  async function handleReset() {
    setUploading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/site-asset/logo", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Gagal mengembalikan logo default.");
        return;
      }
      setLogoVersion((v) => v + 1);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-extrabold text-ink">Logo & branding</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Logo ini dipakai di header, footer, dan halaman login/daftar. Upload gambar persegi
        (mis. 512×512) — PNG, JPEG, WebP, atau SVG, maksimal 2MB.
      </p>

      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber text-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview ?? `/api/site-asset/logo?v=${logoVersion}`}
            alt="Logo saat ini"
            className="h-8 w-8 object-contain"
          />
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-teal-light file:px-3.5 file:py-1.5 file:text-sm file:font-semibold file:text-teal-dark"
          />
          {error && (
            <p role="alert" className="text-sm font-medium text-[#B34434]">
              {error}
            </p>
          )}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {uploading ? "Menyimpan..." : saved ? "Tersimpan" : "Ganti Logo"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={uploading}
              className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-bold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-70"
            >
              Kembalikan ke default
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
