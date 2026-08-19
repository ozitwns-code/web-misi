import type { SurveiPertanyaan } from "@/lib/misi-constants";

export const MISI_TIPE_VALID = ["baca", "share", "sosial", "checkin", "survei"];

export type MisiInputValid = {
  judul: string;
  deskripsi: string;
  nominal_reward: number;
  tipe: string;
  target_url: string | null;
  perlu_survei: boolean;
  survei_pertanyaan: string | null;
  kuota_harian: number | null;
  aktif: boolean;
  cta_label: string | null;
};

export function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validatePertanyaan(raw: unknown): SurveiPertanyaan[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const hasil: SurveiPertanyaan[] = [];
  for (const q of raw) {
    if (typeof q !== "object" || q === null) return null;
    const { id, text, options, tipe } = q as Record<string, unknown>;
    if (typeof id !== "string" || id.trim().length === 0) return null;
    if (typeof text !== "string" || text.trim().length === 0) return null;
    const tipeBersih = tipe === "teks" ? "teks" : "pilihan";
    if (tipeBersih === "teks") {
      hasil.push({ id: id.trim(), text: text.trim(), tipe: "teks", options: [] });
      continue;
    }
    if (!Array.isArray(options) || options.length < 2) return null;
    const optionsBersih = options.map((o) => (typeof o === "string" ? o.trim() : ""));
    if (optionsBersih.some((o) => o.length === 0)) return null;
    hasil.push({ id: id.trim(), text: text.trim(), tipe: "pilihan", options: optionsBersih });
  }
  return hasil;
}

/** Validasi payload create/update misi dari admin. Return { error } atau { data }. */
export function validateMisiInput(
  body: Record<string, unknown>,
): { error: string } | { data: MisiInputValid } {
  const {
    judul,
    deskripsi,
    nominal_reward,
    tipe,
    target_url,
    perlu_survei,
    survei_pertanyaan,
    kuota_harian,
    aktif,
    cta_label,
  } = body;

  if (typeof judul !== "string" || judul.trim().length < 2) {
    return { error: "Judul minimal 2 karakter." };
  }
  if (typeof deskripsi !== "string" || deskripsi.trim().length < 2) {
    return { error: "Deskripsi minimal 2 karakter." };
  }
  if (typeof nominal_reward !== "number" || !Number.isInteger(nominal_reward) || nominal_reward <= 0) {
    return { error: "Nominal reward harus angka bulat positif." };
  }
  if (typeof tipe !== "string" || !MISI_TIPE_VALID.includes(tipe)) {
    return { error: "Jenis misi tidak valid." };
  }
  if (typeof aktif !== "boolean") {
    return { error: "Status aktif tidak valid." };
  }

  let targetUrlBersih: string | null = null;
  if (typeof target_url === "string" && target_url.trim().length > 0) {
    const trimmed = target_url.trim();
    if (!isValidUrl(trimmed)) {
      return { error: "Link tidak valid. Pakai URL lengkap (https://...)." };
    }
    targetUrlBersih = trimmed;
  }

  const perluSurveiBersih = perlu_survei === true;
  let surveiPertanyaanBersih: string | null = null;
  if (perluSurveiBersih) {
    const pertanyaan = validatePertanyaan(survei_pertanyaan);
    if (!pertanyaan) {
      return {
        error: "Survei perlu minimal 1 pertanyaan, masing-masing dengan minimal 2 opsi jawaban.",
      };
    }
    surveiPertanyaanBersih = JSON.stringify(pertanyaan);
  }

  let kuotaHarianBersih: number | null = null;
  if (kuota_harian !== null && kuota_harian !== undefined && kuota_harian !== "") {
    if (typeof kuota_harian !== "number" || !Number.isInteger(kuota_harian) || kuota_harian <= 0) {
      return { error: "Kuota harian harus angka bulat positif, atau kosongkan untuk tanpa batas." };
    }
    kuotaHarianBersih = kuota_harian;
  }

  let ctaLabelBersih: string | null = null;
  if (typeof cta_label === "string" && cta_label.trim().length > 0) {
    ctaLabelBersih = cta_label.trim();
  }

  return {
    data: {
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      nominal_reward,
      tipe,
      target_url: targetUrlBersih,
      perlu_survei: perluSurveiBersih,
      survei_pertanyaan: surveiPertanyaanBersih,
      kuota_harian: kuotaHarianBersih,
      aktif,
      cta_label: ctaLabelBersih,
    },
  };
}
