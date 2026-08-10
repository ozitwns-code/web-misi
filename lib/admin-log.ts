import { prisma } from "@/lib/db";

export type AdminAksi =
  | "approve_referral"
  | "reject_referral"
  | "approve_pencairan"
  | "reject_pencairan"
  | "selesai_pencairan"
  | "edit_misi"
  | "update_content"
  | "update_logo"
  | "reset_logo";

export async function catatLogAdmin(aksi: AdminAksi, keterangan: string) {
  await prisma.adminLog.create({ data: { aksi, keterangan } });
}
