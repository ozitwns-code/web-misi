type IconProps = {
  className?: string;
};

const strokeProps = {
  fill: "none",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CoffeeMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" />
      <path d="M16 10.5h1.5a2 2 0 0 1 0 4H16" />
      <path d="M7.5 5.5c-.6.6-.6 1 0 1.6M11 5.5c-.6.6-.6 1 0 1.6" />
    </svg>
  );
}

export function CheckSingle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 12" className={className} {...strokeProps} stroke="currentColor">
      <path d="M2 6.5 6 10.5 14 2" />
    </svg>
  );
}

export function CheckDouble({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 12" className={className} {...strokeProps} stroke="currentColor">
      <path d="M1 6.5 5 10.5 13 2" />
      <path d="M7 6.5 11 10.5 19 2" />
    </svg>
  );
}

export function PinMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <path d="M12 2.75c-2.9 0-5.25 2.32-5.25 5.19 0 3.9 5.25 9.31 5.25 9.31s5.25-5.41 5.25-9.31c0-2.87-2.35-5.19-5.25-5.19Z" />
      <circle cx="12" cy="7.94" r="1.9" />
    </svg>
  );
}

export function ForwardArrow({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 16" className={className} {...strokeProps} stroke="currentColor">
      <path d="M7 2 2 7l5 5" />
      <path d="M2 7h9a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

export function BookOpen({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <path d="M12 6.5c-1.6-1.2-3.8-1.75-6.5-1.75v13c2.7 0 4.9.55 6.5 1.75 1.6-1.2 3.8-1.75 6.5-1.75v-13c-2.7 0-4.9.55-6.5 1.75Z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

export function ShareNodes({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <circle cx="6" cy="12" r="2.25" />
      <circle cx="18" cy="6" r="2.25" />
      <circle cx="18" cy="18" r="2.25" />
      <path d="m8 10.8 8-3.6M8 13.2l8 3.6" />
    </svg>
  );
}

export function UsersTwo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
      <path d="M15.5 6.2a3 3 0 0 1 0 5.6" />
      <path d="M15.5 14c2.5.3 4.5 2.5 4.5 5.5" />
    </svg>
  );
}

export function Chevron({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} {...strokeProps} stroke="currentColor">
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

export function ShieldCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <path d="M12 3 5 5.5v5.7c0 4.4 3 7.9 7 9.3 4-1.4 7-4.9 7-9.3V5.5L12 3Z" />
      <path d="m8.7 12.1 2.4 2.4 4.2-4.6" />
    </svg>
  );
}

export function HandCoins({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <circle cx="9" cy="7.5" r="3" />
      <path d="M3.5 18.5c.4-3 2.7-5.2 5.5-5.2s5.1 2.2 5.5 5.2" />
      <path d="M14 14.5h4.2c1 0 1.8.7 1.8 1.6 0 .9-.8 1.6-1.8 1.6H15" />
      <path d="M13.3 17.7h4.4c1 0 1.8.7 1.8 1.6s-.8 1.6-1.8 1.6H12" />
    </svg>
  );
}

export function CalendarCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v4M16 3v4" />
      <path d="m8.3 14.2 2 2 4.4-4.4" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 16" className={className} {...strokeProps} stroke="currentColor">
      <path d="M2 8h15" />
      <path d="m11 2 6 6-6 6" />
    </svg>
  );
}

export function ExternalLink({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <path d="M10 6H6.5A2.5 2.5 0 0 0 4 8.5v9A2.5 2.5 0 0 0 6.5 20h9a2.5 2.5 0 0 0 2.5-2.5V14" />
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
    </svg>
  );
}

export function ClipboardList({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3.5h6a1 1 0 0 1 1 1V6H8V4.5a1 1 0 0 1 1-1Z" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4.5" />
    </svg>
  );
}

export function HouseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10" />
      <path d="M10 20.5V15h4v5.5" />
    </svg>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <path d="M3.5 7.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-9Z" />
      <path d="M3.5 9.5h16" />
      <path d="M15.5 14h2.5" />
      <path d="M7 5.5 11 2h4" />
    </svg>
  );
}

export function UserCircle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M5.8 18.4a6.5 6.5 0 0 1 12.4 0" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} stroke="currentColor">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function LoaderDots({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="4" cy="12" r="2" className="animate-dot-bounce [animation-delay:0ms]" />
      <circle cx="12" cy="12" r="2" className="animate-dot-bounce [animation-delay:150ms]" />
      <circle cx="20" cy="12" r="2" className="animate-dot-bounce [animation-delay:300ms]" />
    </svg>
  );
}
