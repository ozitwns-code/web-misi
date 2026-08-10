---
name: Rebahancuan
description: Reward-mission platform tied to the Secangkir Cerita blog, told as a trusted chat thread.
colors:
  paper: "#F4F1EA"
  bubble: "#FFFFFF"
  ink: "#241C15"
  ink-soft: "#5A5044"
  teal: "#176D5D"
  teal-dark: "#0F4F44"
  teal-light: "#DCEDE8"
  amber: "#B9752D"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.6
  chat:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  bubble: "16px"
  bubble-tail: "4px"
  pill: "9999px"
  button: "12px"
spacing:
  section-y: "80px"
  card-padding: "20px"
  bubble-padding: "12px 16px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.teal-dark}"
  button-on-teal:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.teal-dark}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  bubble-incoming:
    backgroundColor: "{colors.bubble}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "{spacing.bubble-padding}"
  bubble-pinned:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.bubble}"
    padding: "14px 16px"
---

# Design System: Rebahancuan

## Overview

**Creative North Star: "Pesan yang Disematkan" (The Pinned Message)**

Rebahancuan renders its offer the way a trusted opportunity actually reaches someone in Indonesia: as a message in a chat thread, not a landing-page pitch. The system borrows WhatsApp/Telegram's own grammar — bubbles, forwarded tags, read ticks, a pinned banner — and runs it through a warm, paper-toned palette so it reads as a real conversation on a real device, never as a UI kit demo. One color, deep teal, carries the thread's momentum (the assistant's voice, the primary action, the verified state); a single amber accent is reserved for the one mark that is actually the brand — the coffee icon tying back to the Secangkir Cerita blog — so it stays legible as a signature, not wallpaper. The system explicitly rejects the "aplikasi penghasil uang" template: no neon gradients, no countdown timers, no fake join-counters. Density stays conversational — one idea per bubble, generous vertical rhythm between sections — because a wall of marketing copy would break the thread illusion the whole system depends on.

**Key Characteristics:**
- Chat-native structure: bubbles, forwarded tags, pinned banners, and timestamps as real UI grammar, not decoration
- One committed accent (teal) for action and verification; amber reserved for the brand mark only
- Warm paper ground throughout — no dark mode variant; the scene is a daytime phone-in-hand read
- System-native font for bubble text (mimics how a real chat app renders), a distinct display face for headings

## Colors

A warm, paper-grounded palette with one committed saturated color; nothing competes with teal for attention.

### Primary
- **Verified Teal** (#176D5D): the thread's dominant color — primary buttons, pinned-message bubbles, verification ticks, links back to the blog. Carries roughly a third of any given viewport's surface area (bubble fills, CTA, section dividers).
- **Verified Teal, Deep** (#0F4F44): hover/active state for teal surfaces, and headline-weight text set directly on the paper ground (e.g. "misi aktif hari ini").
- **Verified Teal, Light** (#DCEDE8): the palest tint, used only for secondary text sitting on top of the teal fill (never as its own background).

### Secondary
- **Coffee Amber** (#B9752D): reserved exclusively for the coffee-mark icon (the badge that represents the Secangkir Cerita tie-in) in the nav, the chat header avatar, and the footer. It never appears on text, buttons, or fills — its scarcity is what marks it as "the brand," distinct from teal's "the action."

### Neutral
- **Paper** (#F4F1EA): the page ground and the fill for the sticky nav/scrim.
- **Bubble White** (#FFFFFF): the surface for every incoming message bubble and content card — set apart from the paper ground by a soft shadow, never a border.
- **Ink** (#241C15): primary text on paper and on bubble white.
- **Ink Soft** (#5A5044): secondary/supporting text — timestamps, captions, FAQ answers.

### Named Rules
**The One Voice Rule.** Teal is the only saturated color allowed to carry a fill, button, or link. Amber never spreads beyond the coffee mark; a second saturated color loose on the page collapses the "trusted single sender" read the whole system depends on.

## Typography

**Display Font:** Manrope (self-hosted via next/font, weights 500–800)
**Body / Chat Font:** system-ui stack (-apple-system, Segoe UI, Roboto, Helvetica Neue, Arial)

**Character:** Manrope carries every heading and structural label — geometric, warm-humanist, confident at large sizes without leaning on a training-data default serif. Message-bubble text deliberately switches to each device's own system font, because that inconsistency (Manrope headings, native-font bubbles) is what makes the bubbles read as an actual OS-rendered chat thread rather than a themed re-skin of one.

### Hierarchy
- **Display** (800 weight, clamp(1.5rem, 4vw, 2.25rem), 1.2 line-height): section and hero headlines (`h1`/`h2`).
- **Title** (700 weight, 1rem–1.05rem): card and bubble sub-headings ("Misi yang bisa langsung dikerjakan", pinned-bubble headline).
- **Body** (500 weight, 1rem, 1.6 line-height): supporting paragraph copy on the paper ground; measure capped near 60ch.
- **Chat** (400 weight, 0.95rem, system font, 1.6 line-height): all bubble message text, the thread header name/status, and the forwarded-tag caption.
- **Label** (600–700 weight, 0.7rem–0.75rem): timestamps and micro-captions (e.g. bubble timestamps, "Contoh ilustrasi progres" caption) — sentence case, never uppercase-tracked.

### Named Rules
**The No-Eyebrow Rule.** No small-caps, letter-tracked label ever sits above a heading or section title. Section identity comes from the heading and an inline icon, never from a kicker.

## Layout

Single-column, mobile-first scroll. The hero and reward-breakdown sections are capped at a phone-width column (max-width 26rem / `max-w-thread`) even on desktop, so the chat-thread illusion holds at any viewport instead of stretching into a generic wide layout. Later sections (how-it-works list, FAQ) widen slightly (max-width ~42rem) once the page has left the "phone screen" register. Vertical rhythm between major sections is generous and consistent (80px / `py-20`), with alternating paper and bubble-white/60 section backgrounds to separate the thread from its supporting content without adding borders. On mobile, the same column layout holds at native width with no repositioning — the design was authored phone-first, so responsiveness is mostly a non-event.

## Elevation & Depth

Flat paper ground; every raised surface (bubble, card, pinned banner) is lifted with a soft two-layer shadow, never a border or a flat color swap. Depth encodes "this is a distinct object in the thread," not state — a pinned or verified item is distinguished by color and iconography, not by shadow strength.

### Shadow Vocabulary
- **Bubble lift** (`0 1px 0 rgba(36,28,21,0.06), 0 8px 20px -14px rgba(36,28,21,0.35)`): the default for incoming bubbles and content cards — a hairline seam plus a soft ambient falloff.
- **Pinned lift** (`0 1px 0 rgba(15,79,68,0.4), 0 14px 28px -16px rgba(15,79,68,0.7)`): the same construction, tinted from teal instead of ink, for bubbles filled with the teal surface so the shadow never reads as a gray smudge on a colored fill.

### Named Rules
**The Tinted Shadow Rule.** A shadow under a colored surface is always tinted from that surface's own hue, never generic black/gray — this is why the pinned-bubble shadow uses teal-based rgba values instead of ink's.

## Shapes

Bubble geometry throughout: 16px corner radius on every card and message, with one corner (top-left on incoming bubbles) pulled in to a 4px "speech tail" — the single recurring silhouette cue that something is a message rather than a generic card. Buttons split by context: pill-shaped (`rounded-full`) for the persistent nav CTA, 12px-rounded rectangles for CTAs living inside a bubble. No hard edges, no borders as a structural device — separation between surfaces is shadow and color, not stroke.

## Components

### Buttons
- **Shape:** pill (`rounded-full`, 9999px) for the standalone nav CTA; 12px-rounded rectangle for CTAs nested inside a pinned bubble.
- **Primary (nav):** teal fill, paper text, `8px 16px` padding.
- **Hover / Focus:** nav CTA darkens to Teal Deep on hover; in-bubble CTA scales to 102% on hover/98% on press. Both carry a visible `focus-visible` outline in their surface's contrasting color — never removed.
- **On-teal:** paper fill, Teal Deep text — used only inside a teal (pinned) bubble, so the button reads as "punched through" the surface rather than floating a second accent on top of it.

### Cards / Containers
- **Corner Style:** 16px radius, matching the bubble family.
- **Background:** Bubble White on a Paper or Bubble-White/60 section ground.
- **Shadow Strategy:** Bubble lift (see Elevation & Depth).
- **Border:** none.
- **Internal Padding:** 20px (`px-5 py-5`) for content cards; 16px (`px-4 py-3`) for message bubbles.

### Chat Bubble (signature component)
The system's defining primitive. Incoming bubbles: Bubble White fill, Ink text, 16px radius with a 4px top-left tail, optional trailing timestamp in Ink Soft at 0.7rem. Pinned bubbles: Teal fill, Paper text, a `PinMark` icon plus "Pesan disematkan" label, holding the on-teal CTA button. A `ForwardedTag` (arrow icon + italic caption) marks content relayed from the Secangkir Cerita blog. A three-dot `TypingIndicator` (bouncing dots, Ink Soft at 50% opacity) precedes the first message to establish the "someone is really there" read before content arrives — the system's one authored motion moment, not repeated as a generic entrance effect elsewhere.

### Navigation
Sticky, translucent Paper bar (85% opacity + backdrop blur — a deliberate nod to native chat-app header chrome, not decorative glass) holding the wordmark and a single pill CTA. No secondary nav items; the whole site is one scroll.

## Do's and Don'ts

### Do:
- **Do** keep teal as the only saturated color carrying a fill, button, or active state.
- **Do** reserve Coffee Amber (#B9752D) for the coffee-mark brand icon only.
- **Do** render bubble/message text in the system-ui chat stack, and every heading/structural label in Manrope — the mismatch is intentional and load-bearing.
- **Do** tint every shadow from the surface color it sits under (ink-based on paper/white, teal-based on teal fills).
- **Do** label any illustrative/example data explicitly (e.g. "contoh ilustrasi, bukan data pengguna sungguhan") rather than presenting it as real.

### Don't:
- **Don't** add a kicker, eyebrow, or uppercase-tracked label above any heading or section title.
- **Don't** introduce a second saturated accent color; a new role gets a teal tint or a neutral, not a new hue.
- **Don't** use emoji as functional UI icons (status, verification, navigation) — icons are drawn SVG in the system's single stroke weight (1.75). Emoji may appear only inside authored message copy, as realistic texting voice.
- **Don't** use a hard-edged, zero-blur block shadow anywhere; this system is not neobrutalist.
- **Don't** invent member counts, countdowns, or testimonials to manufacture urgency — the system's entire trust strategy depends on only showing what's real or clearly labeled synthetic.
