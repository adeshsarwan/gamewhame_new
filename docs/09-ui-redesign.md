# GameWhame — UI Redesign v2 (home + shared kit)

Owner: UI redesign pass | Date: 2026-09-17 | Status: `tsc` clean, `check:emoji` clean, `npm run build` passing, verified in-browser on desktop (1280) and mobile (375).

## Direction

A fresher, more distinctive "friendly app-store" take on the bright teal brand — same palette and fonts (Nunito display + Plus Jakarta Sans), evolved spacing, chunkier radii and softer layered shadows. The old homepage led with a dense feature **mosaic**; it now leads with a **mascot hero** and a **category launcher**, then clean, curated **rails**. Nothing renamed — all changes are additive and prop-compatible, so every existing page (category, play, search, favorites, 404) inherits the lift automatically.

## What changed

- **New HERO (`components/HomeHero.tsx` + css).** Teal-gradient panel, `mascot-wave.png` with a graceful fallback, "Play. Discover. Repeat." headline (Repeat in white), subcopy, an embedded live `SearchBox`, a primary **Play Now** CTA (instant-play → a featured game's `/play/<slug>`; the cut quiz CTA is repurposed) and a **Browse games** secondary that scrolls to the rails. Quick category chips, floating decorative game bits, a speech bubble, entrance motion + pointer parallax (both disabled under `prefers-reduced-motion` / touch). The hero clips decoration on an inner `.sky` layer so the search dropdown can still escape the panel.
- **Category launcher (`components/CategoryLauncher.tsx` + css).** Prominent horizontally-scrollable row of rounded tiles using the generated `/icons/cat-<slug>.png` glossy emblems on category-tinted discs, with `<Icon>` SVG fallback (used automatically for `all`/`popular`/`new`, which have no PNG). Springy hover. This is now the main category entry on home (the sticky pill bar remains as secondary nav).
- **Refreshed GameCard (`components/GameCard.*`).** Bigger radius, `--sh-card` depth, permanent legibility scrim, cleaner meta (title + category + a plays count with a `users` icon), and a refined hover: art zoom, teal→navy veil, a rating/category chip, and a gradient **PLAY** pill that springs in. Structure unchanged (full-bleed, zero-CLS) so the Mosaic/rail/grid all keep working.
- **SectionHeader, buttons, Header, Footer.** Larger header title + glossy icon chip; Header gets a translucent saturated blur, hairline and logo hover; PlayButton CTA moves to the `--grad-play` gradient with an inset highlight; Footer gets a rounded `--r-3xl` top and a bright brand accent bar.
- **Homepage composition (`app/page.tsx`).** hero → category launcher (`#browse`) → Popular → New → ad → Trending → Puzzle → Relax → Challenge → ad → SEO/JSON-LD. The dense hero mosaic is retired in favor of rails; StatusStrip is dropped from home (its facts now live in the hero eyebrow). JSON-LD ItemList retained (now over the Popular rail).
- **New shared helper (`components/BrandImage.tsx`).** Client `<img>` that swaps to a React fallback on 404/error — used by the hero mascot and every launcher emblem so the layout stays intact during the parallel asset rollout.

## New token names (in `app/tokens.css`, additive only)

`--r-2xl`, `--r-3xl`, `--r-hero`; `--sh-card`, `--sh-card-hover`, `--sh-pop`, `--sh-hero`, `--sh-inset-hi`; `--grad-hero`, `--grad-hero-veil`, `--grad-teal-panel`, `--grad-launch`, `--grad-cta-2`, `--grad-play`, `--grad-sun`; `--hero-ink`, `--hero-sub`, `--cloud`; `--ease-spring`, `--dur-hero`. No existing token was renamed or removed.

## Follow-up passes (optional)

- Full per-page redesign of the **play** and **category** pages to match the hero's polish (hero-style category banners, a richer player stage frame).
- Generate `cat-all/popular/new.png` emblems (currently SVG fallback — looks fine, but would complete the set).
- A small **featured spotlight** (single hero-game card) could sit between the launcher and Popular rail if more visual variety is wanted.
- Consider tuning the sticky teal pill bar so it reads distinctly from the teal hero directly beneath it (e.g. a subtle tonal shift).
