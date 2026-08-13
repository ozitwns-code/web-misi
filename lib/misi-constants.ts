import { prisma } from "@/lib/db";

/** Delay minimum (ms) sejak "Kerjakan" diklik sebelum misi berlink boleh dianggap selesai. */
export const MISI_MIN_DELAY_MS = 4000;

function awalHariIni() {
  const awal = new Date();
  awal.setUTCHours(0, 0, 0, 0);
  return awal;
}

/** Hitung berapa slot misi (dengan kuota harian) yang sudah diklaim hari ini. */
export async function hitungKlaimHariIni(misiId: string) {
  return prisma.progressMisi.count({
    where: { misi_id: misiId, created_at: { gte: awalHariIni() } },
  });
}

/** true kalau kuota harian misi ini sudah penuh (kuotaHarian null = tanpa batas). */
export async function kuotaHarianTerpenuhi(misiId: string, kuotaHarian: number | null) {
  if (kuotaHarian === null) return false;
  const klaim = await hitungKlaimHariIni(misiId);
  return klaim >= kuotaHarian;
}

/** Peta misi_id -> apakah kuota harian misi itu sudah penuh, dihitung sekali untuk banyak misi. */
export async function buildKuotaPenuhMap(
  misiList: { id: string; kuota_harian: number | null }[],
) {
  const misiDenganKuota = misiList.filter(
    (m): m is { id: string; kuota_harian: number } => m.kuota_harian !== null,
  );
  if (misiDenganKuota.length === 0) return new Map<string, boolean>();

  const counts = await prisma.progressMisi.groupBy({
    by: ["misi_id"],
    where: {
      misi_id: { in: misiDenganKuota.map((m) => m.id) },
      created_at: { gte: awalHariIni() },
    },
    _count: { _all: true },
  });
  const jumlahKlaim = new Map(counts.map((c) => [c.misi_id, c._count._all]));

  return new Map(
    misiDenganKuota.map((m) => [m.id, (jumlahKlaim.get(m.id) ?? 0) >= m.kuota_harian]),
  );
}

export type SurveiPertanyaan = {
  id: string;
  text: string;
  options: string[];
};

export function parseSurveiPertanyaan(raw: string | null): SurveiPertanyaan[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isJawabanValid(
  pertanyaan: SurveiPertanyaan[],
  jawaban: unknown,
): jawaban is Record<string, string> {
  if (!jawaban || typeof jawaban !== "object") return false;
  const record = jawaban as Record<string, unknown>;
  return pertanyaan.every((q) => {
    const val = record[q.id];
    return typeof val === "string" && q.options.includes(val);
  });
}
