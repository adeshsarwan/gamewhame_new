# GameWhame — Brand Assets (Mascot + Category Icons)

Generated 2026-09-17. All assets follow the approved glossy 3D soft-vinyl style from
`docs/04-art-style-guide.md`, matching the friendly blue/navy robot mascot and
rounded category tiles in the approved mockups
(`inspiration/GameWhame_High_Resolution_Designs (2)/`).

Generation mechanic: free unofficial Gemini web API
(`/Users/chandrakanthpollishetty/Documents/Apps/utlities/gemini-api/generate_image.py`).
Cutouts: `rembg` (bria-rmbg-2.0 model) via the POD pipeline venv, trimmed to bbox,
padded ~3–6%, saved as transparent PNG.

## A) Mascot — original friendly robot (3 poses, transparent PNG)

| File | Notes |
|---|---|
| `public/brand/mascot-wave.png` | Waving hello, full body, facing forward. Use for welcome/header moments. |
| `public/brand/mascot-play.png` | Holding up a game controller, excited/pointing. Use for CTAs, "play now", onboarding. |
| `public/brand/mascot-empty.png` | Shrug / "nothing here" pose. Use for empty states (no search results, empty favorites, 404). |

Design: glossy 3D soft-vinyl finish, teal `#0BE0D0` + navy `#10233F` body accents on
white, chunky headphones, big glowing smiley visor eyes — an original character in
the same spirit as the mockup mascot (not a copy). All three poses share the same
proportions/head/visor design so they read as one consistent character across the
site. Cutouts are clean (no halo/background remnants), trimmed to content, ~1024px
tall.

Raw (un-cut) masters kept at `styleboard/brand/mascot_wave_master.png`,
`styleboard/brand/mascot_play_master.png`, `styleboard/brand/mascot_empty_master.png`.

Contact sheet (on checkerboard, transparency visible): `styleboard/brand/_mascot_sheet.png`

## B) Category icons — glossy 3D emblems (19, transparent PNG, ~300–320px)

One consistent glossy soft-vinyl object per category, top-left key light, brand
accent colors, no baked text (except the intentional single letter on the "word"
tile), no emoji, no UI chrome.

| Slug | File | Subject | Accent |
|---|---|---|---|
| puzzle | `public/icons/cat-puzzle.png` | Interlocking jigsaw piece | purple `#7C5CFF` |
| arcade | `public/icons/cat-arcade.png` | Retro joystick | pink `#FF4D7D` |
| casual | `public/icons/cat-casual.png` | Glossy beach ball | yellow `#FFC531` |
| sports | `public/icons/cat-sports.png` | Trophy cup | orange `#FF8A00` |
| racing | `public/icons/cat-racing.png` | Checkered flag | blue `#00A8FF` |
| action | `public/icons/cat-action.png` | Lightning bolt | pink `#FF4D7D` |
| adventure | `public/icons/cat-adventure.png` | Explorer compass | lime `#B8F135` / navy |
| strategy | `public/icons/cat-strategy.png` | Chess rook | purple `#7C5CFF` |
| board | `public/icons/cat-board.png` | Pair of dice | yellow `#FFC531` / white |
| word | `public/icons/cat-word.png` | Alphabet tile with letter "A" | aqua `#0BE0D0` |
| brain | `public/icons/cat-brain.png` | Stylized brain | pink `#FF4D7D` |
| math | `public/icons/cat-math.png` | Plus/divide symbol cluster | purple `#7C5CFF` |
| matching | `public/icons/cat-matching.png` | Linked tiles/chain | aqua `#0BE0D0` |
| 3d | `public/icons/cat-3d.png` | Faceted cube | blue `#00A8FF` |
| hyper-casual | `public/icons/cat-hyper-casual.png` | Toy rocket | lime `#B8F135` |
| multiplayer | `public/icons/cat-multiplayer.png` | Two overlapping controllers | aqua + orange |
| all | `public/icons/cat-all.png` | 2x2 candy-colored grid | multi (aqua/pink/yellow/purple) |
| popular | `public/icons/cat-popular.png` | Flame | orange `#FF8A00` / yellow core |
| new | `public/icons/cat-new.png` | Four-point sparkle star | yellow `#FFC531` |

Note: the `word` icon was regenerated once — the first pass produced a blank cube
indistinguishable from `3d`; the final version uses a single bold embossed letter
"A" on a rounded tile, which reads clearly and does not conflict with the site's
"no baked text" rule for game thumbnails (this is a single-letter category glyph,
not a multi-word title).

Raw (un-cut) masters kept at `styleboard/brand/icon_<slug>_master.png` (word's
master is `icon_word_v2_master.png`, reflecting the regenerated version).

Contact sheet (on checkerboard, transparency visible): `styleboard/brand/_category_icons_sheet.png`

## Paths for the redesign agent to reference

- Mascot: `public/brand/mascot-wave.png`, `public/brand/mascot-play.png`, `public/brand/mascot-empty.png`
- Category icons: `public/icons/cat-<slug>.png` for slugs listed in the table above
  (matches the category slugs already used in `data/games-catalog.json` categories,
  plus the three special filters `all`, `popular`, `new`)

## Quality gate

All 22 final assets (3 mascot poses + 19 category icons) were visually reviewed:
consistent glossy top-left-lit finish, cohesive as a family, clean transparent
cutouts with no halo or background remnants, no baked text/emoji (aside from the
single-letter "word" tile), each subject matches its label. No further
regenerations needed beyond the one `word` redo noted above.
