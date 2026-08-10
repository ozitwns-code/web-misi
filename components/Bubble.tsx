import { ReactNode } from "react";
import { CheckDouble, ForwardArrow, PinMark } from "./icons";
import { SiteLogo } from "./SiteLogo";

type BubbleProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  time?: string;
};

export function Bubble({ children, delay = 0, className = "", time }: BubbleProps) {
  return (
    <div
      className={`motion-safe:animate-bubble-in motion-safe:opacity-0 w-fit max-w-[88%] rounded-2xl rounded-tl-sm bg-bubble px-4 py-3 font-chat text-[0.95rem] leading-relaxed text-ink shadow-[0_1px_0_rgba(36,28,21,0.06),0_8px_20px_-14px_rgba(36,28,21,0.35)] ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
      {time && (
        <span className="mt-1 block text-right text-[0.7rem] text-ink-soft/60">
          {time}
        </span>
      )}
    </div>
  );
}

export function TypingIndicator({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="motion-safe:animate-[fade-hold_1.1s_ease-in-out_both] flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm bg-bubble px-4 py-3.5 shadow-[0_1px_0_rgba(36,28,21,0.06),0_8px_20px_-14px_rgba(36,28,21,0.35)]"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      <span className="h-1.5 w-1.5 animate-dot-bounce rounded-full bg-ink-soft/50 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-dot-bounce rounded-full bg-ink-soft/50 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-dot-bounce rounded-full bg-ink-soft/50 [animation-delay:300ms]" />
    </div>
  );
}

export function ForwardedTag() {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 font-chat text-xs font-medium italic text-ink-soft">
      <ForwardArrow className="h-3 w-3 shrink-0" />
      Diteruskan dari Secangkir Cerita
    </div>
  );
}

export function ThreadHeader() {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl bg-bubble/70 px-4 py-3 backdrop-blur-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-paper">
        <SiteLogo className="h-5 w-5 object-contain" />
      </span>
      <div className="min-w-0 font-chat">
        <p className="truncate text-sm font-semibold text-ink">Secangkir Cerita</p>
        <p className="text-xs text-teal-dark">misi aktif hari ini</p>
      </div>
    </div>
  );
}

export function PinnedBubble({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="motion-safe:animate-bubble-in motion-safe:opacity-0 w-fit max-w-[92%] rounded-2xl rounded-tl-sm bg-teal px-4 py-3.5 font-chat text-paper shadow-[0_1px_0_rgba(15,79,68,0.4),0_14px_28px_-16px_rgba(15,79,68,0.7)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-teal-light/80">
        <PinMark className="h-3.5 w-3.5 shrink-0" />
        Pesan disematkan
      </div>
      {children}
    </div>
  );
}

export function ReadTick({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-teal ${className}`}>
      <CheckDouble className="h-3 w-3" />
    </span>
  );
}
