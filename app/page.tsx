import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckDouble,
  CoffeeMark,
  ForwardArrow,
  HandCoins,
  ShareNodes,
  ShieldCheck,
  UsersTwo,
} from "@/components/icons";
import {
  Bubble,
  ForwardedTag,
  PinnedBubble,
  ReadTick,
  ThreadHeader,
  TypingIndicator,
} from "@/components/Bubble";
import { FaqItem } from "@/components/FaqItem";

const misiAwal = [
  { label: "Share link produk digital ke WA Story", nominal: 5000 },
  { label: "Follow Instagram Secangkir Cerita", nominal: 5000 },
  { label: "Checkin harian pertama", nominal: 2000 },
  { label: "Baca & komentar artikel terbaru di blog", nominal: 10000 },
  { label: "Follow channel WhatsApp Secangkir Cerita", nominal: 8000 },
];
const misiAwalSubtotal = misiAwal.reduce((sum, m) => sum + m.nominal, 0);

const artikelAsli = [
  {
    judul: "Kenapa Ngobrol Sambil Ngopi Itu Menyembuhkan",
    url: "https://secangkircerita-id.blogspot.com/2026/08/kenapa-ngobrol-sambil-ngopi-itu.html",
  },
  {
    judul: "Cerita dari Warung Kopi Pinggir Jalan yang Selalu Ramai",
    url: "https://secangkircerita-id.blogspot.com/2026/08/cerita-dari-warung-kopi-pinggir-jalan.html",
  },
];

