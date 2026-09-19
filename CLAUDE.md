# GameWhame — gamewhame.com

An HTML5 games portal (Poki-style) built to scale to 1M+ users. Ad-monetized.

## How to work on this project (READ FIRST)

- **Correct the user when they are wrong.** Do not build something just because it was asked. If a request is a mistake, hurts the P1 metric, or has a better alternative, say so *before* building and explain why. The user explicitly wants push-back over blind execution.
- **Build the best-in-class version, not the literal request.** Aim for a real, powerful games website that could scale to 1,000,000 users — not a demo.
- **Ship in small, reviewable increments.** Prefer sample assets / single components for approval before building the whole thing. Get a yes on style before scaling it out.
- **No emoji anywhere in the product.** Every icon must be a real, professional SVG/asset. Emoji in code, UI, thumbnails, or copy is not acceptable. (The `inspiration/index.html` prototype uses emoji as placeholders — these must be replaced.)
- **Respond to the user in simple, short summaries.** No long detailed dumps unless asked.

## P1 metric
Maximize time-on-site (session length / retention). Every product and design decision is judged against this first.

## Stack & hosting (from PRD)
- **Next.js** (App Router), mobile-responsive, SEO-optimized, SSR/SSG shell for instant loads + zero CLS.
- Hosted on **Cloudflare Pages** (`@cloudflare/next-on-pages` edge runtime).
- Games are HTML5, served from an isolated **Cloudflare R2** bucket (`gamewhame-files`), loaded in a sandboxed `<iframe>` on `/play/[slug]`, mounted client-side only and destroyed on route change (set `src="about:blank"` + remove) to prevent memory leaks.
- Game list comes from `inspiration/Ignia Games` — games to convert/host.

## Source-of-truth assets (in `inspiration/`)
- `index.html` — a **complete working SPA prototype**: design system, 52 games, mosaic grid, live search, favorites, category filtering, game detail/play pages, mobile nav. This is the design + feature reference. (Replace all emoji with real art.)
- `GameWhame_High_Resolution_Designs (2)/` — high-res mockups incl. a **personalization quiz funnel** (Find My Perfect Game → 3 questions → building results → rewarded-ad gate → personalized arcade) and **rewarded-ad** mechanics (continue/extra-life). Desktop + mobile.
- `PRD.docx`, `H5 Gaming site - Development.docx` — technical requirements.

## Design system (extracted from prototype)
- Colors: aqua `#0BE0D0`, navy `#10233F`, pink `#FF4D7D`, yellow `#FFC531`, purple `#7C5CFF`, lime `#B8F135`, blue `#00A8FF`.
- Fonts: Nunito (display, 700–1000 weight), Plus Jakarta Sans (body).
- Rounded, playful, high-contrast; pill buttons; soft shadows; dot/confetti motifs.

## Image / asset generation (FREE)
Use the unofficial Gemini web API for all generated art:
```
/Users/chandrakanthpollishetty/Documents/Apps/utlities/gemini-api/venv/bin/python \
  generate_image.py "<prompt — include the word 'generate'>" <out_prefix> [ref1.png ref2.png...]
```
- Run with `cwd` = `/Users/chandrakanthpollishetty/Documents/Apps/utlities/gemini-api`.
- Output: `<out_prefix>_0.png`. Refs turn it into an edit (holds geometry fixed).
- Free (auth via browser cookies), retry on transient "Session is closed".
- Reference pipeline: `../POD/pipeline/generate.py`.

