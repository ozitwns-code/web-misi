import type { Misi, ProgressMisi } from "@/app/generated/prisma/client";
import { parseSurveiPertanyaan, type SurveiPertanyaan } from "@/lib/misi-constants";

export type MisiItem = {
  id: string;
  judul: string;
  deskripsi: string;
  nominal_reward: number;
  tipe: string;
  target_url: string | null;
  perlu_survei: boolean;
  survei_pertanyaan: SurveiPertanyaan[];
  status: "belum" | "survei_selesai" | "menunggu" | "selesai";
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  kuota_penuh: boolean;
  cta_label: string | null;
  estimasi_menit: number | null;
};

export type PencairanAktif = {
  jumlah: number;
  status: "diminta" | "disetujui";
} | null;

export function toMisiItem(
  misi: Misi,
  progress: ProgressMisi | undefined,
  kuotaPenuh = false,
): MisiItem {
  const status: MisiItem["status"] =
    progress?.status === "selesai"
      ? "selesai"
      : progress?.status === "menunggu"
        ? "menunggu"
        : progress?.status === "survei_selesai"
          ? "survei_selesai"
          : "belum";
  return {
    id: misi.id,
    judul: misi.judul,
    deskripsi: misi.deskripsi,
    nominal_reward: misi.nominal_reward,
    tipe: misi.tipe,
    target_url: misi.target_url,
    perlu_survei: misi.perlu_survei,
    survei_pertanyaan: parseSurveiPertanyaan(misi.survei_pertanyaan),
    status,
    tanggal_mulai: progress?.tanggal_mulai?.toISOString() ?? null,
    tanggal_selesai: progress?.tanggal_selesai?.toISOString() ?? null,
    kuota_penuh: kuotaPenuh,
    cta_label: misi.cta_label,
    estimasi_menit: misi.estimasi_menit,
  };
}
