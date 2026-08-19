export type ContentField = {
  key: string;
  group: string;
  label: string;
  multiline?: boolean;
  default: string;
};

export const CONTENT_FIELDS: ContentField[] = [
  // Header
  { key: "site.brand_name", group: "Header", label: "Nama merek (wordmark)", default: "Rebahancuan" },
  { key: "header.nav_cta_label", group: "Header", label: "Tombol nav kanan atas", default: "Daftar" },

  // Hero (chat thread)
  { key: "hero.bubble_1", group: "Hero — obrolan", label: "Bubble 1", multiline: true, default: "Woy, udah denger Rebahancuan? Cara beneran buat dapet uang cuma dari misi-misi ringan. 🙂" },
  { key: "hero.bubble_2", group: "Hero — obrolan", label: "Bubble 2", multiline: true, default: "Reward-nya nggak dibatasi. Tandai misi selesai, saldo langsung nambah — nggak pakai nunggu." },
  { key: "hero.bubble_3", group: "Hero — obrolan", label: "Bubble 3", multiline: true, default: "Sisanya dari ajak teman pakai link referral kamu, juga nggak dibatasi jumlahnya. Begitu saldo nyampe Rp200.000, langsung bisa dicairkan." },
  { key: "hero.bubble_4", group: "Hero — obrolan", label: "Bubble 4", multiline: true, default: "Misinya macem-macem, dari checkin sampe isi survei kilat. Tinggal pilih yang paling gampang buat kamu." },
  { key: "hero.pinned_title", group: "Hero — obrolan", label: "Judul pesan disematkan", default: "Daftar sekarang, misi pertama nunggu kamu." },
  { key: "hero.pinned_subtitle", group: "Hero — obrolan", label: "Subjudul pesan disematkan", default: "Gratis. Saldo langsung nambah begitu misi ditandai selesai." },
  { key: "hero.cta_label", group: "Hero — obrolan", label: "Tombol CTA hero", default: "Daftar & Mulai Misi" },

  // Ringkasan
  { key: "summary.heading", group: "Ringkasan", label: "Judul", multiline: true, default: "Kerjain misi ringan, reward tanpa batas langsung masuk saldo." },
  { key: "summary.subheading", group: "Ringkasan", label: "Subjudul", multiline: true, default: "Siapa saja boleh daftar dan langsung mulai. Begitu saldo minimal Rp200.000, ajukan pencairan ke rekening atau e-wallet kamu." },

  // Cara kerja
  { key: "carakerja.heading", group: "Jenis-jenis misi", label: "Judul section", default: "Jenis-jenis misi yang bisa kamu kerjain" },
  { key: "carakerja.intro", group: "Jenis-jenis misi", label: "Intro section", multiline: true, default: "Semuanya berputar di sekitar blog Secangkir Cerita — baca ceritanya, sebarkan ke orang lain, atau ajak teman buat ikut juga." },
  { key: "carakerja.misi_baca_judul", group: "Jenis-jenis misi", label: "Judul: Baca artikel", default: "Baca & interaksi artikel" },
  { key: "carakerja.misi_baca_deskripsi", group: "Jenis-jenis misi", label: "Deskripsi: Baca artikel", multiline: true, default: "Baca satu tulisan di blog, tinggalkan like atau komentar, terus tandai misinya selesai. Simpel, dan kamu beneran dapet bacaan yang enak." },
  { key: "carakerja.misi_share_judul", group: "Jenis-jenis misi", label: "Judul: Share sosial", default: "Share ke media sosial" },
  { key: "carakerja.misi_share_deskripsi", group: "Jenis-jenis misi", label: "Deskripsi: Share sosial", multiline: true, default: "Teruskan satu artikel ke Instagram, WhatsApp, atau TikTok kamu, tandai selesai, saldo langsung nambah." },
  { key: "carakerja.misi_referral_judul", group: "Jenis-jenis misi", label: "Judul: Ajak teman", default: "Ajak teman (referral)" },
  { key: "carakerja.misi_referral_deskripsi", group: "Jenis-jenis misi", label: "Deskripsi: Ajak teman", multiline: true, default: "Bagikan link ajakanmu. Begitu temanmu daftar lewat link itu, kamu langsung dapet reward referral." },
  { key: "carakerja.misi_survei_judul", group: "Jenis-jenis misi", label: "Judul: Isi survei", default: "Isi survei singkat" },
  { key: "carakerja.misi_survei_deskripsi", group: "Jenis-jenis misi", label: "Deskripsi: Isi survei", multiline: true, default: "Jawab beberapa pertanyaan singkat, lalu lanjut ke link tujuannya. Isi jawaban dengan jujur, dan kalau ada batas waktu pengisian, pastikan diselesaikan sebelum waktunya habis." },

  // Rincian reward
  { key: "reward.referral_card_title", group: "Rincian reward", label: "Judul kartu referral", default: "Ajak teman" },
  { key: "reward.referral_card_body", group: "Rincian reward", label: "Isi kartu referral", multiline: true, default: "Tiap kali ada teman daftar lewat link referral kamu, saldo kamu nambah. Nggak dibatasi jumlah temannya." },
  { key: "reward.minimal_label", group: "Rincian reward", label: "Label minimal pencairan", default: "Minimal pencairan" },

  // FAQ
  { key: "faq.heading", group: "FAQ", label: "Judul section", default: "Kenapa bisa dipercaya" },
  { key: "faq.q1", group: "FAQ", label: "Pertanyaan 1", default: "Ini beneran bukan penipuan?" },
  { key: "faq.a1", group: "FAQ", label: "Jawaban 1", multiline: true, default: "Daftar dan ngerjain misi di Rebahancuan gratis — nggak ada biaya pendaftaran atau biaya tersembunyi apa pun. Semua misi yang kamu selesaikan tercatat rapi di dashboard, bisa kamu cek kapan aja." },
  { key: "faq.q2", group: "FAQ", label: "Pertanyaan 2", default: "Kok saldo bisa langsung nambah tanpa dicek dulu?" },
  { key: "faq.a2", group: "FAQ", label: "Jawaban 2", multiline: true, default: "Nandain misi selesai emang self-report — kamu yang laporin sendiri. Tapi begitu kamu mau cairkan, admin yang review pengajuannya satu per satu sebelum uangnya beneran dikirim, jadi tetap ada pengecekan manusia di titik yang penting." },
  { key: "faq.q3", group: "FAQ", label: "Pertanyaan 3", default: "Reward-nya ditransfer ke mana?" },
  { key: "faq.a3", group: "FAQ", label: "Jawaban 3", multiline: true, default: "Begitu saldo kamu minimal Rp200.000, ajukan pencairan lewat dashboard (jumlahnya bebas, nggak ada batas atas). Admin review dulu, baru transfer manual — bank atau e-wallet, bukan lewat payment gateway otomatis." },
  { key: "faq.q4", group: "FAQ", label: "Pertanyaan 4", default: "Riwayat misi saya kelihatan nggak?" },
  { key: "faq.a4", group: "FAQ", label: "Jawaban 4", multiline: true, default: "Kelihatan. Semua misi yang udah kamu tandai selesai tercatat lengkap dengan tanggalnya di dashboard — transparan, bisa kamu lihat ulang kapan pun." },

  // Final CTA
  { key: "final_cta.title", group: "CTA penutup", label: "Judul", multiline: true, default: "Saldo langsung nambah begitu misi pertama kamu tandai selesai." },
  { key: "final_cta.button_label", group: "CTA penutup", label: "Tombol", default: "Daftar & Mulai Misi" },

  // Footer
  { key: "footer.text", group: "Footer", label: "Teks footer", multiline: true, default: "Pencairan reward langsung diproses ke rekening/e-wallet kamu." },
];

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_FIELDS.map((f) => [f.key, f.default]),
);

export function buildContentMap(rows: { key: string; value: string }[]): Record<string, string> {
  const map = { ...CONTENT_DEFAULTS };
  for (const row of rows) {
    if (row.key in map) map[row.key] = row.value;
  }
  return map;
}
