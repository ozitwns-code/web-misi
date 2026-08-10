import { CalendarCheck, CheckDouble, HandCoins, UsersTwo, WalletIcon } from "./icons";

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

function angka(n: number) {
  return n.toLocaleString("id-ID");
}

export type AdminStats = {
  totalUser: number;
  totalUserAktifMisi: number;
  totalMisiSelesai: number;
  totalSaldoTertahan: number;
  totalSaldoDicairkan: number;
};

export function AdminStatsSection({ stats }: { stats: AdminStats }) {
  const cards = [
    {
      label: "Total user terdaftar",
      value: angka(stats.totalUser),
      icon: UsersTwo,
    },
    {
      label: "User sudah kerjain misi",
      value: angka(stats.totalUserAktifMisi),
      icon: CheckDouble,
    },
    {
      label: "Total misi selesai",
      value: angka(stats.totalMisiSelesai),
      icon: CalendarCheck,
    },
    {
      label: "Saldo tertahan (belum cair)",
      value: rupiah(stats.totalSaldoTertahan),
      icon: WalletIcon,
    },
    {
      label: "Saldo sudah dicairkan",
      value: rupiah(stats.totalSaldoDicairkan),
      icon: HandCoins,
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-extrabold text-ink">Statistik</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl bg-bubble px-4 py-4 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-light text-teal-dark">
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-2.5 text-xl font-extrabold text-ink">{value}</p>
            <p className="mt-0.5 text-xs text-ink-soft">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
