import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rebahancuan — Kerjain Misi, Reward Tanpa Batas, Bareng Secangkir Cerita",
  description:
    "Daftar gratis, kerjain misi ringan seputar blog Secangkir Cerita, dan kumpulkan reward tanpa batas. Tandai misi selesai, saldo langsung nambah, cairkan mulai Rp200.000.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={manrope.variable}>
      <body className="font-display antialiased">
        {/*
          THESIS: The reward offer arrives as a trusted chat message, not a landing-page
          pitch — refusing the neon "aplikasi penghasil uang" template.
          OWN-WORLD: Cream paper ground; deep teal chat bubbles carry the primary action;
          amber coffee accent ties to Secangkir Cerita; warm ink text. Manrope display
          type; system-ui chat bubble text; bubble, tick, forwarded-tag, timestamp
          component language.
          STORY: Visitor scrolls a WA/Telegram-style thread revealing self-report
          missions plus uncapped referral with no earning ceiling, trusts it because
          it links to the real Secangkir Cerita blog and every payout is manually
          reviewed by a real human before transfer, then taps the pinned CTA to daftar.
          FIRST VIEWPORT: Phone-width chat thread centered on cream ground; incoming
          bubbles arrive in sequence with a typing indicator; ends on a pinned teal CTA
          bubble holding the daftar button.
          FORM: Grup Chat WhatsApp/Telegram direction, candidate 4 of 7 grounded
          directions, seed key 92855f8a.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, and DESIGN.md
        */}
        {children}
      </body>
    </html>
  );
}
