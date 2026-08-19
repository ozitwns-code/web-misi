"use client";

import { useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";
import { UserCircle } from "./icons";

function tanggalIndo(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

export function ProfilClient({
  nama,
  noWa,
  tanggalDaftar,
  kodeReferral,
  referralCount,
  totalRewardReferral,
}: {
  nama: string;
  noWa: string;
  tanggalDaftar: string;
  kodeReferral: string;
  referralCount: number;
  totalRewardReferral: number;
}) {
  const [referralLink, setReferralLink] = useState("");
  useEffect(() => {
    setReferralLink(`${window.location.origin}/ref/${kodeReferral}`);
  }, [kodeReferral]);

  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia; link tetap bisa disalin manual dari field
    }
  }

  return (
    <div className="space-y-8">
      {/* AKUN */}
      <section className="rounded-2xl bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-light text-teal-dark">
            <UserCircle className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold text-ink">{nama}</p>
            <p className="text-sm text-ink-soft">{noWa}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          Bergabung sejak {tanggalIndo(tanggalDaftar)}
        </p>
      </section>

      {/* REFERRAL */}
      <section className="rounded-2xl bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
        <h2 className="text-lg font-extrabold text-ink">Referral Saya</h2>
        <p className="mt-1 text-sm text-ink-soft">Bagikan link ini buat ajak teman.</p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={referralLink}
            className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink-soft"
            onFocus={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark"
          >
            {copied ? "Tersalin!" : "Salin link"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-paper px-4 py-3">
            <p className="text-xl font-extrabold text-ink">{referralCount}</p>
            <p className="text-xs text-ink-soft">Orang sudah gabung</p>
          </div>
          <div className="rounded-xl bg-paper px-4 py-3">
            <p className="text-xl font-extrabold text-ink">{rupiah(totalRewardReferral)}</p>
            <p className="text-xs text-ink-soft">Reward dari referral</p>
          </div>
        </div>
      </section>

      <LogoutButton />
    </div>
  );
}
