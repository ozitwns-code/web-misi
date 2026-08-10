import { prisma } from "@/lib/db";

/** Jendela waktu & ambang batas pendaftaran per IP sebelum referral ditahan untuk review. */
export const ANTIBOT_WINDOW_MINUTES = 60;
export const ANTIBOT_MAX_REGISTRATIONS_PER_WINDOW = 3;

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/** true kalau IP ini sudah dipakai daftar >= ambang batas dalam jendela waktu terakhir. */
export async function isIpSuspicious(ip: string): Promise<boolean> {
  if (ip === "unknown") return false;

  const since = new Date(Date.now() - ANTIBOT_WINDOW_MINUTES * 60 * 1000);
  const recentCount = await prisma.user.count({
    where: {
      ip_daftar: ip,
      tanggal_daftar: { gte: since },
    },
  });

  return recentCount >= ANTIBOT_MAX_REGISTRATIONS_PER_WINDOW;
}
