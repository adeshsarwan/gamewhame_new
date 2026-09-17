# 10 — Poki-style, games-first homepage + chrome

Supersedes the mascot-hero redesign in `09-ui-redesign.md`. Inspiration: poki.com.
The homescreen is now an app-like grid of game tiles the visitor can start
immediately — no tall marketing hero.

## What changed (summary)

- **Killed the big hero.** `HomeHero` is removed from the home page (the file is
  kept but orphaned/unused). Games are visible above the fold on desktop and
  within a short scroll on mobile.
- **Dark navy top header** (`--header-bg` #10233f): new logo left, a prominent
  global search in the middle, favorites + Guest profile on the right, all in
  light-on-dark. The sticky category pill bar is **removed from the layout**
  (`CategoryPillBar` file kept but no longer imported anywhere).
- **Left icon sidebar** (`CategorySidebar`) replaces the pill bar for category
  navigation, Poki-style: a slim 92px rail of category disc emblems
  (`/icons/cat-<slug>.png`, SVG fallback) + labels linking to `/games/<slug>`.
  Sticky under the header, own quiet scroll, active state from the path.
  Collapses below 1024px, where the header menu drawer + `MobileBottomNav` take
  over.
- **Big-tile top strip** (`HomeTop`, client): the FIRST thing under the header —
  reads `gw_recent` and shows "Continue playing" in bigger 260px tiles; for new
  visitors it server-renders a "Featured games" fallback in the same geometry
  (zero CLS, never empty). Accepts an optional `leadWidget` rendered as the first
  cell of the row (backward-compatible; the mascot tile is passed here).
- **Mascot demoted to ONE grid tile** (`MascotSearchCard`): no longer a
  full-width teal banner. It is a single square grid-cell tile (matches the
  GameCard geometry) that sits INSIDE the `HomeTop` row as its lead cell — one of
  the widgets, not the centerpiece. Small `mascot-play.png` + "What to play?" +
  a "Surprise me" button (jumps to a random playable game via `useRouter`) + a
  "Search games" link to `/search` (full search already lives in the header).
  Takes an optional `games` prop for the random pick.
- **Games-first top.** The standalone mascot section is gone and `.page` top
  padding was cut (18px -> 10px), so real game tiles are visible immediately.
  Measured first `/play/` tile top: **129px** at 1440x900 (14.3% of viewport,
  target < 60%) and **129px** at 375x812 (target < 480px). The Popular grid
  renders 7 columns beside the sidebar at 1440.
- **App-like game grid** is the main content: dense `GameGrid` for Popular (24
  tiles) and New (18), then a few category discovery rails (Puzzle, Challenge,
  Relax) for variety, with two `AdSlot`s woven in. Reads as one continuous
  games-first screen.

## Layout order (home)

1. `HomeTop` — Continue playing / Featured big tiles, led by the
   `MascotSearchCard` tile as its first cell (mascot + "Surprise me" + search)
2. Popular Games — dense grid (`GameGrid`, 6 cols @1280, 2 cols on phone)
3. `AdSlot` (display)
4. New Games — dense grid
5. Puzzle & Brain / Challenge Yourself / Play & Relax — `GameRail` rows
6. `AdSlot` (display)
7. SEO card (kept, trimmed)

## The shell

`app/layout.tsx` wraps the sidebar + `<main>` in `.gw-shell` (flex row). The
sidebar is site-wide, so `/games/[category]`, `/play/[slug]`, `/search` and
`/favorites` all gain the rail on desktop and keep their existing centered
`gw-container` inside the reduced main width. No page-specific layout was
touched.

## Logo decision

New minimalist gaming mark: **"Play Spark"** — a rounded squircle in a
navy→teal gradient holding a crisp aqua play triangle with a yellow spark dot.
Chosen because a play glyph is the universal games affordance, it stays legible
down to a 16px favicon, and the gradient tile carries its own contrast so it
reads on both white and the dark header.

- Implemented in `components/BrandMarks.tsx` as `LogoMark` (replaces the old
  "W spark" tile) and a `Logo` lockup with a light-on-dark variant.
- Favicon kept in sync at `app/icon.svg` (auto-served by the App Router).
- The header wordmark is white with an aqua "Whame" accent; on small phones
  (<560px) it collapses to the mark only so the action row fits.
- **Alternates** (for a later pick) live at
  `scratchpad/logo-concepts.html` — three concepts rendered side by side on
  white and navy with favicon sizes: A · Play Spark (chosen), B · W Bolt (the
  brand "W" zigzag), C · Arcade Stick (joystick + action dot).

## New / changed files

- New: `components/CategorySidebar.tsx` + `.module.css`,
  `components/MascotSearchCard.tsx` + `.module.css`,
  `components/HomeTop.tsx` + `.module.css`, `app/icon.svg`.
- Changed: `app/layout.tsx`, `app/page.tsx`, `app/page.module.css`,
  `app/tokens.css` (additive `--header-*`, `--sidebar-w`, `--z-sidebar`),
  `app/globals.css` (`.gw-shell` / `.gw-main`), `components/Header.tsx` +
  `.module.css` (dark), `components/BrandMarks.tsx`,
  `components/IconButton.tsx` + `.module.css` (`header` variant).
- Orphaned but kept (no longer imported): `HomeHero`, `CategoryLauncher`,
  `CategoryPillBar` (+ their CSS). Safe to delete later.

## Constraints honored

- Reuses all `lib/` helpers; component prop APIs unchanged, so the other routes
  build and render. `RecentlyPlayed` / `PlayerStage` `gw_recent` contract intact.
- Zero-CLS: reserved tile/ad/image boxes; `HomeTop` fallback prevents an empty
  top. Full `prefers-reduced-motion` (inherited from tokens). Mobile-first, no
  horizontal overflow at 375. No emoji (`check:emoji` clean).

## Follow-ups

- Consider showing the sidebar in an **expanded** (icon+label inline) mode on
  very wide screens, or a collapse toggle.
- The Popular grid mixes real-art tiles with branded gradient placeholders
  (games without art yet / coming-soon) — fills in as more thumbnails land.
- Delete the orphaned `HomeHero` / `CategoryLauncher` / `CategoryPillBar` once
  confirmed nothing else will reuse them.
- Optional: a "few larger featured tiles mixed into the grid" (Poki size-mixing)
  inside the Popular grid itself, beyond the current big-tile top strip.
