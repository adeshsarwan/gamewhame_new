# GameWhame — UI/UX Design Spec (v1)

Owner: UI/UX | Audience: Developers (Next.js) | Status: For build
Source of truth: `CLAUDE.md`, `docs/01-product-features.md`, `inspiration/index.html` (working prototype), high-res mockups `01/06/07/08/10`.

**North star:** P1 = MAXIMIZE TIME-ON-SITE. Every screen is engineered so ending one game instantly offers the next (loop B). The play page's related-games rail is the single most important surface in the product.

**Two hard rules baked into this spec:**
1. **NO EMOJI anywhere.** All card art = real generated thumbnails; all UI glyphs = named SVG icons (see §2). The prototype's emoji are placeholders only.
2. **Ads never block first play and never interrupt gameplay.** Ad slots live in the gaps (§3 per screen).

---

## 1. Design system (drop-in tokens)

Paste into `app/globals.css` (or a `tokens.css` imported by the root layout). Values extracted and formalized from the prototype.

```css
:root{
  /* ---- Brand color ---- */
  --aqua:#0BE0D0;        --aqua-2:#08C7BB;     --aqua-light:#6FF5E8;   --aqua-wash:#E8FFFB;
  --navy:#10233F;        --navy-2:#1B3A63;     --ink:#10233F;
  --pink:#FF4D7D;        --yellow:#FFC531;     --purple:#7C5CFF;
  --lime:#B8F135;        --blue:#00A8FF;

  /* Accent ramp used for CTA gradient (play button) */
  --grad-cta:linear-gradient(135deg,var(--pink),#FF7A3D);
  --grad-brand:linear-gradient(135deg,#10233F 0%,#1E4F9A 60%,#0BE0D0 130%);
  --grad-progress:linear-gradient(90deg,var(--aqua),var(--yellow));

  /* ---- Neutrals / surfaces ---- */
  --paper:#FFFFFF;
  --surface:#EEF4F6;     /* input & icon-button fill */
  --surface-2:#F1F6F8;   /* tag chips */
  --surface-hover:#F2FBFA;
  --line:#E6EEF2;        /* hairline borders */
  --muted:#5B7190;       /* secondary text */
  --muted-2:#8AA0B8;     /* placeholder text */
  --ink-body:#334B6B;    /* long-form body copy */
  --stage:#071122;       /* game iframe letterbox bg */
  --stage-chrome:#0F2440;/* player top bar */

  /* ---- Category dot / accent colors (from CAT_COLORS) ---- */
  --c-popular:#FF4D7D;  --c-new:#00B86B;    --c-puzzle:#7C5CFF; --c-arcade:#FF8A00;
  --c-casual:#00A8FF;   --c-sports:#00B86B; --c-racing:#FF3D3D; --c-action:#FF4D7D;
  --c-adventure:#0ABAB3;--c-strategy:#1B3A63;--c-board:#8B5E34; --c-word:#00A8FF;
  --c-brain:#B16CFF;    --c-math:#0096FF;   --c-matching:#FF5AC8;--c-3d:#7C5CFF;
  --c-hyper:#B8F135;    --c-multiplayer:#FFC531;

  /* ---- Radii ---- */
  --r-sm:14px; --r:18px; --r-lg:22px; --r-xl:28px; --r-pill:999px;
  --r-card-mobile:15px;

  /* ---- Shadows ---- */
  --sh-sm:0 4px 14px rgba(16,35,63,.14);
  --sh-md:0 10px 28px rgba(16,35,63,.20);
  --sh-lg:0 18px 50px rgba(16,35,63,.28);
  --sh-cta:0 10px 26px rgba(255,77,125,.40);
  --sh-header:0 6px 24px rgba(16,35,63,.08);

  /* ---- Spacing scale (4px base) ---- */
  --s-1:4px; --s-2:8px; --s-3:10px; --s-4:12px; --s-5:14px;
  --s-6:16px; --s-7:18px; --s-8:22px; --s-9:28px; --s-10:40px;
  --gap-grid:14px; --gap-grid-mobile:10px; --container-max:1440px; --container-pad:18px;

  /* ---- Typography ---- */
  --font-display:'Nunito','Plus Jakarta Sans',system-ui,sans-serif; /* 700–1000 */
  --font-body:'Plus Jakarta Sans','Nunito',system-ui,sans-serif;    /* 500–800 */
  --fw-black:1000; --fw-heavy:900; --fw-bold:800; --fw-semibold:700; --fw-medium:600;

  /* type scale (desktop → mobile noted in §1.3) */
  --t-hero:clamp(40px,6vw,64px);  /* landing "Play. Discover. Repeat." */
  --t-h1:26px; --t-h2:20px; --t-h3:17px;
  --t-body:14px; --t-sm:13px; --t-xs:12px; --t-2xs:11px;
  --t-card:13.5px; --t-card-hero:18px; --t-pill:13.5px;

  /* ---- Motion ---- */
  --ease-bounce:cubic-bezier(.34,1.56,.64,1);   /* pills, fav pop, play pill */
  --ease-card:cubic-bezier(.34,1.4,.64,1);      /* card lift */
  --ease-drawer:cubic-bezier(.32,.72,.35,1);    /* drawer / overlays */
  --dur-fast:.18s; --dur:.22s; --dur-slow:.28s; --dur-shine:.6s;

  /* ---- Layout constants ---- */
  --header-h:66px; --catbar-h:62px; --z-header:60; --z-catbar:50;
  --z-bottomnav:80; --z-overlay:120; --z-drawer:130; --z-modal:150; --z-toast:200;
}
@media (prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important;scroll-behavior:auto!important}
}
```

