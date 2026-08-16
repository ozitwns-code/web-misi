"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard, FormField, inputClass } from "./AuthCard";

function bacaKodeReferralTersimpan(): string {
  const match = document.cookie.match(/(?:^|; )ref_code=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default function DaftarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get("ref") ?? "";

  const [nama, setNama] = useState("");
  const [noWa, setNoWa] = useState("");
  const [password, setPassword] = useState("");
  const [kodeReferral, setKodeReferral] = useState(refFromUrl);

  // Kalau nggak ada ?ref= di URL, coba pakai kode yang udah tersimpan dari
  // kunjungan sebelumnya (lihat proxy.ts) — biar tetap nempel walau user
  // sempat mampir ke halaman lain dulu sebelum daftar.
  useEffect(() => {
    if (refFromUrl) return;
    const tersimpan = bacaKodeReferralTersimpan();
    if (tersimpan) setKodeReferral(tersimpan);
  }, [refFromUrl]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          no_wa: noWa,
          password,
          kode_referral: kodeReferral || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal mendaftar. Coba lagi.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Daftar ke Rebahancuan"
      subtitle="Gratis. Isi data di bawah, langsung bisa mulai misi pertama."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-teal-dark underline decoration-teal/40 underline-offset-2">
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nama">
          <input
            className={inputClass}
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama kamu"
            autoComplete="name"
            required
            disabled={loading}
          />
        </FormField>

        <FormField label="Nomor WhatsApp">
          <input
            className={inputClass}
            type="tel"
            value={noWa}
            onChange={(e) => setNoWa(e.target.value)}
            placeholder="08xxxxxxxxxx"
            autoComplete="tel"
            required
            disabled={loading}
          />
        </FormField>

        <FormField label="Password">
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            minLength={8}
            required
            disabled={loading}
          />
        </FormField>

        <FormField label="Kode referral (opsional)">
          <input
            className={inputClass}
            type="text"
            value={kodeReferral}
            onChange={(e) => setKodeReferral(e.target.value.toUpperCase())}
            placeholder="Kode dari teman"
            disabled={loading}
          />
        </FormField>

        {error && (
          <p role="alert" className="text-sm font-medium text-[#B34434]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-teal px-4 py-3 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Mendaftarkan..." : "Daftar & Mulai Misi"}
        </button>
      </form>
    </AuthCard>
  );
}
