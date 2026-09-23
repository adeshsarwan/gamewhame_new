# GameWhame — Connections & Infrastructure

Central reference for every external connection this project uses: hosting,
deploy, game storage. **No secrets live in this file** — real credentials are in
`.env.r2.local` at the repo root (git-ignored). Rotate any key that leaks.

---

## 1. App hosting & deploy (the website)

- **Stack:** Next.js (App Router) → **OpenNext** → **Cloudflare Workers**.
- **Repo:** `adeshsarwan/gamewhame_new` → connected to the **`gamewhame-new`** Worker.
- **Deploy:** push to **`main`** → auto-deploys. No manual step.
- **Production domain:** gamewhame.com
- **Hard rules (do not touch):** `open-next.config.ts`, `wrangler.jsonc`,
  `package.json` deps, `.gitignore`. There is intentionally **NO committed lockfile** —
  do not add one.
- The app repo should stay lean: **game files are NOT committed** — they live in R2 (below).

---

## 2. Game storage — Cloudflare R2 (the games)

Games are static HTML5 builds served from an R2 bucket via a CDN domain, loaded
in a cross-origin `<iframe>`. This keeps the app deploy small and dodges the
Workers static-asset file cap.

- **Bucket:** `gamewhame-files`
- **S3-compatible endpoint:** `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`
- **Public CDN domain:** `games.gamewhame.com` (bound to the bucket root)
- **Credentials:** `.env.r2.local` (git-ignored). Keys: `R2_ACCOUNT_ID`,
  `R2_ENDPOINT`, `R2_BUCKET`, `R2_KEY`, `R2_SECRET` (+ AWS-style aliases for
  aws-cli/rclone).

### Layout (two lanes in one bucket)

| Path in bucket | Lane | Public URL |
|---|---|---|
| `<slug>/index.html` | Unity WebGL builds (heavy) | `https://games.gamewhame.com/<slug>/index.html` |
| `h5-games/<slug>/index.html` | Lightweight HTML5 (Construct 2/3, CreateJS) | `https://games.gamewhame.com/h5-games/<slug>/index.html` |

**One game = one folder**, uploaded with its original structure preserved
(`index.html` at the folder root, plus `js/`, `images/`, `media/`, etc.).
Do NOT rename build files after upload — the HTML references them by path.
Never modify or delete anything outside the lane you're writing to.

### Uploading games → R2

Reusable script: **`scripts/r2-upload.py`** (reads `.env.r2.local` automatically;
needs `pip install boto3`). It sets the correct **Content-Type per file** — this
is essential, or the browser won't execute the HTML/JS.

```bash
# upload every game folder under public/games/ (staging) -> h5-games/<folder>/
python3 scripts/r2-upload.py public/games

# upload a single game
python3 scripts/r2-upload.py public/games/pull-the-thread pull-the-thread
```

To connect with a GUI tool (e.g. Cyberduck, S3 Browser) or aws-cli/rclone:
- Protocol: **Amazon S3**
- Server/endpoint: the `R2_ENDPOINT` value
- Access Key ID / Secret: `R2_KEY` / `R2_SECRET`
- Region: `auto`
- Bucket: `gamewhame-files`, then work inside `h5-games/`

### How the app plays an R2 game

A catalog entry points at the CDN URL and the play page renders a cross-origin
iframe. `.br`-compressed Unity files serve WITHOUT `Content-Encoding: br` (Unity
JS-decompresses them) — this is intentional, don't "fix" it. Cross-origin means
we can't read a game's internal load %, so the loader is indeterminate / cleared
on the iframe `load` event.

---

## 3. Image generation (assets)

Free, via the unofficial Gemini web API — see the "Image / asset generation"
section in `CLAUDE.md`. Not a production runtime dependency.

---

## Quick facts

- Add a new HTML5 game: upload `h5-games/<slug>/` to R2, then add a catalog entry
  pointing at `https://games.gamewhame.com/h5-games/<slug>/index.html`. No app
  redeploy needed for the game files themselves; deploy only when the catalog/app
  code changes.
- Rotate R2 keys: Cloudflare dashboard → R2 → Manage API Tokens, then update
  `.env.r2.local`.