### 1.1 Breakpoints

| Name | Range | Mosaic cols / row-height | Notes |
|---|---|---|---|
| Desktop | ≥1200px | 12 cols / 84px | full 5-col header, sidebars visible |
| Tablet | 768–1199px | 8 cols / 88px | `f/t` keep span-4/2; detail + SEO collapse to 1 col. Sub-break at 1023px hides ⌘K hint + avatar label |
| Mobile | <768px | 4 cols / 112px | bottom nav appears, search collapses to icon→overlay, hover layers disabled |
| Small | <390px | 4 cols / 112px | dense/all grids drop to 2 cols, rails 136px |

### 1.2 Mosaic tile-size system (formalize prototype `f/t/w/m/s`)

| Token | Grid span (desktop 12-col) | Aspect | Role | Title size |
|---|---|---|---|---|
| `f` feature/hero | col 4 × row 4 | ~1:1 | 1–2 per view, top of mosaic | 18px |
| `t` tall | col 2 × row 4 | ~1:2 | vertical accent | 13.5px |
| `w` wide | col 4 × row 2 | ~2:1 | banner-style feature | 15px |
| `m` medium | col 2 × row 3 | ~3:4 | rhythm breaker | 13.5px |
| `s` small (default) | col 2 × row 2 | 1:1 | the workhorse tile | 13.5px |

Prototype fill pattern (reuse): `['f','s','s','t','s','w','s','s','f','s','t','w','s','m','s','m','s','w','s','t','s','s','m','s']`, `grid-auto-flow:dense`. Mobile remap: `f`→span 4×3, `w`→span 4×2, `t/m`→span 2×3, `s`→span 2×2.
Rails (`hrow`) and dense grids (`dgrid`/`allGrid`) force every card to a **1:1 square** regardless of token.

### 1.3 Type ramp (responsive)

| Element | Desktop | Mobile | Font / weight |
|---|---|---|---|
| Landing hero | 64px | 40px | display / 1000 |
| Detail H1 (game title) | 26px | 22px | display / 1000 |
| Section title | 17px | 15px | display / 1000 |
| Card title (`s/t/m`) | 13.5px | 12px | display / 1000, 2-line clamp |
| Card title (`f`) | 18px | 16px | display / 1000 |
| Body / description | 14px | 14px | body / 600–700, line-height 1.7 |
| Meta / small caps | 11px | 11px | body / 700, uppercase, letter-spacing .3px |

---

## 2. Icon inventory + recommended icon system

**No emoji.** Every glyph below is a real SVG. Recommended set:

