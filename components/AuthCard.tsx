import Link from "next/link";
import { ReactNode } from "react";
import { SiteLogo } from "./SiteLogo";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
            <SiteLogo className="h-4 w-4 object-contain" />
          </span>
          <span className="text-[0.95rem] font-bold tracking-tight text-ink">
            Rebahancuan
          </span>
        </Link>

        <div className="rounded-2xl bg-bubble px-6 py-8 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
          <h1 className="text-xl font-extrabold text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-5 text-center text-sm text-ink-soft">{footer}</p>
      </div>
    </main>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/30 disabled:opacity-60";

export { inputClass };
