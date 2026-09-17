# GameWhame — Foundation (v1)

Owner: Foundation engineer | Audience: all downstream agents | Status: Built, `npm run build` passing.

The Next.js app, design system, shared component kit, `lib/` data layer, the Home page, and route stubs are in place. This doc is the map: where everything lives and exactly which file each downstream agent owns.

## Stack

- **Next.js 14.2.15** (App Router) · **React 18.3.1** · **TypeScript 5.4.5** (strict).
- **Styling:** global `app/tokens.css` (design tokens from docs/02 §1) + `app/globals.css` (reset/base) + **CSS Modules** per component. No Tailwind.
- **Fonts:** `next/font/google` — Nunito (display) + Plus Jakarta Sans (body) as variable fonts, exposed as `--font-nunito` / `--font-jakarta` (see `app/fonts.ts`).
- **Icons:** a **local bold-rounded SVG set** in `components/Icon.tsx` (single `<Icon name weight size color />` wrapper) — chosen over `@phosphor-icons/react` for zero dependency/build risk and precise brand control (docs/02 §2 explicitly allows this fallback). Two hand-authored brand SVGs in `components/BrandMarks.tsx` (`LogoMark`, `PlayTriangle`). **Zero emoji** — enforced by `scripts/check-no-emoji.mjs` (`npm run check:emoji`) plus an ESLint `no-restricted-syntax` guard on JSX.
- **Cloudflare Pages:** `next.config.mjs` sets `images.unoptimized: true` so thumbnails work on the edge without the Next image optimizer. Build is fully static/SSG (home + category + play prerendered; search is dynamic on `?q=`).

## Commands

```
npm install        # done
npm run dev        # polished homepage at :3000
npm run build      # passes — 76 pages generated
npm run check:emoji# no-emoji gate (clean)
```

## Project structure

```
app/
  layout.tsx            Root shell: fonts, tokens, Header, CategoryPillBar, <main>, Footer, MobileBottomNav, Toaster, skip-link, global SEO metadata
  page.tsx              HOME (built) — status strip, hero Mosaic, Popular/New rails, category sections, AdSlots, SEO card, JSON-LD ItemList
  globals.css           reset/base + reveal + a11y utilities
  tokens.css            design tokens (docs/02 §1) — source of truth
  fonts.ts              Nunito + Plus Jakarta Sans
  not-found.tsx         404 with popular rail
  games/[category]/page.tsx   STUB — category agent
  play/[slug]/page.tsx        STUB — play agent (P1 engine)
  search/page.tsx             STUB — search agent
  favorites/page.tsx          STUB — favorites agent
components/             shared kit (see below) — each has a .module.css sibling
lib/                    data layer + types (import from "@/lib" or "@/lib/games")
  games-catalog.json    copy of data/games-catalog.json (canonical source)
  types.ts games.ts categories.ts favorites.ts index.ts
public/thumbs/          <slug>.png thumbnails (assets agent owns; placeholder fallback covers missing)
scripts/check-no-emoji.mjs
```

## Component kit (`components/`)

| Component | Client? | Notes |
|---|---|---|
| `Icon` | no | local SVG set; `weight="fill"` for active states |
| `BrandMarks` (`LogoMark`, `PlayTriangle`) | no | the two custom brand SVGs |
| `Thumb` | yes | next/image + branded CSS placeholder fallback (category-tinted) |
| `GameCard` | yes | core tile; sizes f/t/w/m/s; hover lift + shine + play overlay; coming-soon ribbon |
| `GameCardSkeleton` | no | shimmer, matches tile footprint |
| `Mosaic` (+`MosaicSkeleton`) | no | variable grid, `DEFAULT_PATTERN`, `grid-auto-flow:dense`, priority tiles |
| `GameRail` | yes | SectionHeader + horizontal snap scroll + arrows |
| `GameGrid` | no | responsive dense square-card grid (reuse on category/search/favorites) |
| `CategoryPill` / `CategoryPillBar` | yes | pills; bar is sticky, active derived from pathname |
| `SearchBox` | yes | debounced live fuzzy dropdown (desktop) / overlay field (mobile); routes to /play or /search |
| `PlayButton` | no | variants overlay/cta/big/pill; always the Play triangle |
| `RatingBadge` | no | badge (card corner) / inline (stars row) |
| `FavoriteButton` | yes | localStorage, heart pop + particle burst, toast |
| `SectionHeader` | no | icon chip + title + optional arrows/sort/see-all |
| `AdSlot` | no | reserved-height labeled placeholder; variants display/interstitial/rewarded/sidebar |
| `IconButton` | no | round control; variants surface/ghost/player/nav; badge |
| `Header` | yes | logo + search + favorites(count)/profile; hosts mobile search overlay + menu drawer |
| `Footer` | no | brand + social SVG marks + columns + bottom bar |
| `MobileBottomNav` | yes | floating pill nav; Search dispatches `gw-open-search` (Header listens) |
| `StatusStrip` | yes | home top pills; live saved count |
| `Toast` (`toast()`, `<Toaster/>`) | yes | navy pill, bottom-center, ~2.6s |
| `Reveal` | yes | IntersectionObserver staggered fade-up |