> **Recommendation: [Phosphor Icons](https://phosphoricons.com), `Bold` weight for line icons + `Fill` weight for active/solid states.** Rationale: Phosphor's Bold weight has thick, rounded, high-contrast strokes that match the chunky Nunito-1000 / pill-shaped brand better than Lucide (too thin) or Heroicons (too corporate). It ships `@phosphor-icons/react` (tree-shakeable, SSR-safe in Next.js App Router), has both line + fill weights for default/active pairs (heart, star, etc.), MIT-licensed. Load only the icons used. **Keep 2 custom brand SVGs** hand-authored (not from the set): the **logo wordmark "W" spark mark** (already in prototype) and the **Play triangle** used inside the pink CTA/overlay pill (so play always reads identically at every size). Rating star = Phosphor `Star` (Fill, `--yellow`).

Icon inventory — each entry: name · Phosphor glyph (weight) · where used · look.

| # | Icon | Phosphor | Used in | Look |
|---|---|---|---|---|
| 1 | Search | `MagnifyingGlass` (Bold) | header search, mobile search btn, bottom nav | rounded lens + short handle, 2.6px stroke |
| 2 | Favorite / heart | `Heart` (Bold=off, Fill=on) | card fav btn, header fav link, detail, bottom nav | plump rounded heart; fills pink `--pink` when active |
| 3 | Play | **custom** triangle | card hover pill, big-play, CTA, player | equilateral rounded-corner triangle, optically centered |
| 4 | Fullscreen | `CornersOut` (Bold) | player top bar | 4 corner brackets expanding |
| 5 | Share | `ShareNetwork` (Bold) | detail CTA, player | 3 nodes + connectors |
| 6 | Reload / restart | `ArrowClockwise` (Bold) | player, demo restart | circular arrow |
| 7 | Sound on / off | `SpeakerHigh` / `SpeakerSlash` (Bold) | player | speaker + waves; slash when muted |
| 8 | Report / flag | `Flag` (Bold) | player | rounded pennant |
| 9 | Menu | `List` (Bold) | mobile header | 3 rounded bars |
| 10 | Close | `X` (Bold) | overlays, drawer, filter clear | rounded X |
| 11 | Home | `House` (Fill=active) | bottom nav | rounded house |
| 12 | Games / grid | `GameController` (Bold) | bottom nav "Games", nav | rounded gamepad |
| 13 | Profile / guest | `User` (Bold) | header avatar, bottom nav | rounded bust |
| 14 | Chevron L/R | `CaretLeft`/`CaretRight` (Bold) | rail scroll arrows | chunky caret |
| 15 | Chevron down | `CaretDown` (Bold) | sort select | chunky caret |
| 16 | Back | `ArrowLeft` (Bold) | back buttons, breadcrumb | rounded arrow |
| 17 | Star (rating) | `Star` (Fill) | rate badge, stars row | solid rounded star, `--yellow` |
| 18 | Plays / users | `Users` (Bold) | meta rows | two rounded busts |
| 19 | Calendar / updated | `CalendarBlank` (Bold) | game info panel | rounded calendar |
| 20 | Category tag | `Tag` (Bold) | tags, game-info category | rounded price-tag |
| 21 | Platform / devices | `Devices` (Bold) | game-info "Web (all devices)" | phone+monitor |
| 22 | Lightning / instant | `Lightning` (Fill) | "No downloads", instant-demo pill | bold rounded bolt |
| 23 | Fire / trending | `Flame` (Fill) | "trending now" pill, Popular section | rounded flame |
| 24 | Live dot | custom 8px `<i>` | live pill, player "live" | pulsing filled circle (CSS, not icon) |
| 25 | Sparkle / new | `Sparkle` (Fill) | "New Games" section, toasts | 4-point rounded sparkle |
| 26 | Puzzle | `PuzzlePiece` (Fill) | Puzzle section head, category page | rounded puzzle piece |
| 27 | Coffee / relax | `Coffee` (Bold) | "Play & Relax" section | rounded mug |
| 28 | Bell / notify | `Bell` (Bold) | "notify me" (coming-soon state) | rounded bell |
| 29 | Crown / rewarded | `Crown` (Fill) | rewarded-ad slot marker | rounded crown, `--yellow` |
| 30 | Store / Android | `GooglePlayLogo` (Bold) or `AndroidLogo` | honest "play on Android" fallback | official-ish rounded mark |
| 31 | Social: Discord/X/YouTube/TikTok | `DiscordLogo`,`XLogo`,`YoutubeLogo`,`TiktokLogo` (Fill) | footer | brand marks |
| 32 | Gift / surprise | `Gift` (Fill) | v1.1 "Surprise Me" | rounded gift box |
| 33 | Info | `Info` (Bold) | honest-note callout | rounded i-circle |

Section-header icon chips (prototype used emoji in the navy circle `.em`): replace with the mapped Phosphor Fill icon on `--navy` fill / white glyph — Popular=`Flame`, New=`Sparkle`, Puzzle=`PuzzlePiece`, Relax=`Coffee`, Challenge=`Lightning`, Recently Played=`ClockCounterClockwise`, All Games=`GameController`, Favorites=`Heart`.

**Implementation note:** wrap in one `<Icon name size weight color/>` component so no raw emoji or inline SVG leaks into pages; enforce with an ESLint rule banning emoji literals in `.tsx`.

---

## 3. Screen specs (desktop + mobile)

Structure/annotation-level (not pixel comps). Every screen shares the **global chrome** in §3.0.

### 3.0 Global chrome

**Header** (`sticky`, z 60, white 94% + `backdrop-filter:blur(14px)`, `--sh-header`, 66px):
- Left: **Logo** = brand mark (navy→aqua gradient rounded square, custom "W" spark SVG) + wordmark `GAME` navy / `WHAME` pink + micro-caps `GAMEWHAME.COM`. Links home. min-height 44px (tap target).
- Center: **SearchBox** (desktop variant, max 620px, centered) — pill, `--surface` fill, `MagnifyingGlass` icon, `Enter ↵` kbd hint (hidden <1023px), live dropdown anchored below.
- Right (`hactions`): mobile-only Search `IconButton`; **Favorites** `IconButton` (Heart) with count badge (pink); **Profile** avatar button (navy pill, "Guest"); mobile-only Menu `IconButton`.
- **Category pill bar** (`sticky` under header at top:66px, z 50, aqua gradient, 62px): horizontally scrollable `CategoryPill` row: All Games, Popular, New Games, Puzzle, Arcade, Casual, Sports, Racing, Action, Adventure, Strategy, Board, Word, Brain, Math, Matching, 3D, Hyper Casual, Multiplayer. Active pill = navy fill, scaled 1.04.

**Footer** (navy, `--r-xl` top corners, dotted texture): brand blurb + social row (SVG brand icons); columns Explore / Categories / Company / Legal; bottom bar copyright. Replace prototype's "Made with 💛" → "Made for players" (no emoji).

**Mobile bottom nav** (`fixed`, floating pill, z 80, shown <768px): Home (`House`), Search (`MagnifyingGlass` → opens overlay), Games (`GameController`), Saved (`Heart`). Active = navy fill. 52px min tap height, respects `env(safe-area-inset-bottom)`.

**Ad rule for chrome:** no ad in header, cat bar, or bottom nav. Display ads only inside page content (§3.1/3.2/3.4).

---

### 3.1 Home (`/`)

**Desktop layout (top→bottom):**
1. **Top strip**: mini status pills — `● LIVE · N free games` (pulsing dot), `⚡ No downloads` (Lightning), `🔥 N trending now` (Flame), `♥ N saved` (Heart). All SVG, no emoji.
2. **Hero mosaic**: variable-size grid of featured + trending games (12 tiles), `f/t/w/m/s` sizes, `grid-auto-flow:dense`. This is the visual anchor — must be real thumbnail art, zero CLS (reserve grid rows). *(Optional editorial hero banner from mockup 01 — "Play. Discover. Repeat." — may sit above the mosaic as a `w`-width branded tile; NOT a quiz CTA. The mockup's "Find My Perfect Game" hero/tile is CUT.)*
3. **Popular Games** rail (`SectionHeader` Flame + horizontal `GameRail`, scroll arrows).
4. **AdSlot (display)** — full-width banner between Popular and New. `--sh` dashed placeholder in dev; real network slot in prod. Never sticky, no CLS (fixed height reserved).
5. **New Games** rail (Sparkle).
6. **Puzzle & Brain** dense grid (PuzzlePiece).
7. **Play & Relax** dense grid (Coffee).
8. **Challenge Yourself** dense grid (Lightning).
9. **Recently Played** dense grid (ClockCounterClockwise) — only if `recents` non-empty (localStorage). Retention hook.
10. **All Games** grid + sort select (Popular/Newest/Highest Rated/A–Z) + "Load more" (paginated, +24).
11. **SEO card** (2-col: welcome copy + how-to-play) — strip all emoji from copy.

**Mobile:** hero mosaic 4-col; rails scroll horizontally; single-column sections; sort select full-width; bottom nav. Search is icon→full-screen overlay.

**Ad slots:** 1 in-content display banner (step 4); optional 2nd display above footer. No interstitial here (home is the browse surface). No ad above the fold that pushes the mosaic down.

---

### 3.2 Category page (`/games/[category]`) — ref mockup 06

**Desktop:**
1. **Category banner** (`w`-height, `--r-lg`, category-color gradient, dotted texture): breadcrumb `Home / Categories / {Cat}`, big title `{Cat} Games`, one-line description, decorative art (right). Uses `--c-{category}` accent.
2. **Filter + sort row**: sub-filter pills (All + relevant sub-tags) on left, `Sort by {Most Popular ▾}` select on right.
3. **Top mosaic** (first ~18 games in `f/t/w/m/s`) — keeps the portal's signature look on category pages too.
4. **"All {Cat} games"** dense grid + Load more.

**Mobile:** banner compresses (title + short desc), filter pills scroll horizontally, dense 3-col grid (2-col <390px).

**Ad slots:** 1 display banner after the top mosaic. No interstitial.

---

### 3.3 Search — desktop dropdown + mobile overlay

**Desktop live dropdown** (anchored under header search, `--r`, `--sh-lg`, max-height 420px): debounced (≈120ms) fuzzy results (title/tag/category weighting from prototype `searchGames()`), up to 6 `LiveResultItem` rows (thumb + title + `category · ★rating` + Play caret), then a "See all results →" row → `/search?q=`. Empty query → hidden. No matches → friendly empty row (SVG, no emoji). Click-outside closes.

**Full results page (`/search?q=`):** back button, `Results for "q" · N found` heading, `allGrid` of results, or empty state (SVG illustration + suggested categories + "Explore arcade" CTA).

**Mobile overlay** (`fixed`, full-screen, aqua bg, z 120): opened by header/bottom-nav search icon. Sticky search field + close `X`; results as full-width cards; pre-populated with 6 suggestions when query empty. Selecting a result closes overlay and routes to play page.

**Ad slots:** none inside search surfaces (keep discovery friction-free).

---

### 3.4 Game play page (`/play/[slug]`) — THE P1 ENGINE. Ref mockups 07 (desktop) / 10 (mobile)

This screen wins or loses the session. Order and emphasis matter.

**Desktop — 2-col grid (`1.65fr / .9fr`):**

*Above the frame:* back button/breadcrumb + status chips (category badge, instant-demo/coming-soon state, `★ rating`, `🎲 plays`).

*Left column — the stage:*
- **PlayerStage** (`playerWrap`, `--r-lg`, dark `--stage`): top chrome bar (live dot + `{title} — GameWhame Player` + control cluster: Sound, Reload, **Fullscreen**, Report — all `pBtn` IconButtons with SVG icons). Below it the **stage** = `aspect-ratio:16/9`, holds the sandboxed `<iframe>`.
- **iframe lifecycle (dev must honor):** client-mounted only; `src` set to R2 game URL on play; on route change set `src="about:blank"` then remove node (prevents memory leaks at 1M users). Reserve the 16:9 box at SSR for **zero CLS**. Poster/preview state before first interaction (blurred art + big Play). See PRD open question on `files.gamewhame.com` origin + sandbox flags.
- **Overlay controls** live in the top chrome (Fullscreen / Favorite / Share / Report), never over the play area during gameplay.
- **Preview (pre-play) state:** blurred cover art bg + centered **big Play** button + title + "Free instant · No download". First play requires **zero ad** (hard rule).
- **In-game rewarded "continue" overlay** (ref mockup 08's in-game surface): appears **only** on a natural fail/continue moment, **player-initiated** ("Watch to continue your run / +1 life"), rendered as a modal over the stage *between* runs — never a pre-play gate, never mid-run. Marked with `Crown` icon. This is the single rewarded surface.
- **Honest "coming to browser" state** (carried from prototype): if `playUrl` null, stage shows a clear "we're building the browser version — no fake emulator" panel with "Play on Android ↗", "Notify me" (Bell), and **"Play similar now ↓"** that jumps to the related rail (keeps loop B alive).

*Right column — info + discovery + ads:*
- **InfoCard**: thumbnail, stars + rating count, plays, title (H1), description, **CTA row** (`▶ Play Now` pink gradient CTA, `♡ Favorite`, `⛗ Share`), honest Android link, tag row, `Game Info` mini-table (Category / Plays / Rating / Last Updated / Platform with SVG icons — mockup 07's right panel).
- **AdSlot (display / sidebar)** below info — mockup 07's "AD — REWARDED / INTERSTITIAL SLOT". Static, no CLS, never over the frame.

*Full width below (THE loop-B driver):*
- **Related-games rail — "More Games Like This"** (`related()` scoring). **Placement: immediately below the stage/info, above the fold on desktop after the frame.** Always populated (min 8, target 10). Dense grid on desktop; horizontal rail on mobile. This is the highest-priority module on the page — a finished game must never be a dead end.

**Mobile (ref mockup 10):** stacked — thumbnail + title + category chips + rating/plays, then `Play Now` + `Add to Favorites`, then the **stage** (16:9 → taller `4/3.4`), then related-games as a horizontal rail directly under the frame. Bottom nav persists.

**Ad slots:** (1) sidebar/below-info **display** (no CLS, never over frame); (2) **interstitial** on navigation *from a finished game to the next* only — frequency-capped (propose 1 per 3 transitions, A/B against session length), skippable/short; (3) **rewarded** in-game continue overlay, opt-in only. **No ad before first play. No ad during a run.**

---

### 3.5 Favorites (`/favorites`)

Back button + `♥ My Favorites · N saved on this device` heading + `allGrid` of favorited games. Empty state: SVG broken-heart illustration (not emoji) + "Tap the heart on any tile — no account needed" + "Find games to love →" CTA. Data = localStorage `gw_favs` (Set of slugs), no account. Also reachable from header Heart + bottom-nav Saved.
**Ad slots:** optional single display banner below the grid; none if list is short.

---

## 4. Component kit

Reusable React components (Next.js App Router). Server components by default; mark interactive ones `'use client'` (noted). All visuals from tokens in §1; all glyphs from §2 `<Icon>`.

### GameCard `'use client'` (fav toggling)
The core tile. Renders art image, rating badge, favorite button, meta bar, hover play overlay.
- **Props:** `game: Game`, `size?: 'f'|'t'|'w'|'m'|'s'` (default `'s'`), `priority?: boolean` (LCP hint for above-fold `next/image`), `showRating?=true`, `showFav?=true`, `context?: 'mosaic'|'rail'|'grid'` (controls aspect override).
- **Anatomy:** `<a href="/play/{slug}">` → `next/image` cover art (real thumbnail, `object-fit:cover`, focal center) → `RatingBadge` (top-left) → `FavoriteButton` (top-right) → gradient `MetaBar` (title 2-line clamp + `category · plays`) → `HoverOverlay` (navy 58%, PlayPill scale-in; disabled <768px).
- **States:** `default`; `hover/focus` (lift `translateY(-5px) scale(1.02)`, `--sh-lg`, shine sweep, art scale 1.14); `favorited` (heart Fill + pink); `loading` → render `<GameCardSkeleton size>` instead; `coming-soon` (subtle corner ribbon "Soon" when `playUrl===null`).
- **A11y:** `aria-label="{title} — {category} game, rated {rating}"`; fav button is nested focusable `role=button` with its own label; `:focus-visible` yellow outline.

### GameCardSkeleton
- **Props:** `size`. Shimmer gradient block matching the tile's grid span + min-height. Used during route/data transitions; keeps CLS at 0.

### GameRail
- **Props:** `title`, `icon`, `subtitle?`, `games: Game[]`, `scrollId`. Renders `SectionHeader` + horizontal snap-scroll row of square `GameCard`s + left/right `IconButton` arrows (desktop). Scrollbar hidden.

### Mosaic
- **Props:** `games: Game[]`, `pattern?: string[]` (default prototype pattern). 12/8/4-col responsive grid, `grid-auto-flow:dense`, maps each game to a size token.

### CategoryPill `'use client'`
- **Props:** `label`, `color` (`--c-*`), `href`, `active?`, `icon?`. Pill, color dot (or icon) + label; active = navy fill + scale. Used in cat bar + drawer + category sub-filters.

### SearchBox `'use client'`
- **Props:** `variant:'desktop'|'mobile'`, `value`, `onChange`, `onSubmit`, `placeholder?`, `showKbdHint?`. Pill input + `MagnifyingGlass`; desktop renders `LiveDropdown` child; mobile is the overlay's field. Debounced input handled by parent.

### LiveResultItem
- **Props:** `game`, `onSelect`. Thumb (gradient/real art) + title + `category · ★rating` + Play caret. Used in dropdown + mobile overlay.

### PlayButton
- **Props:** `variant:'overlay'|'cta'|'big'|'pill'`, `label?`, `onClick/href`, `size?`. `overlay`=white pill in hover layer; `cta`=pink→orange gradient full CTA (`--grad-cta`,`--sh-cta`); `big`=86px round white on stage; always the **custom Play triangle** SVG.

### RatingBadge
- **Props:** `rating:number`, `variant:'badge'|'inline'`. `badge`=white pill top-left of card (`Star` Fill + value); `inline`=stars row + numeric (detail page).

### FavoriteButton `'use client'`
- **Props:** `slug`, `active`, `size?`, `variant:'card'|'ghost'`, `onToggle`. `card`=round white btn (Heart Bold→Fill, pink when active, `pop` bounce on toggle); `ghost`=`♡ Favorite / ♥ Saved` text button on detail. Writes localStorage + toast.

### SectionHeader
- **Props:** `icon` (Phosphor name), `title`, `subtitle?`, `scrollId?` (adds rail arrows), `sort?` (adds sort `Select`). Navy icon-chip + title + muted subtitle.

### AdSlot
- **Props:** `variant:'display'|'interstitial'|'rewarded'|'sidebar'`, `label?`, `sizeHint` (reserved w/h for zero CLS), `frequencyKey?` (interstitial cap). Renders reserved-height container; dev = dashed placeholder w/ label, prod = network slot. Enforces §4 monetization rules (never over frame, never pre-first-play).

### IconButton
- **Props:** `icon`, `label` (aria, required), `badge?`, `variant:'surface'|'ghost'|'player'|'nav'`, `active?`, `onClick/href`. 44–46px round, `--surface` fill, hover lift. Used for header actions, player controls, rail arrows, bottom nav.

### PlayerStage `'use client'`
- **Props:** `game`, `onFirstPlay`. Player chrome bar (Sound/Reload/Fullscreen/Report IconButtons) + 16:9 stage hosting iframe (mount/destroy lifecycle) + preview poster + coming-soon state + rewarded-continue overlay host. Reserves aspect box at SSR.

### Toast `'use client'` / Modal / Drawer / SearchOverlay
- **Toast props:** `message`, `icon?`, `duration?`. Navy pill, bottom-center, auto-dismiss ≈2.6s. (No emoji in messages.)
- **Drawer/Overlay:** mobile menu (categories + links) and mobile search; slide/fade with `--ease-drawer`; Esc + click-outside close.

### Game data model (types the components consume)
Per `docs/01` §6: `id, slug, title, category, categories[], tags[], hook, description, rating, plays, playsNum, thumb (real art), g1/g2 (gradient fallback frame), playUrl, externalStoreUrl, sessionLength, difficulty, isFeatured/isPopular/isNew/isTrending, createdAt, version`. **`emoji` field is removed** — `thumb` (generated art) replaces it everywhere; `g1/g2` kept only as loading/frame gradient.

---

## 5. Increment 0 — style sign-off (assets only, no full build)

Goal: approve the **look** before generating 52+ thumbnails and building screens. Deliver a **static style board** (one page, no routing/data) rendering the component kit subset over the real design system, using **real generated thumbnails** for a handful of games.

### 5.1 Sample games to generate thumbnails for (from the prototype RAW array)
1. **Snake Eats Zone** (Arcade) — neon snake, dark arena
2. **Merge 2048 Number Puzzle** (Math/Puzzle) — glossy numbered tiles
3. **Bubble Pop Mania** (Matching) — cluster of glossy bubbles
4. **Fruit Slice Frenzy** (Arcade) — sliced fruit + juice splash
5. **Block Puzzle Jewel** (Puzzle) — jewel/tetromino blocks
6. *(optional 6th for a `w` wide banner)* **Car Drift Racing 3D** (Racing) — drifting car, neon track

### 5.2 ART STYLE DIRECTION (one cohesive, professional set)

Think **premium hyper-casual mobile game cover / App Store icon art** — the look of a real Poki/mobile portal, not generic AI slop. Every thumbnail in the set must share:

- **Composition:** ONE clear hero subject, centered, generous padding (~12% margin so it survives cover-cropping to `f/w/t/m/s` aspects). Subject fills ~65–75% of frame.
- **Finish:** glossy 3D-rendered / soft-vinyl look — smooth rounded forms, subtle sub-surface glow, gentle specular highlights, soft contact shadow under the subject.
- **Lighting:** consistent **top-left key light**, soft rim light on the opposite edge, no harsh cast shadows. Same lighting angle across all six so they sit together.
- **Palette:** each cover pulls from the brand set (`--aqua #0BE0D0, --navy #10233F, --pink #FF4D7D, --yellow #FFC531, --purple #7C5CFF, --lime #B8F135, --blue #00A8FF`). Background = a smooth 2-stop diagonal gradient in the game's dominant hue over deep navy, with a faint dotted-glow texture (echoes the site bg). High saturation, high contrast, "candy" energy.
- **Framing/output:** 1:1 **square master at ≥1024×1024** (prefer 1200²). Cover-crop in-app via `object-fit:cover` with focal center. No rounded corners baked in (the card supplies `--r`).
- **HARD constraints (avoid AI-slop):** **NO text, NO letters, NO title, NO logo, NO watermark, NO UI/buttons, NO borders/frames** baked into the art — the GameCard renders the title in its meta bar, and baked text comes out garbled (the mockups literally show "CONNRECT"/"Faverltes"). No photorealism, no gore, no realistic human faces, no brand-lookalike characters. Clean edges, no busy background clutter, nothing touching the frame edge.
- **Cohesion test:** placed side by side in the mosaic, the six read as one family (same finish, same light, same background logic, same saturation). If one looks flatter/darker/text-laden, regenerate.

Numbered/lettered games (2048, word games) are the exception risk: render the "2" "0" "4" "8" as **sculpted 3D block digits as shapes/objects**, accepted as iconography — but keep them minimal and re-review for garbling.

### 5.3 Component-kit subset for the style board
Render these, static, with the 5–6 real thumbnails:
1. **Header** (logo + desktop SearchBox + Favorites/Profile IconButtons) — proves brand + icon set.
2. **CategoryPill bar** (6–8 pills, one active) — proves pill system + category colors + SVG dots/icons.
3. **Mosaic** with all five size tokens (`f`,`w`,`t`,`m`,`s`) using the real thumbnails — proves the signature layout + art at every size/crop.
4. **GameCard** shown in all states: default, hover, favorited, `coming-soon`, and **skeleton** — proves interaction polish.
5. **PlayButton** (overlay pill + pink CTA) + **RatingBadge** + **FavoriteButton** + **SectionHeader** (with SVG icon chip) — the small parts.
6. One **AdSlot** display placeholder — proves ads look intentional, not broken.
*(No routing, no live search, no iframe, no personalization. One HTML/Next page = the style board.)*

### 5.4 Ready-to-use image-generation prompts
For the Gemini pipeline in `CLAUDE.md` (`generate_image.py "<prompt>" <out_prefix>`). Shared **style preamble** (prepend to every prompt for cohesion):

> `STYLE: glossy 3D-rendered premium mobile game cover icon, single hero subject centered with generous padding, smooth soft-vinyl forms, soft top-left key light with gentle rim light and a soft contact shadow, high-saturation candy colors, smooth 2-stop diagonal gradient background over deep navy #10233F with a faint dotted glow, clean edges, nothing touching the frame. Square 1:1, ~1200x1200. ABSOLUTELY NO text, letters, words, numbers-as-labels, logos, watermarks, UI, buttons, or borders. No photorealism, no realistic human faces.`

1. **Snake Eats Zone** — `generate {STYLE} A cute chunky neon-green and aqua #0BE0D0 coiled snake with big friendly eyes as the hero, glowing softly on a dark navy arena with subtle grid-glow, a single glossy apple accent in pink #FF4D7D. out_prefix: thumb_snake_eats_zone`
2. **Bubble Pop Mania** — `generate {STYLE} A tight cluster of glossy translucent bubbles in aqua, pink #FF4D7D, purple #7C5CFF, yellow #FFC531 and blue #00A8FF with bright specular highlights, one bubble mid-pop with a soft sparkle, on a teal-to-navy gradient. out_prefix: thumb_bubble_pop_mania`
3. **Fruit Slice Frenzy** — `generate {STYLE} A dynamic diagonal slice through a juicy watermelon and orange with a clean blade streak and a few glossy juice droplets, vivid red-pink and yellow fruit, on a blue-to-navy gradient. out_prefix: thumb_fruit_slice_frenzy`
4. **Merge 2048 Number Puzzle** — `generate {STYLE} A neat stack of glossy rounded 3D puzzle blocks in warm orange #FF8A00, yellow #FFC531 and pink, sculpted as smooth cubes (digits only as subtle embossed shapes, not readable labels), on a warm-to-navy gradient. out_prefix: thumb_merge_2048`
5. **Block Puzzle Jewel** — `generate {STYLE} A small arrangement of glossy faceted gems and rounded tetromino blocks in purple #7C5CFF, aqua #0BE0D0 and pink, catching soft light, on a violet-to-navy gradient. out_prefix: thumb_block_puzzle_jewel`
6. *(optional wide)* **Car Drift Racing 3D** — `generate {STYLE} A cute glossy toy-style red sports car mid-drift with a soft motion arc and light tire smoke, neon track hints, on a purple-to-navy gradient. out_prefix: thumb_car_drift_racing_3d`

Run each; review as a set against §5.2 cohesion test; regenerate any outlier before mass generation.

---

## 6. Handoff checklist for developers
- Tokens in §1 → `tokens.css`; enforce no-emoji ESLint rule.
- Install `@phosphor-icons/react`; build one `<Icon>` wrapper (§2); author 2 custom SVGs (logo mark, Play triangle).
- Build the §4 component kit; render the §5.3 style board first for sign-off.
- Reserve all image/iframe/ad boxes at SSR (zero CLS); `next/image` for thumbnails with `priority` on above-fold mosaic tiles.
- Related-games rail (§3.4) is the P1 module — always populated, above the fold after the frame.
- Do NOT build routing/search/iframe/personalization until the style board is approved (Increment plan, `docs/01` §8).
