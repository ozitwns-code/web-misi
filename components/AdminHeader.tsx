"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteLogo } from "./SiteLogo";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/members", label: "Data Member" },
];

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
            <SiteLogo className="h-4 w-4 object-cover" />
          </span>
          <span className="text-[0.95rem] font-bold tracking-tight text-ink">
            Rebahancuan <span className="font-medium text-ink-soft">admin</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  active ? "bg-teal-light/60 text-teal-dark" : "text-ink-soft hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <LogoutButton endpoint="/api/admin/logout" redirectTo="/admin/login" />
      </div>
    </header>
  );
}