## Data layer (`lib/`) — import from here, do not reinvent

`lib/games.ts` loads the 52-game catalog and **derives** the fields the lean catalog lacks (rating, plays/playsNum, description, sessionLength, difficulty, isFeatured/isPopular/isNew/isTrending, createdAt, externalStoreUrl) **deterministically from the slug** — same value on server and client, so no hydration mismatch and no runtime randomness.

Helpers: `getAllGames`, `getGameBySlug`, `getGamesByCategory`, `getPopularGames`, `getNewGames`, `getTrendingGames`, `getFeaturedGames`, `searchGames`, `getRelated`, `sortGames` (+ `SortKey`), `TOTAL_GAMES`.
`lib/categories.ts`: `CATEGORIES`, `categorySlug`, `categoryBySlug`, `categoryByLabel`, `categoryColorVar`, `categoryIcon`.
`lib/favorites.ts`: `getFavorites`, `isFavorite`, `favoriteCount`, `toggleFavorite`, `FAVS_EVENT` (dispatch on change; Header/StatusStrip/FavoriteButton all listen).
`lib/types.ts`: `Game`, `RawGame`, `TileSize`, `CategoryDef`, `IconName`, `SessionLength`, `Difficulty`.

## Downstream ownership — one file each

- **Play (P1 engine):** `app/play/[slug]/page.tsx`. Stub renders the reserved 16:9 stage, InfoCard, sidebar AdSlot, and the related rail (loop B already works). Build the `PlayerStage` client component (iframe mount/destroy lifecycle, poster/preview, honest "coming to browser" state, opt-in rewarded continue overlay), wire chrome controls, add the between-games interstitial. Use `getGameBySlug` + `getRelated`.
- **Category:** `app/games/[category]/page.tsx`. Stub renders banner + dense grid. Add sub-filter pills + sort select (`sortGames`), the top f/t/w/m/s `Mosaic`, "Load more", and an AdSlot after the mosaic.
- **Search:** `app/search/page.tsx`. Stub renders results grid + basic empty state over `searchGames`. Polish the empty state (SVG illustration, suggested categories) and any pagination. The header dropdown + mobile overlay already exist in `SearchBox`.
- **Favorites:** `app/favorites/page.tsx`. Stub renders the localStorage-backed grid + empty state via `lib/favorites`. Add the broken-heart SVG illustration and optional AdSlot.

## Gotchas

- **Thumbnails are contract-driven, not hardcoded.** `Thumb` shows real art when `hasRealArt && !placeholder`, else paints the branded placeholder; on image error it falls back too. Missing files just show the placeholder — the assets agent drops `public/thumbs/<slug>.png` and they appear with no code change. (A `hasRealArt` game whose PNG hasn't landed yet 404s once, then falls back — expected during asset rollout.)
- **Catalog has no rating/plays/flags** — those are derived in `lib/games.ts`. If the catalog later adds real values, prefer them over the derived ones there.
- **Favorites are client-only.** Components render the inactive state on the server then sync in `useEffect` — never read `localStorage` during render.
- **`playUrl` is null for all 52 games** in the catalog, so every card shows the "Soon" ribbon and the play page shows the poster. When games are ported, set `playUrl` and the play agent's `PlayerStage` takes over. (Note: another agent has begun adding playable builds under `public/games/<slug>/` — reconcile the catalog `playUrl` with those when wiring the iframe.)
- **No-emoji rule is enforced.** Run `npm run check:emoji` before finishing; use `<Icon>` or a real SVG, never a glyph.
- **CLS is 0 by construction** — mosaic cells reserve grid rows, `Thumb` uses `fill` inside reserved boxes, the play stage reserves `aspect-ratio:16/9`, and every AdSlot has a fixed `height`.
