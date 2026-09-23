# thumbnails/ — game thumbnail source store

Versioned source of truth for game cover art. **Not served to production** — it
just holds both variants of every game's thumbnail so we can switch between them
without regenerating art.

## Layout

```
thumbnails/<slug>/
  notitle.png     # hero art, NO text/logo/watermark
  withtitle.png   # same art + the game title on a legible scrim
```

Card aspect is **1:1 (square)**.

## What actually ships

Production serves `public/thumbs/<slug>.png` **and** `public/thumbs/<slug>.webp`
(`Thumb.tsx` prefers the `.webp`, falls back to `.png`). Each game's `thumb` and
`hasRealArt` fields live in **both** catalog mirrors — `lib/games-catalog.json`
and `data/games-catalog.json` — which must stay byte-identical.

## Toggle between variants

Use the tool; do not hand-copy files or hand-edit the catalog.

```bash
# See every stored game, which variants exist, and which is live
python3 scripts/thumb-toggle.py list

# Make a variant live: copies png, builds webp, updates BOTH catalogs
python3 scripts/thumb-toggle.py activate <slug> notitle
python3 scripts/thumb-toggle.py activate <slug> withtitle

# Switch every stored game at once
python3 scripts/thumb-toggle.py activate-all withtitle
```

`activate` copies `thumbnails/<slug>/<variant>.png` -> `public/thumbs/<slug>.png`,
generates the `.webp` (cwebp, falling back to sips), and sets `thumb` +
`hasRealArt: true` in both catalogs. It is idempotent.

## Adding a new game's thumbnails

See the `game-thumbnail` skill (`.claude/skills/game-thumbnail/SKILL.md`) for the
full generation pipeline (screenshots -> Gemini image tool -> both variants). Save
the two outputs here as `notitle.png` and `withtitle.png`, then `activate` one.

## Rules

- No emoji anywhere.
- Keep both catalog mirrors identical (the tool does this for you).
- Do not commit game builds; `thumbnails/` is the art source store,
  `public/thumbs/` is what's served.
