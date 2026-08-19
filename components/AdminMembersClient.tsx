"use client";

import { useState } from "react";
import { Chevron } from "./icons";

export type MemberAdmin = {
  id: string;
  nama: string;
  noWa: string;
  tanggalDaftar: string;
  direferensikanOlehNama: string | null;
  jumlahDireferralkan: number;
  saldoReward: number;
};

type RiwayatMisiItem = { judul: string; nominalReward: number; tanggalSelesai: string };
type DireferralkanItem = { id: string; nama: string; noWa: string; tanggalDaftar: string };
type MemberDetail = { riwayatMisi: RiwayatMisiItem[]; direferralkan: DireferralkanItem[] };

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

function tanggalIndo(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminMembersClient({ membersAwal }: { membersAwal: MemberAdmin[] }) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, MemberDetail>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const filtered = membersAwal.filter((m) =>
    `${m.nama} ${m.noWa}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  async function handleToggle(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (detailCache[id]) return;

    setLoadingId(id);
    setErrorId(null);
    try {
      const res = await fetch(`/api/admin/members/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setErrorId(id);
        return;
      }
      setDetailCache((prev) => ({ ...prev, [id]: data }));
    } catch {
      setErrorId(id);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section>
      <h2 className="text-lg font-extrabold text-ink">Data Member</h2>
      <p className="mt-1 text-sm text-ink-soft">{membersAwal.length} member terdaftar.</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari nama atau nomor WA..."
        className="mt-4 w-full rounded-xl border border-ink/15 bg-bubble px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal"
      />

      <div className="mt-3 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
        {filtered.length === 0 && (
          <p className="px-5 py-6 text-sm text-ink-soft">Nggak ada member yang cocok.</p>
        )}
        {filtered.map((m) => {
          const expanded = expandedId === m.id;
          const detail = detailCache[m.id];
          return (
            <div key={m.id}>
              <button
                type="button"
                onClick={() => handleToggle(m.id)}
                className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
              >
                <div className="min-w-0">
                  <p className="font-bold text-ink">{m.nama}</p>
                  <p className="text-sm text-ink-soft">{m.noWa}</p>
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-ink-soft">
                    <span>Daftar: {tanggalIndo(m.tanggalDaftar)}</span>
                    <span>Referral: {m.direferensikanOlehNama ?? "-"}</span>
                    <span>Ngajak: {m.jumlahDireferralkan} orang</span>
                    <span>Saldo: {rupiah(m.saldoReward)}</span>
                  </div>
                </div>
                <Chevron
                  className={`mt-1 h-4 w-4 shrink-0 text-ink-soft transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>

              {expanded && (
                <div className="border-t border-ink/[0.08] bg-paper/50 px-5 py-4">
                  {loadingId === m.id && (
                    <p className="text-sm text-ink-soft">Memuat detail...</p>
                  )}
                  {errorId === m.id && (
                    <p role="alert" className="text-sm font-medium text-[#B34434]">
                      Gagal memuat detail. Coba lagi.
                    </p>
                  )}
                  {detail && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-ink">
                          Misi selesai ({detail.riwayatMisi.length})
                        </h3>
                        {detail.riwayatMisi.length === 0 ? (
                          <p className="mt-1 text-sm text-ink-soft">Belum ada misi selesai.</p>
                        ) : (
                          <ul className="mt-1.5 space-y-1">
                            {detail.riwayatMisi.map((r, i) => (
                              <li
                                key={i}
                                className="flex items-center justify-between gap-3 text-sm"
                              >
                                <span className="min-w-0 truncate text-ink">{r.judul}</span>
                                <span className="whitespace-nowrap text-ink-soft">
                                  {rupiah(r.nominalReward)} · {tanggalIndo(r.tanggalSelesai)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-ink">
                          Direferralkan ({detail.direferralkan.length})
                        </h3>
                        {detail.direferralkan.length === 0 ? (
                          <p className="mt-1 text-sm text-ink-soft">Belum ada yang diajak.</p>
                        ) : (
                          <ul className="mt-1.5 space-y-1">
                            {detail.direferralkan.map((d) => (
                              <li
                                key={d.id}
                                className="flex items-center justify-between gap-3 text-sm"
                              >
                                <span className="min-w-0 truncate text-ink">
                                  {d.nama} · {d.noWa}
                                </span>
                                <span className="whitespace-nowrap text-ink-soft">
                                  {tanggalIndo(d.tanggalDaftar)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
