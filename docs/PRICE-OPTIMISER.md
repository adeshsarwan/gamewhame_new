# Price Optimiser — publisher integration (GameWhame)

Authoritative spec: `skills/gamewhame-price-optimiser-publisher-handoff.md`.
Platform side (site id `51`, GAM network `23360556473`, runtime config,
experiments, floors, telemetry allowlist) is **centrally managed — never changed
from this repo.**

## The one rule

**Price Optimiser owns the GPT/GAM lifecycle.** This app never calls
`googletag.defineSlot` / `defineOutOfPageSlot` / `display` / `refresh`, never
loads a second GPT, never defines GAM units, never sets a floor and never runs
an experiment. The publisher does exactly three things:

1. loads the bundle once,
2. renders the managed DOM containers,
3. marks approved links as interstitial opportunities.

`npm run check:ads` fails the build if any of that drifts.

## Where things live

| Concern | File |
|---|---|
| All config + placement policy | `lib/adConfig.ts` |
| Rewarded SDK wrapper (grant logic) | `lib/priceOptimiser.ts` |
| Script tag + anchor mount | `app/layout.tsx` |
| Managed container renderer | `components/AdSlot.tsx` (`managedId` prop) |
| Sticky anchor container | `components/AnchorAd.tsx` |
| Interstitial link marking | `components/useInterstitialLink.ts` |
| Rewarded surface | `components/RewardedContinue.tsx` |
| Static acceptance gate | `scripts/check-ads.mjs` |
| Live post-deploy verification | `scripts/verify-ads-live.mjs` |

## Script

One `<Script id="gamewhame-price-optimiser" strategy="afterInteractive">` in the
root layout. The `id` makes Next dedupe it, so SPA route changes never
re-inject or re-bootstrap the bundle. Verified: one script tag and one bootstrap
across Home → Category → Game → Category → Game.

## Placements

| Route | Managed containers |
|---|---|
| `/` | `ad-incontent` (between Popular and New) |
| `/games/[category]` | `ad-incontent` (below the mosaic) |
| `/play/[slug]` | `ad-leaderboard` (below the player), `ad-incontent` (page foot) |
| all browse routes | `ad-anchor` (sticky, desktop/tablet only) |
| anywhere | `ad-results` — **not implemented** |

Rationale:

- **`ad-anchor` is excluded from `/play/*`.** A sticky bar over the game frame
  is the single worst thing we could do to time-on-site, the P1 metric.
- **`ad-anchor` is desktop/tablet only** (`adConfig.anchor.minWidth = 768`). On
  phones the GameWhame bottom nav already owns that strip; stacking a 50px ad on
  it costs ~110px of a small viewport. Flip `adConfig.anchor.mobile` to `true`
  to run 320x50 on phones — the container already supports that size.
- **`ad-results` is not rendered.** GameWhame has no real results/completion
  screen: third-party game builds own their end states and only a handful emit
  `gw:gameover`. The handoff says to add it only if a real results UX exists.
- The anchor is mounted exactly once, from the root layout, so `#ad-anchor` can
  never be duplicated. When unfilled it draws nothing and blocks no clicks, but
  it **keeps its layout box** — `display: none` gives a zero-size container that
  Price Optimiser's visibility check can never see, so the slot would never be
  requested (found in live testing).
- The anchor is route- and viewport-gated, so it is **not** in the
  server-rendered HTML and does not exist when Price Optimiser boots and scans
  for destinations. On mount it announces itself via
  `registerManagedSlots(["ad-anchor"])` (`lib/priceOptimiser.ts`), the
  documented preload/reveal lifecycle — never `refreshSlots()` / `refreshAll()`.
  Without this the anchor is never registered (found in live testing).

  Two things probed against the live bundle, both non-obvious:

  1. **`revealSlots()` alone is a no-op** for a slot Price Optimiser has not
     seen. `preloadSlots()` is what registers the destination and defines the
     GAM slot; `revealSlots()` then makes it live.
  2. **`window.PriceOptimiser` and its methods exist before the bundle has
     booted**, and a `preloadSlots()` call made in that window is silently
     dropped. The identical call is a no-op early and registers the slot once
     `status().loaded` is true. Readiness must therefore be checked against
     `status()`, never against "the method exists" —
     `registerManagedSlots()` polls for it (bounded, 20s).

  A container that remounts on SPA navigation reuses its existing preload and
  only reveals again, so no duplicate slot is ever defined.

Sizing: the anchor container is 320px min-width / 50px min-height on phones and
up to 748px wide / 90px min-height from tablet up, so neither 320x50 nor 728x90
clips. In-flow containers reserve their height, so fill causes no CLS.

## Interstitial

Only game tile → gameplay links carry `data-google-interstitial="true"`:
`GameCard` (every grid, rail and mosaic tile) and `RelatedList` rows. Header,
footer, sidebar, category, breadcrumb, legal and external links are **not**
marked, and neither are "coming soon" tiles that do not lead to gameplay.

One action = one workflow: the publisher never intercepts the click (no
`preventDefault`, no competing overlay). Instead a clicked tile stops accepting
pointer events for `adConfig.interstitial.clickGuardMs` (1200ms), so a double or
triple tap cannot open a second workflow. Verified: three rapid clicks produce
exactly one `history.pushState`.

The previous publisher-owned mock interstitial (`components/InterstitialGate`)
was **deleted** — it called `preventDefault()` on every third `/play/` click,
which is exactly the competing workflow the handoff forbids.

## Rewarded

Wired, because a genuine reward already exists: the player-initiated
"Watch to continue" button in the game-over panel (`PlayerStage`). It is never a
pre-play gate and never fires mid-run.

`lib/priceOptimiser.ts` grants **only** on an explicit rewarded/granted outcome
from the SDK. Preload success, show, close, dismiss, no-fill, error and timeout
all grant nothing. One rewarded workflow at a time; every call fails safe.

> **Needs confirming against the live bundle:** the exact shape
> `showRewarded()` resolves with. The wrapper normalises the common shapes
> (`true`, `{granted}`, `{rewarded}`, `{status:"granted"}`, …) and treats
> anything it cannot positively read as *not granted*. If the bundle returns
> something else, tighten `normalise()` in `lib/priceOptimiser.ts`.

The game-over panel is only reachable for games that post `gw:gameover`, so in
practice today the rewarded path is rarely hit.

## Outstream

Not implemented. No containers, no UI, no API calls. `check:ads` fails if any
Outstream reference appears.

## Telemetry

Identity is `gamewhame.com` only. `www.gamewhame.com` is not added, and no
JobGuideMatch / jobsthe.world identity exists anywhere in the app.

## Verification

```bash
npm run check:ads                                   # static acceptance gate
npm run verify:ads                                  # live, against gamewhame.com
npm run verify:ads -- --base http://localhost:3001  # live, against a local build
```
