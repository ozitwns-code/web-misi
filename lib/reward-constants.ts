export const REFERRAL_TIER_LIMIT = 50;
export const REFERRAL_REWARD_EARLY = 1000;
export const REFERRAL_REWARD_LATE = 50;

/** Minimum jumlah per pengajuan pencairan. Tidak ada batas maksimal saldo maupun jumlah pengajuan. */
export const MINIMAL_PENCAIRAN = 200000;

/** Reward pengundang: Rp1.000 untuk 50 referral pertama, lalu Rp50 tanpa batas jumlah. */
export function computeReferralReward(referralCountSoFar: number) {
  return referralCountSoFar < REFERRAL_TIER_LIMIT
    ? REFERRAL_REWARD_EARLY
    : REFERRAL_REWARD_LATE;
}
