"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton({
  endpoint = "/api/auth/logout",
  redirectTo = "/login",
}: {
  endpoint?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch(endpoint, { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-60"
    >
      {loading ? "Keluar..." : "Keluar"}
    </button>
  );
}