## Decisions log
- **PRODUCTION GAME INTEGRATION (2026-09-20).** Deploy is **OpenNext → Cloudflare Workers** (repo `adeshsarwan/gamewhame_new`, connected to `gamewhame-new` Worker; push to `main` auto-deploys). Do NOT edit `open-next.config.ts`, `wrangler.jsonc`, `package.json` deps, `.gitignore`, or restore the old lockfile; there is intentionally NO committed lockfile. Real games are Unity WebGL builds on the **games CDN** `https://games.gamewhame.com/<slug>/index.html` (R2 bucket `gamewhame-files`) — never proxy `.wasm/.data/.js/.br` through the Next Worker, never copy Unity files into the repo, never create another R2 domain/binding/Worker proxy. The player is a **cross-origin `<iframe>` to that CDN URL** (`components/UnityPlayer.tsx`), driven by two catalog fields per game: `gameUrl` + `engine: "unity-webgl"`. Keep the GameWhame shell ours; only the player area is the iframe. Lazy-load (no Unity on home/category). `.br` files serve WITHOUT `Content-Encoding: br` and Unity JS-decompresses them — this works, don't "fix" it. Cross-origin means we can't read Unity's % progress (indeterminate loader). First integrated game: dot-connect-mania. **Known issue to report, not fix:** the Unity build's own index.html 404s on `gam-config.js` + `gam-manager.js` (GAM ad scripts missing on the CDN).
- **HOMEPAGE = POKI-STYLE, GAMES-FIRST (2026-09-17, supersedes the mascot-hero redesign).** Inspiration: poki.com. Rules: NO big hero — the game grid is front-and-center like an app screen, games visible immediately. Recently-played games at the TOP in BIGGER tiles (fallback to featured/popular for new users). The mascot is demoted to a small SEARCH WIDGET/tile within the layout, not a hero. Dark navy top header with the new minimalist logo + prominent global search. REMOVE the sticky "All Games / Popular / New Games" category pill menu (category discovery via a Poki-style left icon sidebar on desktop + mobile menu). New minimalist gaming logo (crisp SVG, good on white; light variant for dark header). Poki is inspiration only — be the judge, keep it original and no-emoji.
- **SCOPE LESSON (2026-09-17):** Building the 8 from-scratch HTML5 games was OUT of scope — the scope is the PORTAL; real games come from the Ignia list hosted on R2. "Build as much as possible while I sleep" means within the agreed scope, NOT inventing new scope. Do not add unrequested deliverables. The 8 games are KEPT as clearly-labeled TEMPORARY placeholders (user decision) until real Ignia games arrive; they live only in `public/games/` and are removable cleanly (delete dir + null the 8 `playUrl`s).
- **The prototype (`inspiration/index.html`) is treated as a BASELINE TO BEAT, not a target.** User: "the working prototype is very bad, we have to improve it." Elevate everything — richer micro-animations, better hover/press/focus interactions, smoother motion, more polish. Every screen and component must feel a clear step above the prototype. (User feedback, 2026-09-17.)
- **Personalization quiz funnel is CUT.** No "Find My Perfect Game", no 3-question flow, no "building results", no personalized "Your Arcade", no pre-play rewarded-ad gate. The site is instant-play (Poki-style). Ignore mockups 02/03/04/05 and the funnel parts of 08/09. (User decision, 2026-09-17.)
- **In-game rewarded ads are KEPT** as an optional, player-initiated "watch to continue / extra life" (mockup 08's in-game overlay only) — never a gate to start playing.
- **First build increment = sample assets + component kit** for style sign-off before scaling.

## Open questions still to resolve with user
- PRD's R2 asset paths (`https://gamewhame.com{slug}/index.html`) omit a path prefix and collide with the app on the same origin — likely should be a subdomain like `files.gamewhame.com/<slug>/`. Confirm before wiring.
- iframe `sandbox="allow-scripts allow-same-origin"` together weakens sandboxing; revisit per-origin isolation.
- Interstitial (between-games) frequency cap; minimum count of truly instant-play ported games at launch; strip emoji from prototype's SEO copy.

## Build workflow (agent sequence the user wants)
1. Product Manager agent → lean feature doc → summarize to user.
2. UI/UX agent → screens/design based on mockups + prototype.
3. Developer agents (parallel) → build in increments, sample assets/components first for approval.
