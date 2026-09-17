# GameWhame — Thumbnail Art Style Guide (APPROVED)

The user approved this style on 2026-09-17. All game thumbnails follow it.

## The look (one line)
Premium glossy 3D-rendered mobile-game cover art — one clear hero subject, soft-vinyl finish, candy colors on a navy gradient. Reads like a real Poki/App-Store portal, never generic AI slop.

## Winning recipe (shared STYLE preamble — prepend to every prompt)
> STYLE: glossy 3D-rendered premium mobile game cover icon, single hero subject centered with generous padding, smooth soft-vinyl forms, soft top-left key light with gentle rim light and a soft contact shadow, high-saturation candy colors, smooth 2-stop diagonal gradient background over deep navy #10233F with a faint dotted glow, clean edges, nothing touching the frame. Square 1:1, ~1200x1200. ABSOLUTELY NO text, letters, words, numbers-as-labels, logos, watermarks, UI, buttons, or borders. No photorealism, no realistic human faces.

## Non-negotiable rules
- **No emoji, no baked-in text/letters/numbers/logos/UI.** The card renders the title itself. Baked text always garbles.
- **One hero subject, centered, ~65–75% of frame, ~12% padding** so it survives cover-cropping to any tile aspect (f/t/w/m/s).
- **Consistent top-left key light + soft rim light + soft contact shadow** on every image so the set sits together.
- **Background** = 2-stop diagonal gradient in the game's dominant hue over deep navy, faint dotted glow.
- **Signature accent:** a small soft sparkle glint is acceptable (present in the approved set) but keep it subtle.
- Brand palette only: aqua `#0BE0D0`, navy `#10233F`, pink `#FF4D7D`, yellow `#FFC531`, purple `#7C5CFF`, lime `#B8F135`, blue `#00A8FF`, warm orange `#FF8A00`.

## Make each thumbnail MATCH THE GAME (critical — user instruction)
Do NOT generate a random pretty object. Understand what the game actually is from its title + category + hook (see `data/games-catalog.json`), then depict its real subject in the approved style:
- Block/jewel puzzle → glossy tetromino blocks / faceted gems.
- 2048 / merge → sculpted rounded 3D cubes (NO readable digits — abstract only).
- Snake → cute chunky neon snake + apple.
- Bubble/match → cluster of glossy bubbles/candies.
- Fruit slice → sliced fruit + blade streak + droplets.
- Racing → glossy toy-style car mid-drift, neon track hints.
- Chess/board → glossy chess piece or board tiles. Sports → the ball/equipment. Word → glossy letter tiles as SHAPES (no readable words). Action/shooter → stylized sci-fi/blaster prop or friendly stylized enemy (no gore, no realistic faces). Farm → glossy crops/produce.
Reference the game's own screenshot as UNDERSTANDING only if one exists — recreate in our style, never copy the screenshot.

## Generation mechanic (free, unofficial Gemini web API)
Run from cwd `/Users/chandrakanthpollishetty/Documents/Apps/utlities/gemini-api`:
`venv/bin/python generate_image.py "generate <STYLE preamble> <per-game subject>" "<OUT_PREFIX>" [refImage.png]`
Output: `<OUT_PREFIX>_0.png`. Retry up to 3x on transient "Session is closed".

## File + catalog contract (all agents obey)
- Canonical catalog: `data/games-catalog.json` (52 games). Fields: id, title, slug, category, categories[], tags[], hook, thumb, hasRealArt, placeholder, playUrl.
- Thumbnail files live at `public/thumbs/<slug>.png` (exactly the catalog `thumb` path). Master 1200² PNGs kept in `styleboard/thumbs/masters/`.
- **Batch 1 = 16 games get REAL art** (`hasRealArt:true` in catalog: the first 12 in catalog order + the 4 approved samples snake/2048/block/fruit). The other 36 get a **branded placeholder tile**.
- Approved sample masters already exist in `styleboard/thumbs/` as `thumb_snake_eats_zone_0.png`, `thumb_bubble_pop_mania_0.png`, `thumb_fruit_slice_frenzy_0.png`, `thumb_merge_2048_0.png`, `thumb_block_puzzle_jewel_0.png`, `thumb_car_drift_racing_3d_0.png` — reuse these (copy/rename to `<slug>.png`), do not regenerate.

## Placeholder tile spec (for the 36 non-batch-1 games)
On-brand, professional, no emoji, no random art. A category-tinted 2-stop navy gradient tile matching the thumbnail background language, with a subtle geometric motif (dot glow + one soft brand-shape) and the category dot color. Generated once as reusable per-category placeholder backgrounds (one per category color) OR a single neutral branded tile; the GameCard overlays the real title. Must look intentional, never "broken image".
