# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, TypeScript) + Prisma with PostgreSQL hosted on Neon (via the `@prisma/adapter-pg` driver adapter). Auth is hand-rolled: bcrypt password hashing, JWT session in an httpOnly cookie (`jose`). Started on local SQLite for early development, moved to Neon so data survives deploys and the app can run on serverless hosting (e.g. Vercel) without a persistent local disk. No payment gateway is integrated by design (payout requests are manual).

## Users

Open to the general public — anyone can register, not limited to existing blog readers. Two overlapping audiences: (1) general online "reward hunters" looking to earn money who discover the platform independent of the blog, and (2) readers of the Secangkir Cerita blog (secangkircerita-id.blogspot.com) who engage with missions tied to blog content. The product is designed to convert both into active, returning users through referral-driven growth.

## Product Purpose

A public mission/task platform where anyone can register, self-report completed missions, and invite friends to earn reward with no upper limit. It exists to grow engagement and readership for the Secangkir Cerita blog while giving users a real cash incentive. Success = users engage with missions and the referral loop (not just the smallest available reward), and along the way meaningfully engage with or promote the blog.

## Positioning

The mechanism is self-report on the earning side, manual human review on the payout side. Users report their own mission completion instantly — no proof, no waiting on review, saldo updates the moment they click done — and referral rewards compound with no cap on how many friends someone invites or how high saldo can go. The safeguard sits at withdrawal instead: a user can submit a payout request for any amount at or above Rp200.000 once their saldo covers it, and every request is reviewed by an admin (approve or reject) before any money moves, then confirmed complete only after the admin has actually sent the manual transfer. That combination — trust the self-report for earning, gate the payout with a human in the loop — is what a typical "submit proof, wait for admin approval on every mission" reward app does not replicate.

## Operating Context

- Missions are self-reported: a user marks a mission complete themselves (no proof upload, no admin review step) and their saldo updates immediately.
- Referral rewards are credited automatically the moment a referred user registers — not tied to the referred user completing any mission.
- Saldo (missions + referral combined) has no upper limit and is never automatically capped.
- A user can submit a payout request for any amount from Rp200.000 up to their current saldo, no maximum, and can hold only one active request (pending review or approved) at a time. The request goes through three states: `diminta` (submitted) → admin approves or rejects → if approved, `disetujui` (admin sends the manual bank/e-wallet transfer outside the app) → admin marks it `selesai` in the panel, which is the point saldo is actually decremented. A password-gated admin panel (`/admin`, separate session from user login) lists pending payout requests, approved-awaiting-transfer requests, and pending-review referrals.
- Basic anti-fraud heuristic: if 3 or more accounts have already registered from the same IP within the last 60 minutes, the next registration's referral reward is held as "pending review" (data is still recorded, but the referrer's saldo is not credited) instead of counted automatically.
- Missions center on the Secangkir Cerita Blogspot blog: reading/interacting with articles, sharing them on social media, and inviting friends (referral).
- The admin panel lets the admin create brand-new missions and edit any mission's judul, deskripsi, nominal_reward, tipe, target_url, perlu_survei + its questions, kuota_harian, and aktif status — so the admin can drop in fresh missions daily without a code change. Every create/approve/reject/edit action is recorded to an activity log (`AdminLog`) visible on the same page.
- Missions can optionally carry a `kuota_harian` (daily quota): a shared cap on how many total claims that mission can take across all users in a calendar day (UTC), independent of any one user's history. Once a user completes a mission it's still permanently done for them (no re-claiming), but the quota is what limits how many *different* users can newly claim it per day — once the daily cap is hit, the mission shows as "kuota penuh" and stays unclaimable by anyone new until the quota resets at the next UTC day boundary. Missions without a `kuota_harian` are uncapped, as before.
- Landing page copy (hero, footer, mission-type descriptions, FAQ, CTAs, etc.) is content-managed: stored as key/value rows in a `SiteContent` table, editable from the admin panel without a code change or redeploy. The site logo/brand mark is similarly stored as bytes in a `SiteAsset` table and swappable from the admin panel (falls back to the original coffee-mark icon if never customized).

## Capabilities and Constraints

- Public, open registration — no invite-only gating.
- Confirmed mission types: (1) read & interact with blog articles, (2) share blog articles to social media, (3) refer friends who join, (4) `survei` — a short in-app survey followed by a redirect to an external destination (blog article, WhatsApp channel, etc.) as the completion step. All are self-report — no proof or verification step exists in the product.
- Survey questions can be multiple-choice (button options, the default) or free-text (open input) per question, set per-question in the admin panel. Link-based missions can also carry an optional custom CTA button label (e.g. "Isi & Join Sekarang" instead of the default "Kerjakan") set per mission.
- Saldo per user has no cap. The 5 seeded missions total a fixed Rp30.000; the rest comes from uncapped referral (tiered internally at Rp1.000 for a referrer's first 50 referrals, then Rp50 after — this tier is backend logic only and is deliberately not explained to users in the product copy).
- Payout is user-initiated (minimum Rp200.000 per request, no maximum) and gated by two separate admin actions (approve/reject, then mark selesai after the manual transfer) — the actual transfer remains a manual admin action outside the app (no payment gateway integration).
- Undecided / explicitly open: whether/how the mission list expands beyond the initial 5 seeded missions; payout method details (bank transfer vs. e-wallet, minimum info collected); the admin panel is single-password, single-admin — no multi-admin roles or notifications exist yet.

## Brand Commitments

Product name "Rebahancuan". Formally connected to the Secangkir Cerita blog (secangkircerita-id.blogspot.com) — missions reference and drive traffic to this blog. No logo or further visual identity confirmed beyond the name and the built chat-thread visual world (see DESIGN.md).

## Evidence on Hand

No existing content, testimonials, or brand assets beyond the blog URL itself (secangkircerita-id.blogspot.com). Future work must not fabricate testimonials, user counts, or payout claims.

## Product Principles

1. Trust the self-report for earning; put the human review at withdrawal instead, where money actually leaves the platform.
2. Saldo and referral can both compound without limit — the payout step, not an earning cap, is what keeps the platform in control of when money actually moves.
3. Transparency substitutes for verification on the earning side: mission history and saldo are always visible to the user, since there is no admin gate on missions themselves.
4. Open to the public by default; growth loop leans on referral and social sharing rather than gating access to existing blog readers only.
5. The Secangkir Cerita blog is the content engine; the mission platform is the engagement and distribution layer around it — missions should route real traffic and interaction back to the blog.
