import { DashboardHeader } from "@/components/DashboardHeader";
import { BottomNav } from "@/components/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      <main className="mx-auto max-w-2xl px-5 py-8 pb-28 sm:pb-8">{children}</main>
      <BottomNav />
    </>
  );
}
