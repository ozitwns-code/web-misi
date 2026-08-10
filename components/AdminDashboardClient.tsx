"use client";

import { useState } from "react";

export type PendingReferral = {
  id: string;
  pengundangNama: string;
  pengundangNoWa: string;
  userBaruNama: string;
  userBaruNoWa: string;
  userBaruIp: string | null;
  nominalDidapat: number;
  createdAt: string;
};

export type PencairanItem = {
  id: string;
  nama: string;
  noWa: string;
  jumlah: number;
  status: "diminta" | "disetujui";
  tanggalDiminta: string;
};

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

function tanggalIndo(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminDashboardClient({
  pendingReferralsAwal,
  pencairanAwal,
}: {
  pendingReferralsAwal: PendingReferral[];
  pencairanAwal: PencairanItem[];
}) {
  const [referrals, setReferrals] = useState(pendingReferralsAwal);
  const [pencairan, setPencairan] = useState(pencairanAwal);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleReferralAction(id: string, action: "approve" | "reject") {
    setPendingKey(id);
    setErrorKey(null);
    try {
      const res = await fetch(`/api/admin/referral/${id}/${action}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setErrorKey(id);
        setErrorMessage(data.error ?? "Gagal memproses referral.");
        return;
      }
      setReferrals((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setErrorKey(id);
      setErrorMessage("Koneksi bermasalah. Coba lagi.");
    } finally {
      setPendingKey(null);
    }
  }

  async function handlePencairanAction(
    id: string,
    action: "approve" | "reject" | "selesai",
    nextStatus: "disetujui" | null,
  ) {
    setPendingKey(id);
    setErrorKey(null);
    try {
      const res = await fetch(`/api/admin/pencairan/${id}/${action}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setErrorKey(id);
        setErrorMessage(data.error ?? "Gagal memproses pencairan.");
        return;
      }
      if (nextStatus) {
        setPencairan((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)),
        );
      } else {
        setPencairan((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      setErrorKey(id);
      setErrorMessage("Koneksi bermasalah. Coba lagi.");
    } finally {
      setPendingKey(null);
    }
  }

  const menungguReview = pencairan.filter((p) => p.status === "diminta");
  const menungguTransfer = pencairan.filter((p) => p.status === "disetujui");

  return (
    <div className="space-y-10">
      {/* PENCAIRAN */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-extrabold text-ink">Pencairan — menunggu review</h2>
          <span className="text-sm text-ink-soft">{menungguReview.length} menunggu</span>
        </div>

        <div className="mt-3 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
          {menungguReview.length === 0 && (
            <p className="px-5 py-6 text-sm text-ink-soft">
              Nggak ada pengajuan pencairan yang nunggu direview.
            </p>
          )}
          {menungguReview.map((p) => {
            const isPending = pendingKey === p.id;
            return (
              <div key={p.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{p.nama}</p>
                    <p className="text-sm text-ink-soft">
                      {p.noWa} · diajukan {tanggalIndo(p.tanggalDiminta)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-teal-dark">{rupiah(p.jumlah)}</span>
                </div>
                {errorKey === p.id && errorMessage && (
                  <p role="alert" className="mt-2 text-sm font-medium text-[#B34434]">
                    {errorMessage}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handlePencairanAction(p.id, "approve", "disetujui")}
                    disabled={isPending}
                    className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? "Menyimpan..." : "Setujui"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePencairanAction(p.id, "reject", null)}
                    disabled={isPending}
                    className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-bold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-extrabold text-ink">Pencairan — sudah disetujui, tunggu transfer</h2>
          <span className="text-sm text-ink-soft">{menungguTransfer.length} menunggu</span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          Transfer manual dulu (m-banking/e-wallet), baru tandai selesai di sini.
        </p>

        <div className="mt-3 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
          {menungguTransfer.length === 0 && (
            <p className="px-5 py-6 text-sm text-ink-soft">
              Nggak ada pencairan yang menunggu transfer.
            </p>
          )}
          {menungguTransfer.map((p) => {
            const isPending = pendingKey === p.id;
            return (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-bold text-ink">{p.nama}</p>
                  <p className="text-sm text-ink-soft">
                    {p.noWa} · diajukan {tanggalIndo(p.tanggalDiminta)}
                  </p>
                  {errorKey === p.id && errorMessage && (
                    <p role="alert" className="mt-1 text-sm font-medium text-[#B34434]">
                      {errorMessage}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-teal-dark">{rupiah(p.jumlah)}</span>
                  <button
                    type="button"
                    onClick={() => handlePencairanAction(p.id, "selesai", null)}
                    disabled={isPending}
                    className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? "Menyimpan..." : "Tandai Selesai"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* REFERRAL REVIEW */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-extrabold text-ink">Referral perlu direview</h2>
          <span className="text-sm text-ink-soft">{referrals.length} menunggu</span>
        </div>

        <div className="mt-3 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
          {referrals.length === 0 && (
            <p className="px-5 py-6 text-sm text-ink-soft">
              Nggak ada referral yang perlu direview.
            </p>
          )}
          {referrals.map((r) => {
            const isPending = pendingKey === r.id;
            return (
              <div key={r.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">
                      {r.pengundangNama}{" "}
                      <span className="font-normal text-ink-soft">mengundang</span>{" "}
                      {r.userBaruNama}
                    </p>
                    <p className="text-sm text-ink-soft">
                      {r.userBaruNoWa} · IP {r.userBaruIp ?? "tidak diketahui"} ·{" "}
                      {tanggalIndo(r.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-teal-dark">
                    {rupiah(r.nominalDidapat)}
                  </span>
                </div>
                {errorKey === r.id && errorMessage && (
                  <p role="alert" className="mt-2 text-sm font-medium text-[#B34434]">
                    {errorMessage}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleReferralAction(r.id, "approve")}
                    disabled={isPending}
                    className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-paper transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? "Menyimpan..." : "Setujui"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReferralAction(r.id, "reject")}
                    disabled={isPending}
                    className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-bold text-ink-soft transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
