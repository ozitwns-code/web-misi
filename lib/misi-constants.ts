/** Delay minimum (ms) sejak "Kerjakan" diklik sebelum misi berlink boleh dianggap selesai. */
export const MISI_MIN_DELAY_MS = 4000;

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
