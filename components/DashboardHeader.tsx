"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ClipboardList,
  CloseIcon,
  HouseIcon,
  MenuIcon,
  UserCircle,
  WalletIcon,
} from "./icons";
import { SiteLogo } from "./SiteLogo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: HouseIcon },
  { href: "/dashboard/misi", label: "Misi", icon: ClipboardList },
  { href: "/dashboard/dompet", label: "Dompet", icon: WalletIcon },
  { href: "/dashboard/profil", label: "Profil", icon: UserCircle },
];

const MENU_ITEMS = [
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#faq", label: "FAQ" },
  { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
            <SiteLogo className="h-4 w-4 object-cover" />
          </span>
          <span className="text-[0.95rem] font-bold tracking-tight text-ink">
            Rebahancuan
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
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

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu lainnya"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
          >
            {open ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
          {open && (
            <div className="absolute right-0 top-11 w-52 rounded-2xl bg-bubble p-1.5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
