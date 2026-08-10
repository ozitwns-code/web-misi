import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, sessionCookieOptions, signSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { generateUniqueReferralCode } from "@/lib/referral";
import { computeReferralReward } from "@/lib/reward-constants";
import { getClientIp, isIpSuspicious } from "@/lib/antibot";
import { isValidNama, isValidNoWa, isValidPassword, normalizeNoWa } from "@/lib/validate";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const { nama, no_wa, password, kode_referral } = (body ?? {}) as Record<string, unknown>;

  if (typeof nama !== "string" || !isValidNama(nama)) {
    return NextResponse.json({ error: "Nama minimal 2 karakter." }, { status: 400 });
  }
  if (typeof no_wa !== "string" || !isValidNoWa(normalizeNoWa(no_wa))) {
    return NextResponse.json(
      { error: "Nomor WA tidak valid. Gunakan angka saja, 9-15 digit." },
      { status: 400 },
    );
  }
  if (typeof password !== "string" || !isValidPassword(password)) {
    return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 });
  }

  const noWaNormalized = normalizeNoWa(no_wa);

  const existing = await prisma.user.findUnique({ where: { no_wa: noWaNormalized } });
  if (existing) {
    return NextResponse.json({ error: "Nomor WA sudah terdaftar." }, { status: 409 });
  }

  let referrer: { id: string } | null = null;
  if (typeof kode_referral === "string" && kode_referral.trim().length > 0) {
    referrer = await prisma.user.findUnique({
      where: { kode_referral_sendiri: kode_referral.trim().toUpperCase() },
      select: { id: true },
    });
  }

  const clientIp = getClientIp(request);
  const suspicious = referrer ? await isIpSuspicious(clientIp) : false;

  const password_hash = await hashPassword(password);
  const kode_referral_sendiri = await generateUniqueReferralCode();

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        nama: nama.trim(),
        no_wa: noWaNormalized,
        password_hash,
        kode_referral_sendiri,
        direferensikan_oleh: referrer?.id ?? null,
        ip_daftar: clientIp,
      },
    });

    if (referrer) {
      const approvedCountSoFar = await tx.referralLog.count({
        where: { user_id_pengundang: referrer.id, status: "approved" },
      });
      const reward = computeReferralReward(approvedCountSoFar);

      await tx.referralLog.create({
        data: {
          user_id_pengundang: referrer.id,
          user_id_baru: created.id,
          nominal_didapat: reward,
          status: suspicious ? "pending_review" : "approved",
        },
      });

      if (!suspicious) {
        await tx.user.update({
          where: { id: referrer.id },
          data: { saldo_reward: { increment: reward } },
        });
      }
    }

    return created;
  });

  const token = await signSessionToken(user.id);
  const response = NextResponse.json(
    { id: user.id, nama: user.nama, kode_referral_sendiri: user.kode_referral_sendiri },
    { status: 201 },
  );
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
