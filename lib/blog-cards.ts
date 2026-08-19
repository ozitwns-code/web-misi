export type BlogCard = {
  kategori: string;
  judul: string;
  href: string;
};

/** Tambah objek baru di sini kalau mau nambah card di section "Blog & Info Cuan". */
export const BLOG_CARDS: BlogCard[] = [
  {
    kategori: "TIPS CUAN",
    judul: "Misi Rebahancuan habis? Cek info baru di channel Telegram",
    href: "https://t.me/rebahancuanbray",
  },
  {
    kategori: "INFO GRATISAN",
    judul: "Jajanan gratis tiap hari, cek channel Jajan Gratisan",
    href: "https://t.me/jajangratisan",
  },
];