function rupiah(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
              <CoffeeMark className="h-4 w-4" />
            </span>
            <span className="text-[0.95rem] font-bold tracking-tight text-ink">
              Rebahancuan
              <span className="font-medium text-ink-soft"> × Secangkir Cerita</span>
            </span>
          </a>
          <Link
            href="/daftar"
            className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-dark"
          >
            Daftar
          </Link>
        </div>
      </header>

      <main id="top">
        {/* HERO — chat thread */}
        <section className="px-5 pb-20 pt-12 sm:pt-16">
          <div className="mx-auto max-w-thread">
            <ThreadHeader />

            <div className="flex flex-col items-start gap-2.5">
              <TypingIndicator delay={0} />
              <Bubble delay={900} className="motion-safe:opacity-0" time="09.41">
                Woy, udah denger <span className="font-semibold">Rebahancuan</span>?
                Cara beneran buat dapet uang cuma dari misi-misi ringan. 🙂
              </Bubble>
              <Bubble delay={1500} className="motion-safe:opacity-0" time="09.41">
                Reward-nya nggak dibatasi. Tandai misi selesai, saldo langsung
                nambah — nggak pakai nunggu.
              </Bubble>
              <Bubble delay={2100} className="motion-safe:opacity-0" time="09.42">
                Sisanya dari ajak teman pakai link referral kamu, juga nggak
                dibatasi jumlahnya. Begitu saldo nyampe Rp200.000, langsung
                bisa dicairkan.
              </Bubble>
              <Bubble delay={2700} className="motion-safe:opacity-0" time="09.42">
                <ForwardedTag />
                <p className="font-semibold">
                  Kenapa Ngobrol Sambil Ngopi Itu Menyembuhkan
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  secangkircerita-id.blogspot.com
                </p>
              </Bubble>
              <Bubble delay={3300} className="motion-safe:opacity-0" time="09.43">
                Misinya ya emang gitu — baca &amp; share tulisan-tulisan kayak ini
                dari blog Secangkir Cerita.
              </Bubble>

              <div id="mulai" className="w-full scroll-mt-24 pt-1.5">
                <PinnedBubble delay={3900}>
                  <p className="text-[1.05rem] font-bold leading-snug">
                    Daftar sekarang, misi pertama nunggu kamu.
                  </p>
                  <p className="mt-1 text-sm text-teal-light/90">
                    Gratis. Saldo langsung nambah begitu misi ditandai selesai.
                  </p>
                  <Link
                    href="/daftar"
                    className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-sm font-bold text-teal-dark transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper active:scale-[0.98]"
                  >
                    Daftar &amp; Mulai Misi
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </PinnedBubble>
              </div>
            </div>
          </div>
        </section>

        {/* RINGKASAN — plain-text summary for scanability & accessibility */}
        <section className="border-y border-ink/[0.06] bg-bubble/60 px-5 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Kerjain misi ringan, kumpulkan reward tanpa batas, sambil ikut
              cerita di Secangkir Cerita.
            </h1>
            <p className="mx-auto mt-4 max-w-[60ch] text-balance text-[1.05rem] leading-relaxed text-ink-soft">
              Siapa saja boleh daftar. Tandai misi selesai, saldo langsung
              nambah. Begitu saldo minimal Rp200.000, ajukan pencairan —
              admin transfer manual ke rekeningmu, bukan lewat aplikasi
              pembayaran otomatis.
            </p>
          </div>
        </section>

        {/* CARA KERJA */}
        <section className="px-5 py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
              Tiga jenis misi yang bisa kamu kerjain
            </h2>
            <p className="mt-3 max-w-[60ch] text-ink-soft">
              Semuanya berputar di sekitar blog Secangkir Cerita — baca ceritanya,
              sebarkan ke orang lain, atau ajak teman buat ikut juga.
            </p>

            <div className="mt-9 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
              <div className="flex items-start gap-4 px-5 py-6 sm:px-7">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal-dark">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">Baca &amp; interaksi artikel</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">
                    Baca satu tulisan di blog, tinggalkan like atau komentar,
                    terus tandai misinya selesai. Simpel, dan kamu beneran
                    dapet bacaan yang enak.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 px-5 py-6 sm:px-7">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal-dark">
                  <ShareNodes className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">Share ke media sosial</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">
                    Teruskan satu artikel ke Instagram, WhatsApp, atau TikTok
                    kamu, tandai selesai, saldo langsung nambah.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 px-5 py-6 sm:px-7">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal-dark">
                  <UsersTwo className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">Ajak teman (referral)</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">
                    Bagikan link ajakanmu. Begitu temanmu daftar lewat link
                    itu, kamu langsung dapet reward referral.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RINCIAN REWARD */}
        <section className="border-y border-ink/[0.06] bg-bubble/60 px-5 py-20">
          <div className="mx-auto max-w-thread">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
              Rincian reward
            </h2>
            <p className="mt-3 text-ink-soft">
              Dari misi, langsung kelihatan angkanya. Dari ajak teman, terus
              nambah — nggak ada batasnya.
            </p>

            {/* invoice-style bubble */}
            <div className="mt-7 rounded-2xl rounded-tl-sm bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <HandCoins className="h-4 w-4 text-teal-dark" />
                Misi yang bisa langsung dikerjakan
              </h3>
              <ul className="space-y-2.5">
                {misiAwal.map((misi) => (
                  <li
                    key={misi.label}
                    className="flex items-baseline justify-between gap-3 text-[0.92rem]"
                  >
                    <span className="flex items-center gap-2 text-ink">
                      <ReadTick />
                      {misi.label}
                    </span>
                    <span className="whitespace-nowrap font-semibold text-ink">
                      {rupiah(misi.nominal)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/15 pt-3.5 text-sm font-bold text-ink">
                <span>Subtotal misi</span>
                <span>{rupiah(misiAwalSubtotal)}</span>
              </div>
            </div>

            {/* referral block */}
            <div className="mt-4 rounded-2xl rounded-tl-sm bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <UsersTwo className="h-4 w-4 text-teal-dark" />
                Ajak teman
              </h3>
              <p className="text-[0.92rem] leading-relaxed text-ink-soft">
                Tiap kali ada teman daftar lewat link referral kamu, saldo
                kamu nambah. Nggak dibatasi jumlah temannya.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-teal px-5 py-4 text-paper">
              <span className="font-bold">Minimal pencairan</span>
              <span className="text-lg font-extrabold">Rp200.000 per pengajuan</span>
            </div>
          </div>
        </section>

        {/* BLOG TIE-IN */}
        <section className="px-5 py-20">
          <div className="mx-auto max-w-thread">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
              Misi kamu, bacaan beneran dari Secangkir Cerita
            </h2>
            <p className="mt-3 text-ink-soft">
              Rebahancuan jalan bareng blog{" "}
              <a
                href="https://secangkircerita-id.blogspot.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-teal-dark underline decoration-teal/40 underline-offset-2 hover:decoration-teal-dark"
              >
                Secangkir Cerita
              </a>
              . Beberapa misi baca &amp; share memang mengarah ke tulisan-tulisan
              asli seperti ini:
            </p>

            <div className="mt-6 space-y-3">
              {artikelAsli.map((artikel) => (
                <a
                  key={artikel.url}
                  href={artikel.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 rounded-2xl bg-bubble px-5 py-4 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)] transition-colors hover:bg-teal-light/40"
                >
                  <ForwardArrow className="mt-1 h-4 w-4 shrink-0 text-ink-soft" />
                  <span>
                    <span className="block font-semibold text-ink group-hover:text-teal-dark">
                      {artikel.judul}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">
                      secangkircerita-id.blogspot.com
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ / TRUST */}
        <section className="border-y border-ink/[0.06] bg-bubble/60 px-5 py-20">
          <div className="mx-auto max-w-thread">
            <div className="mb-7 flex items-center gap-2.5">
              <ShieldCheck className="h-6 w-6 text-teal-dark" />
              <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                Kenapa bisa dipercaya
              </h2>
            </div>

            <div className="space-y-3">
              <FaqItem question="Ini beneran bukan penipuan?">
                Daftar dan ngerjain misi di Rebahancuan gratis — nggak ada
                biaya pendaftaran atau biaya tersembunyi apa pun. Semua misi
                yang kamu selesaikan tercatat rapi di dashboard, bisa kamu
                cek kapan aja.
              </FaqItem>
              <FaqItem question="Kok saldo bisa langsung nambah tanpa dicek dulu?">
                Nandain misi selesai emang self-report — kamu yang laporin
                sendiri. Tapi begitu kamu mau cairkan, admin yang review
                pengajuannya satu per satu sebelum uangnya beneran dikirim,
                jadi tetap ada pengecekan manusia di titik yang penting.
              </FaqItem>
              <FaqItem question="Reward-nya ditransfer ke mana?">
                Begitu saldo kamu minimal Rp200.000, ajukan pencairan lewat
                dashboard (jumlahnya bebas, nggak ada batas atas). Admin
                review dulu, baru transfer manual — bank atau e-wallet,
                bukan lewat payment gateway otomatis.
              </FaqItem>
              <FaqItem question="Riwayat misi saya kelihatan nggak?">
                Kelihatan. Semua misi yang udah kamu tandai selesai tercatat
                lengkap dengan tanggalnya di dashboard — transparan, bisa
                kamu lihat ulang kapan pun.
              </FaqItem>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 py-20">
          <div className="mx-auto max-w-thread text-center">
            <PinnedBubble>
              <p className="text-[1.1rem] font-bold leading-snug">
                Saldo langsung nambah begitu misi pertama kamu tandai selesai.
              </p>
              <Link
                href="/daftar"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-sm font-bold text-teal-dark transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper active:scale-[0.98]"
              >
                Daftar &amp; Mulai Misi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </PinnedBubble>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/[0.06] px-5 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
            <CoffeeMark className="h-4 w-4" />
          </span>
          <p className="text-sm text-ink-soft">
            Rebahancuan berjalan bersama blog{" "}
            <a
              href="https://secangkircerita-id.blogspot.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-teal-dark underline decoration-teal/40 underline-offset-2 hover:decoration-teal-dark"
            >
              Secangkir Cerita
            </a>
            . Pencairan reward diproses manual oleh admin.
          </p>
          <p className="text-xs text-ink-soft/70">
            © {new Date().getFullYear()} Rebahancuan.
          </p>
        </div>
      </footer>
    </>
  );
}
