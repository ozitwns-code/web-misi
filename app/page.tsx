import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  ShareNodes,
  ShieldCheck,
  UsersTwo,
} from "@/components/icons";
import {
  Bubble,
  PinnedBubble,
  TypingIndicator,
} from "@/components/Bubble";
import { FaqItem } from "@/components/FaqItem";
import { SiteLogo } from "@/components/SiteLogo";
import { prisma } from "@/lib/db";
import { buildContentMap } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = await prisma.siteContent.findMany();
  const c = buildContentMap(rows);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
              <SiteLogo className="h-4 w-4 object-cover" />
            </span>
            <span className="text-[0.95rem] font-bold tracking-tight text-ink">
              {c["site.brand_name"]}
            </span>
          </a>
          <Link
            href="/daftar"
            className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-dark"
          >
            {c["header.nav_cta_label"]}
          </Link>
        </div>
      </header>

      <main id="top">
        {/* HERO — chat thread */}
        <section className="px-5 pb-20 pt-12 sm:pt-16">
          <div className="mx-auto max-w-thread">
            <div className="flex flex-col items-start gap-2.5">
              <TypingIndicator delay={0} />
              <Bubble delay={900} className="motion-safe:opacity-0" time="09.41">
                {c["hero.bubble_1"]}
              </Bubble>
              <Bubble delay={1500} className="motion-safe:opacity-0" time="09.41">
                {c["hero.bubble_2"]}
              </Bubble>
              <Bubble delay={2100} className="motion-safe:opacity-0" time="09.42">
                {c["hero.bubble_3"]}
              </Bubble>
              <Bubble delay={2700} className="motion-safe:opacity-0" time="09.42">
                {c["hero.bubble_4"]}
              </Bubble>

              <div id="mulai" className="w-full scroll-mt-24 pt-1.5">
                <PinnedBubble delay={3900}>
                  <p className="text-[1.05rem] font-bold leading-snug">
                    {c["hero.pinned_title"]}
                  </p>
                  <p className="mt-1 text-sm text-teal-light/90">
                    {c["hero.pinned_subtitle"]}
                  </p>
                  <Link
                    href="/daftar"
                    className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-sm font-bold text-teal-dark transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper active:scale-[0.98]"
                  >
                    {c["hero.cta_label"]}
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
              {c["summary.heading"]}
            </h1>
            <p className="mx-auto mt-4 max-w-[60ch] text-balance text-[1.05rem] leading-relaxed text-ink-soft">
              {c["summary.subheading"]}
            </p>
          </div>
        </section>

        {/* CARA KERJA */}
        <section id="cara-kerja" className="scroll-mt-20 px-5 py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
              {c["carakerja.heading"]}
            </h2>
            <p className="mt-3 max-w-[60ch] text-ink-soft">
              {c["carakerja.intro"]}
            </p>

            <div className="mt-9 divide-y divide-ink/[0.08] rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
              <div className="flex items-start gap-4 px-5 py-6 sm:px-7">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal-dark">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{c["carakerja.misi_baca_judul"]}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">
                    {c["carakerja.misi_baca_deskripsi"]}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 px-5 py-6 sm:px-7">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal-dark">
                  <ShareNodes className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{c["carakerja.misi_share_judul"]}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">
                    {c["carakerja.misi_share_deskripsi"]}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 px-5 py-6 sm:px-7">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal-dark">
                  <UsersTwo className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{c["carakerja.misi_referral_judul"]}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">
                    {c["carakerja.misi_referral_deskripsi"]}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 px-5 py-6 sm:px-7">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-light text-teal-dark">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{c["carakerja.misi_survei_judul"]}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">
                    {c["carakerja.misi_survei_deskripsi"]}
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
              {c["reward.heading"]}
            </h2>
            <p className="mt-3 text-ink-soft">
              {c["reward.intro"]}
            </p>

            {/* referral block */}
            <div className="mt-7 rounded-2xl rounded-tl-sm bg-bubble px-5 py-5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_20px_40px_-30px_rgba(36,28,21,0.4)]">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <UsersTwo className="h-4 w-4 text-teal-dark" />
                {c["reward.referral_card_title"]}
              </h3>
              <p className="text-[0.92rem] leading-relaxed text-ink-soft">
                {c["reward.referral_card_body"]}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-teal px-5 py-4 text-paper">
              <span className="font-bold">{c["reward.minimal_label"]}</span>
              <span className="text-lg font-extrabold">Rp200.000 per pengajuan</span>
            </div>
          </div>
        </section>

        {/* FAQ / TRUST */}
        <section id="faq" className="scroll-mt-20 border-y border-ink/[0.06] bg-bubble/60 px-5 py-20">
          <div className="mx-auto max-w-thread">
            <div className="mb-7 flex items-center gap-2.5">
              <ShieldCheck className="h-6 w-6 text-teal-dark" />
              <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                {c["faq.heading"]}
              </h2>
            </div>

            <div className="space-y-3">
              <FaqItem question={c["faq.q1"]}>{c["faq.a1"]}</FaqItem>
              <FaqItem question={c["faq.q2"]}>{c["faq.a2"]}</FaqItem>
              <FaqItem question={c["faq.q3"]}>{c["faq.a3"]}</FaqItem>
              <FaqItem question={c["faq.q4"]}>{c["faq.a4"]}</FaqItem>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 py-20">
          <div className="mx-auto max-w-thread text-center">
            <PinnedBubble>
              <p className="text-[1.1rem] font-bold leading-snug">
                {c["final_cta.title"]}
              </p>
              <Link
                href="/daftar"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-sm font-bold text-teal-dark transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper active:scale-[0.98]"
              >
                {c["final_cta.button_label"]}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </PinnedBubble>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/[0.06] px-5 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-paper">
            <SiteLogo className="h-4 w-4 object-cover" />
          </span>
          <p className="text-sm text-ink-soft">{c["footer.text"]}</p>
          <p className="text-xs text-ink-soft/70">
            © {new Date().getFullYear()} {c["site.brand_name"]}. ·{" "}
            <Link href="/syarat-ketentuan" className="underline decoration-ink/20 underline-offset-2 hover:decoration-ink/50">
              Syarat &amp; Ketentuan
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
