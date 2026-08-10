import Link from "next/link";
import { SiteLogo } from "@/components/SiteLogo";

export const metadata = {
  title: "Syarat & Ketentuan — Rebahancuan",
};

const SECTIONS = [
  {
    title: "1. Ketentuan umum",
    body: "Rebahancuan adalah platform misi dengan reward — bukan produk investasi, bukan skema penghasilan pasif, dan tidak menjanjikan keuntungan berlipat. Reward yang kamu dapat murni hasil dari menyelesaikan misi yang tersedia dan mengajak orang lain bergabung, sesuai nominal yang tertera di tiap misi.",
  },
  {
    title: "2. Syarat peserta",
    body: "Peserta minimal berusia 17 tahun. Setiap orang hanya boleh memiliki satu akun. Data yang didaftarkan (nama, nomor WhatsApp) harus data asli dan valid — dipakai untuk verifikasi identitas dan proses pencairan reward.",
  },
  {
    title: "3. Mekanisme reward",
    body: "Saldo bertambah begitu kamu menandai misi selesai, atau saat orang yang kamu ajak lewat link referral berhasil daftar. Reward bisa dicairkan setelah saldo mencapai minimal Rp200.000 per pengajuan, tanpa batas maksimal. Karena transfer dilakukan manual oleh admin (bukan lewat payment gateway otomatis), proses pencairan butuh waktu — bukan instan begitu diajukan.",
  },
  {
    title: "4. Larangan kecurangan",
    body: "Dilarang membuat akun ganda, menggunakan bot/skrip otomatis, atau memanipulasi IP (termasuk lewat VPN) untuk merekayasa jumlah referral atau penyelesaian misi. Akun yang terindikasi melakukan hal ini bisa ditangguhkan (suspend), dan reward yang didapat dari aktivitas curang bisa dibatalkan.",
  },
  {
    title: "5. Hak platform",
    body: "Rebahancuan berhak mengubah nominal reward, menambah/menghapus jenis misi, atau menghentikan layanan sewaktu-waktu, dengan pemberitahuan lebih dulu kepada pengguna melalui platform.",
  },
  {
    title: "6. Privasi data",
    body: "Data yang kamu berikan (nomor WhatsApp, data rekening/e-wallet) hanya dipakai untuk keperluan verifikasi akun dan proses pencairan reward. Data ini tidak dijual atau dibagikan ke pihak ketiga untuk kepentingan komersial.",
  },
  {
    title: "7. Batasan tanggung jawab",
    body: "Rebahancuan tidak bertanggung jawab atas kegagalan transfer yang disebabkan oleh data rekening/e-wallet yang salah atau tidak lengkap dari pengguna. Pastikan data pembayaran di halaman Dompet selalu benar dan terbaru sebelum mengajukan pencairan.",
  },
  {
    title: "8. Perubahan syarat",
    body: "Syarat & Ketentuan ini bisa berubah sewaktu-waktu mengikuti perkembangan layanan. Versi yang berlaku adalah versi yang tampil di halaman ini.",
  },
];

export default function SyaratKetentuanPage() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
              <SiteLogo className="h-4 w-4 object-contain" />
            </span>
            <span className="text-[0.95rem] font-bold tracking-tight text-ink">
              Rebahancuan
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-12">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Syarat & Ketentuan</h1>
        <p className="mt-3 text-ink-soft">
          Berlaku untuk semua pengguna Rebahancuan. Dengan mendaftar dan menggunakan platform ini,
          kamu dianggap sudah membaca dan menyetujui ketentuan berikut.
        </p>

        <div className="mt-8 space-y-6">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]"
            >
              <h2 className="font-bold text-ink">{section.title}</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
