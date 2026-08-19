import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { ProfilClient } from "@/components/ProfilClient";

export const metadata = {
  title: "Profil — Rebahancuan",
};

export default async function ProfilPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect("/api/auth/session-invalid");
  }

  const referralCount = await prisma.referralLog.count({
    where: { user_id_pengundang: userId },
  });

  return (
    <ProfilClient
      nama={user.nama}
      noWa={user.no_wa}
      tanggalDaftar={user.tanggal_daftar.toISOString()}
      kodeReferral={user.kode_referral_sendiri}
      referralCount={referralCount}
    />
  );
}
