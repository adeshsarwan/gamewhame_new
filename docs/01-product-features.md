# GameWhame — Product Feature Document (v1)

Owner: Product | Audience: UI/UX + Developers | Status: For build
Source of truth: `CLAUDE.md`, `inspiration/index.html` (working prototype), high-res mockups.
Rule reminder: no emoji anywhere in product — real SVG/asset icons only. Prototype emoji are placeholders to replace with generated thumbnail art.

---

## 1. Product vision & metrics

**Vision.** GameWhame is a bright, fast, Poki-style HTML5 games portal where anyone lands and is playing within seconds — no signup, no download, no gate. The site's job is not to show one game; it's to keep a player bouncing from one game to the next in a single sitting. Discovery is the product.

**P1 metric — MAXIMIZE TIME-ON-SITE** (session length / retention). Every decision below is judged against this first.

**Supporting metrics:**
| Metric | Why it matters |
|---|---|
| Games played per session | Direct engine of session length; proves the "discover next game" loop works |
| Return rate (D1 / D7) | Retention; favorites + recents + personalization drive it |
| Ad viewability & RPM | Monetization health — must rise *without* cutting session length |
| Time-to-first-play (guardrail, minimize) | If this climbs, P1 falls. Instant play is non-negotiable |

---

## 2. Core loops

**A. Instant-play loop (the entry).** Land → see mosaic → tap tile → game detail/play with instant iframe → playing in seconds. No gate before first play. This is the promise; protect it.

**B. Discover-next-game loop (THE P1 ENGINE).** While/after playing, the player is always one tap from the next game: a strong **related-games rail** on the play page, "More like this," recently-played, and category pills. The whole site is engineered so ending one game immediately offers the next. Most session length is won or lost here.

**C. Optional personalization loop (retention amplifier, not a gate).** After a player has already played, offer "Find My Perfect Game" → 3-question quiz → "Your Arcade" (% match feed). It sharpens the discover loop and gives a reason to return, but it is always optional and skippable — never the front door.

---

## 3. Feature list

### MVP (v1 must-ship) — a credible, sticky games site
- Home mosaic grid with variable tile sizes (feature/hero tiles), from real generated thumbnail art
- Category system: filter pills + dedicated category pages (Puzzle, Arcade, Action, Racing, Sports, Board, Word, Brain, Match, 3D, plus Popular / New)
- Live fuzzy search with debounce (title/tags/category weighting) — desktop dropdown + mobile overlay
- Game detail + **play page `/play/[slug]`** with correct iframe lifecycle (client-mounted, destroyed on route change, zero CLS)
- **Related-games rail** on the play page (key P1 driver) — always populated, above the fold after the frame
- Favorites + Recently Played (localStorage, no account)
- Mobile bottom nav + responsive layout
- SEO shell: SSR/SSG, per-game meta/OG, structured data
- Ad slots placed to not hurt retention (see §4): home/category display + between-games interstitial. No ad before first play.
- Honest "not yet in browser" state for games still being ported (link to store, offer instant-play similar games) — carried from prototype

### v1.1 (fast follow)
- Optional personalization quiz + "Your Arcade" feed (§5), entry points post-first-play
- Rewarded-ad mechanics tied to gameplay value (extra life / continue) — §4
- "Surprise Me" random-game button (feeds discover loop)
- Sort controls (Popular / Newest / Highest Rated / A–Z) on category pages
- Share links per game; toast/feedback polish

### Later
- Accounts + cross-device sync of favorites/recents/arcade
- Daily challenge / streaks / high-score chase (retention hooks)
- Editorialized collections ("Best 2-min games," themed rows)
- Achievements, weekly "new picks" email/notify
- Creator/portal analytics for RPM optimization per placement

---

## 4. Monetization plan

Ads fund the site but must never tax the P1 metric. **Two hard rules:**
1. **No ad blocks the first play.** Time-to-first-play stays near zero.
2. **No ad interrupts active gameplay.** Ads live in the gaps, not the game.

| Slot type | Placement | Rule |
|---|---|---|
| Display (banner/rail) | Home, category pages, detail page sidebars/footer | Static, no CLS; never overlays the play frame |
| Interstitial (between games) | On navigation *from* one finished game *to* the next | Only in the natural gap between plays; frequency-capped; skippable/short so it doesn't break the discover loop |
| Rewarded (opt-in) | Inside gameplay flow — extra life, continue run, unlock skin | Player-initiated only. Extends a session the player *wants* to continue |

**Rewarded ads are a P1 asset, not a tollgate.** Framed as "watch to continue your run / get an extra life," they lengthen exactly the sessions the player is enjoying. They must never be a mandatory gate to *start* playing or to see the arcade.

---

## 5. Personalization funnel

**Recommendation (product judgment — this is the requested push-back):**
The mockups show the quiz + a **rewarded-ad gate before first play**. That directly conflicts with P1 and with Poki's instant-play model — it raises time-to-first-play and bounce. **Make personalization OPTIONAL and surface it AFTER the first play, or as a clearly skippable side path — never a hard gate on the homepage, and never with an ad gate in front of results.**

- Homepage front door = the mosaic (instant play). Not the quiz.
- Quiz entry points: a "Find My Perfect Game" card/CTA in the feed, on the post-game screen, and in nav — all optional.
- Every quiz step has a visible **Skip**; results are shown with **no ad gate**. (Rewarded ads only appear later, in-gameplay, per §4.)

