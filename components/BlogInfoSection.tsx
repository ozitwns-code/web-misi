import { ArrowRight, BookOpen } from "./icons";
import { BLOG_CARDS } from "@/lib/blog-cards";

export function BlogInfoSection() {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-extrabold text-ink">Blog &amp; Info Cuan</h2>
      <div className="mt-3 space-y-3">
        {BLOG_CARDS.map((card) => (
          <a
            key={card.href}
            href={card.href}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-2xl bg-bubble shadow-[0_1px_0_rgba(36,28,21,0.06),0_8px_20px_-14px_rgba(36,28,21,0.35)] transition-transform hover:scale-[1.01]"
          >
            <div className="flex h-28 items-center justify-center bg-teal-light">
              <BookOpen className="h-9 w-9 text-teal-dark" />
            </div>
            <div className="px-5 py-4">
              <span className="inline-flex items-center rounded-full bg-teal-light px-3 py-1 text-xs font-bold text-teal-dark">
                {card.kategori}
              </span>
              <h3 className="mt-2 font-bold leading-snug text-ink">{card.judul}</h3>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-teal-dark">
                Lanjutkan
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
