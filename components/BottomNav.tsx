"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HouseIcon, ClipboardList, WalletIcon, UserCircle } from "./icons";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: HouseIcon },
  { href: "/dashboard/misi", label: "Misi", icon: ClipboardList },
  { href: "/dashboard/dompet", label: "Dompet", icon: WalletIcon },
  { href: "/dashboard/profil", label: "Profil", icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/[0.06] bg-paper/95 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-2xl items-stretch justify-between px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[0.7rem] font-semibold transition-colors ${
                active ? "text-teal-dark" : "text-ink-soft"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