**The 3 questions → attribute mapping:**

| Q | Options | Maps to |
|---|---|---|
| Q1 — What games do you like? (multi) | Casual, Hyper Casual, Retro, RPG, Puzzle, Racing, Action, Sports | `category` / `categories` / `tags` match |
| Q2 — How much time? (single) | Quick Break 2–5m, Kill Some Time 5–15m, Settling In 15–30m, Let's Play 30+m | `sessionLength` attribute / tags (bite-size vs deep) |
| Q3 — What challenge? (single) | Chill & relaxing, Easy fun, Make me think, Challenge me, Bring it on | `difficulty` / `intensity` attribute |

**How "Your Arcade" is generated.** Score every game: category/tag overlap from Q1 (heaviest weight), session-length fit from Q2, difficulty fit from Q3, plus a rating/popularity tiebreaker (reuse the prototype's `related()`-style scoring). Surface a **#1 Match with a % score**, a "More Games For You" grid, mood pills reflecting answers (e.g. Casual · Puzzle · Quick Break · Easy Fun), and a **Surprise Me** button. Persist the arcade to localStorage so returning users land back in a personalized feed (return-rate driver). Every card is still instant-play — the arcade feeds loop B, it doesn't replace it.

---

## 6. Game data model

Derived from the prototype's model, extended for personalization and R2 hosting.

| Field | Notes |
|---|---|
| `id`, `slug` | slug = URL key for `/play/[slug]` |
| `title` | display name |
| `category`, `categories[]` | primary + secondary |
| `tags[]` | search + recommendation |
| `hook`, `description` | short pitch + SEO body |
| `rating`, `plays` / `playsNum` | social proof, sorting |
| `thumb` | **real generated art** (replaces prototype `emoji`); gradient `g1/g2` as fallback/frame |
| `playUrl` (R2) | iframe source; `null` until ported |
| `externalStoreUrl` | honest fallback while browser build pending |
| `sessionLength` | quick / medium / long — for Q2 |
| `difficulty` | chill / easy / think / hard — for Q3 |
| flags: `isFeatured`, `isPopular`, `isNew`, `isTrending` | mosaic sizing + rows |
| `createdAt`, `version` | freshness/sorting |

**Content pipeline.** Games come from the **Ignia Games** list (`inspiration/Ignia Games`), converted to HTML5, hosted in **Cloudflare R2** (`gamewhame-files`), served via sandboxed iframe on `/play/[slug]`. **Thumbnails are real generated art (no emoji)** via the Gemini image pipeline in `CLAUDE.md`; `sessionLength` and `difficulty` are tagged at ingestion so personalization works from day one.

---

## 7. Risks & open questions for the user

**Flagged in CLAUDE.md (need decisions):**
1. **Quiz/rewarded-ad gate before first play.** Recommend making it optional + post-first-play (see §5). Confirm we drop the hard gate.
2. **R2 asset paths.** PRD's `https://gamewhame.com{slug}/index.html` has no path prefix and collides with the app on the same origin. Recommend a subdomain, e.g. `files.gamewhame.com/<slug>/`. Confirm before wiring.
3. **iframe sandbox.** `allow-scripts` + `allow-same-origin` together weakens isolation. Recommend serving games from the separate `files.` origin so `allow-same-origin` is safe, or dropping it. Confirm isolation approach.

**Additional flags found:**
4. **Interstitial frequency.** Between-games ads help RPM but can break loop B if too frequent. Need a cap (e.g. 1 per N transitions) — propose a starting value and A/B it against session length.
5. **Honest "coming to browser" tiles.** Prototype links many games to the Play Store because browser builds aren't ready. Too many non-playable tiles hurts P1. Need a minimum count of truly instant-play games at launch — how many titles will be ported for v1?
6. **Prototype's SEO/marketing copy uses emoji.** Must be stripped and replaced per the no-emoji rule when carried into the real site.

---

## 8. Proposed increment plan (small vertical slices, approval before scaling)

Aligned with "sample assets/components first, get a yes on style before scaling."

**Increment 0 — Style approval (assets only, no full build).**
Generate **3–5 sample game thumbnails** (real art, no emoji) + one **hero mosaic tile** and the **core component kit** (game card, category pill, play button) in the design-system colors/fonts. Get explicit sign-off on look before mass thumbnail generation.

**Increment 1 — Home mosaic slice.**
SSR home with the approved cards, ~10 real games, category pills, responsive + mobile nav. Static, no play yet. Proves layout, CLS, and feel.

**Increment 2 — Play page + the P1 engine.**
`/play/[slug]` with correct iframe lifecycle (mount/destroy, zero CLS) for 1–2 ported games, plus the **related-games rail**, favorites, and recents. This is the loop-B proof — validate session flow here before anything else.

**Increment 3 — Search + category pages.**
Live search and full category pages over the growing game set.

**Increment 4 — Ads (non-intrusive first).**
Home/category display slots, then between-games interstitial with a frequency cap. Measure against time-to-first-play and session length.

**Increment 5 — Personalization (optional, post-play).**
Quiz → "Your Arcade" feed, plus rewarded extra-life/continue mechanics. Ship only after loop B is proven, and only as an optional path.

Ship each increment small, reviewable, and behind approval. Do not build the whole site before the style and the play-loop are validated.
