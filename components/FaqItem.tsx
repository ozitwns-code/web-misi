import { ReactNode } from "react";
import { Chevron } from "./icons";

export function FaqItem({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-2xl bg-bubble px-5 py-4 open:pb-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[0.95rem] font-semibold text-ink marker:content-none">
        {question}
        <Chevron className="h-4 w-4 shrink-0 text-ink-soft transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-soft">
        {children}
      </div>
    </details>
  );
}
