import { prisma } from "@/lib/db";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa 0/O/1/I biar gampang dibaca
const CODE_LENGTH = 6;

function randomCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

export async function generateUniqueReferralCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode();
    const existing = await prisma.user.findUnique({
      where: { kode_referral_sendiri: code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  throw new Error("Gagal membuat kode referral unik, coba lagi.");
}

export { computeReferralReward, REFERRAL_TIER_LIMIT, REFERRAL_REWARD_EARLY, REFERRAL_REWARD_LATE } from "@/lib/reward-constants";
