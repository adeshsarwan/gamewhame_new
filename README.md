# GameWhame

A Poki-style HTML5 games portal ([gamewhame.com](https://gamewhame.com)) — a bright, instant-play
arcade of free browser games. No sign-up, no downloads: tap a tile and play. Built to scale to
1M+ users with an SSR/SSG shell for instant loads and zero layout shift, and monetized with
reserved, non-intrusive ad slots.

The product goal (P1) is **time-on-site** — session length and retention. Discovery loops
(mosaic, rails, "more games like this", recently-played) are everywhere so the next game is
always one tap away.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript** (strict)
- **Styling:** design tokens (`app/tokens.css`) + global base (`app/globals.css`) + CSS Modules
  per component. No Tailwind.
- **Fonts:** Nunito (display) + Plus Jakarta Sans (body) via `next/font/google`
- **Icons:** a local bold-rounded SVG set (`components/Icon.tsx`) + two hand-authored brand marks
  (`components/BrandMarks.tsx`). **Zero emoji** anywhere — enforced by `npm run check:emoji`.
- **Hosting:** Cloudflare Pages (static/SSG shell; `images.unoptimized` for edge-served thumbnails)

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build (prerenders 76 pages)
npm run start        # serve the production build
npm run check:emoji  # no-emoji gate (must stay clean)
npx tsc --noEmit     # type-check
```

## Routes

- `/` — home: status strip, hero mosaic, Popular/New rails, category sections
- `/games/[category]` — 18 categories (incl. virtual `popular` / `new`): banner, mosaic,
  sub-filter pills, sort select, dense grid with "Load more", ad slot
- `/play/[slug]` — 52 game pages: the P1 play engine (client-only sandboxed iframe, poster,
  ready/score/game-over protocol, rewarded "watch to continue", related rails, interstitial)
- `/search?q=` — live results, empty landing, and no-results state
- `/favorites` — localStorage-backed, live-synced favorites

## The 8 playable games

Real HTML5 builds live under `public/games/<slug>/index.html` and are wired via the catalog's
`playUrl`. They speak a small `postMessage` protocol to the host player (`gw:ready`, `gw:score`,
`gw:gameover`):

1. snake-eats-zone
2. bubble-pop-mania
3. fruit-slice-frenzy
4. dot-connect-mania
5. merge-2048-number-puzzle
6. block-puzzle-jewel
7. math-puzzle-master
8. candy-match-blast

The other 44 games show an honest "Coming to the browser arcade" state (never a broken frame);
all 52 have real thumbnails in `public/thumbs/`.

## Project structure

```
app/            routes + layout, design tokens, fonts, global CSS
components/      shared component kit (each with a .module.css sibling)
lib/            data layer: games catalog + derived fields, categories, favorites, types
public/
  games/<slug>/ playable HTML5 builds (the 8 above)
  thumbs/       <slug>.png thumbnails (all 52)
docs/           product, UI/UX, assets, foundation, and QA docs
scripts/        check-no-emoji.mjs (the no-emoji gate)
```

Start with `docs/05-foundation.md` (the app map: files, components, and the `lib/` data layer),
then `docs/02-ui-ux-spec.md` (design system + screen specs). `docs/07-qa-report.md` is the QA +
fix log. Repo conventions and product principles are in `CLAUDE.md`.

## Data layer

`lib/games.ts` loads the 52-game catalog and derives the fields the lean catalog omits (rating,
plays, flags, description, difficulty, dates) **deterministically from the slug** — identical on
server and client, so no hydration mismatch and no runtime randomness. Import helpers from
`@/lib` / `@/lib/games` (`getGameBySlug`, `getGamesByCategory`, `getRelated`, `searchGames`,
`sortGames`, ...); do not reinvent the data layer.

## Deploy (Cloudflare Pages)

- The app builds static/SSG: home, all category pages, and all 52 play pages are prerendered;
  `/search` is dynamic on `?q=`.
- Deploy with **`@cloudflare/next-on-pages`** (edge runtime). Suggested Pages settings:
  - Build command: `npx @cloudflare/next-on-pages`
  - Build output directory: `.vercel/output/static`
  - Framework preset: Next.js
- Playable games are currently served from `public/games/<slug>/index.html` (same origin). Per the
  PRD they should ultimately be served from an isolated origin (e.g. `files.gamewhame.com/<slug>/`)
  for stronger iframe isolation — reconcile the catalog `playUrl` when that origin exists.

## Notes

- The play iframe is mounted client-side only and torn down (`src="about:blank"` + node removed)
  on route change — a hard requirement to avoid memory leaks at scale.
- Favorites are client-only (localStorage); components render the inactive state on the server and
  sync in `useEffect` to avoid hydration mismatches.
</content>

<!-- Cloudflare production build trigger: 2026-09-24 -->
