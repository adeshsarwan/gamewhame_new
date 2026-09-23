---
name: game-thumbnail
description: >-
  Generate game thumbnails / cover art for GameWhame from gameplay screenshots,
  and toggle whether a thumbnail shows the game title. Use when asked to
  generate a game thumbnail, create cover art, make a thumbnail from
  screenshots, produce a no-title vs with-title thumbnail, or switch a game's
  thumbnail title on or off. Covers the exact screenshot -> Gemini image tool ->
  variant store -> catalog activation pipeline for this repo.
---

# Game thumbnail pipeline (GameWhame)

Produces two square (1:1) cover-art variants per game — one with **no title**
and one **with title** — stores both in `thumbnails/<slug>/`, and activates one
into production via `scripts/thumb-toggle.py`.

Repo root: `/Users/chandrakanthpollishetty/Documents/Apps/gamewhame`.

## 0. Ground rules

- **No emoji** anywhere — code, prompts, art, copy.
- Card aspect is **1:1 (square)**.
- Production serves `public/thumbs/<slug>.png` AND `public/thumbs/<slug>.webp`
  (`Thumb.tsx` prefers `.webp`, falls back to `.png`). Both are needed.
- `thumb` + `hasRealArt` live in **both** catalog mirrors
  (`lib/games-catalog.json`, `data/games-catalog.json`) — keep them
  byte-identical. `thumb-toggle.py` handles this; never hand-edit.
- `thumbnails/` is the versioned source store; `public/thumbs/` is what ships.
- Do not commit game builds.

## 1. Inputs: two screenshots per game

The user captures these (agents can't screenshot the running game reliably):

- the **TITLE / logo screen** (for the game's own lettering, font, colors), and
- an **INTERESTING GAMEPLAY moment** (the hero shot source).

Saved under `screenshots/<game name>/`.

Capture note: browser tab capture via `getDisplayMedia` returns **BLACK** for
WebGL games. The user should share **Entire Screen** or take an OS screenshot
(Cmd+Shift+4) instead.

## 2. GOTCHA: macOS screenshot filenames

macOS names screenshots like `Screenshot 2026-09-24 at 2.13.09 AM.png`, but the
space before `AM`/`PM` is a **narrow no-break space (U+202F)**, not a normal
space. Typing the filename will not match it, and the Gemini uploader also fails
on paths with odd spaces.

**Always copy to space-free names first**, matching a timestamp *substring*
rather than typing the name. Example (adjust dir/substrings):

```python
import glob, shutil, os
src_dir = "/Users/chandrakanthpollishetty/Documents/Apps/gamewhame/screenshots/Fill The Water"
out_dir = "/private/tmp/thumb-src"  # or the scratchpad dir
os.makedirs(out_dir, exist_ok=True)
picks = {"title": "2.13.09", "play": "2.14.55"}  # unique timestamp substrings
for label, needle in picks.items():
    match = next(p for p in glob.glob(os.path.join(src_dir, "*.png")) if needle in p)
    dst = os.path.join(out_dir, f"ftw-{label}.png")
    shutil.copyfile(match, dst)
    print(dst)
```

Use the resulting space-free absolute paths as references.

## 3. Image tool (free Gemini web API)

From `CLAUDE.md`. Run with **cwd = `/Users/chandrakanthpollishetty/Documents/Apps/utlities/gemini-api`**:

```bash
./venv/bin/python generate_image.py "<prompt — MUST contain the word 'generate'>" \
  <out_prefix> <ref1.png> [ref2.png]
```

- Output is `<out_prefix>_0.png`.
- Pass screenshots as **reference images** (space-free absolute paths).
- Retry on transient `Session is closed`.

## 4. NO-TITLE prompt template

Reference = the **GAMEPLAY** screenshot. Fill in the bracketed pieces from what
that screenshot actually shows.

> generate a vibrant, exciting SQUARE 1:1 game thumbnail. MATCH the reference
> art exactly — [describe the game's real 2D style / palette / main subject,
> e.g. "flat cartoon puzzle board, soft pastel pins and a bright coloured
> thread, clean vector shapes"]. RECOMPOSE it into a fresh, dynamic hero shot —
> do NOT copy the screenshot layout. High contrast, playful, one strong focal
> point. Absolutely NO text, NO logos, NO watermark, NO UI elements.

Save output -> `thumbnails/<slug>/notitle.png`.

## 5. WITH-TITLE prompt template (must be legible)

References, in order: (1) the **just-generated no-title image** (keeps the art),
(2) the **TITLE screenshot** (for the logo font/colors).

> generate a SQUARE 1:1 game thumbnail. Use the FIRST reference as the art —
> keep it unchanged in the lower two-thirds. ADD the title "[GAME TITLE]" across
> the top, matching the game's own lettering from the SECOND reference. Put the
> title on a soft, semi-transparent rounded [dark|light] scrim with a bold
> outline and a drop shadow so it is clearly readable over the art. NO emoji, NO
> watermark, NO extra UI.

Save output -> `thumbnails/<slug>/withtitle.png`.

**Why the scrim matters:** an early attempt placed the title directly on busy
art with no scrim and it was unreadable. The semi-transparent rounded scrim +
bold outline + drop shadow is required for legibility.

## 6. Store both, then activate one

```bash
cd /Users/chandrakanthpollishetty/Documents/Apps/gamewhame
python3 scripts/thumb-toggle.py list                       # inspect
python3 scripts/thumb-toggle.py activate <slug> withtitle  # or notitle
```

`activate` copies the chosen variant to `public/thumbs/<slug>.png`, builds the
`.webp` (cwebp -q 82, falling back to `sips`), and sets `thumb` +
`hasRealArt: true` in both catalog mirrors. `activate-all <variant>` does every
stored game.

## 7. Worked examples (already in the store)

- **pull-the-thread** (Construct 2 puzzle): coloured thread + pins on a soft
  board. Both variants in `thumbnails/pull-the-thread/`. The legible with-title
  was the second attempt (v2) after the first lacked a scrim.
- **fill-the-water** (physics pour puzzle): water flowing to fill glasses to a
  line. Both variants in `thumbnails/fill-the-water/`.

Both live in `thumbnails/<slug>/{notitle,withtitle}.png` as the reference for
future games.
