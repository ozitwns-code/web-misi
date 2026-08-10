"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard, FormField, inputClass } from "./AuthCard";

export default function LoginForm() {
  const router = useRouter();
  const [noWa, setNoWa] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no_wa: noWa, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal masuk. Coba lagi.");
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
      title="Masuk ke Rebahancuan"
      subtitle="Pakai nomor WhatsApp dan password yang kamu daftarkan."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-semibold text-teal-dark underline decoration-teal/40 underline-offset-2">
            Daftar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Password kamu"
            autoComplete="current-password"
            required
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
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </AuthCard>
  );
}
