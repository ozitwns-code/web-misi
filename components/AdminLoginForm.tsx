"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard, FormField, inputClass } from "./AuthCard";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal masuk.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Masuk sebagai admin"
      subtitle="Panel ini cuma buat admin Rebahancuan."
      footer={<span>Bukan admin? Kembali ke halaman utama.</span>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Password admin">
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password admin"
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
