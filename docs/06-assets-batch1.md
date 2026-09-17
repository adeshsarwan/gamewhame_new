# GameWhame — Assets Batch 1: 16 Real-Art Thumbnails

Owner: Assets | Status: Complete
Source of truth: `docs/04-art-style-guide.md` (approved style), `data/games-catalog.json` (16 games with `hasRealArt: true`).

Goal: produce real, game-matched art for all 16 Batch-1 games — the 6 already-approved samples (reused as-is) plus 10 newly generated games — and publish both master (native-res) and web-optimized (720²) copies per the catalog's file contract. Assets only, no components/pages touched.

## Style preamble used (per `docs/04-art-style-guide.md`)

> STYLE: glossy 3D-rendered premium mobile game cover icon, single hero subject centered with generous padding, smooth soft-vinyl forms, soft top-left key light with gentle rim light and a soft contact shadow, high-saturation candy colors, smooth 2-stop diagonal gradient background over deep navy #10233F with a faint dotted glow, clean edges, nothing touching the frame. Square 1:1, ~1200x1200. ABSOLUTELY NO text, letters, words, numbers-as-labels, logos, watermarks, UI, buttons, or borders. No photorealism, no realistic human faces.

For the 10 new games, this preamble was extended with an explicit **"full-bleed, no rounded-rectangle icon frame / no app-icon bezel"** clause — the first test render (Dot Connect Mania) came back looking like an app-icon mockup (a glossy rounded-square bezel baked around the subject), which the 6 approved masters don't have. The extended clause fixed it on the next generation and was used for all subsequent games.

Generated with the free unofficial Gemini web API (`generate_image.py`), run from `/Users/chandrakanthpollishetty/Documents/Apps/utlities/gemini-api`.

## Final 16-game set

| # | Game | Slug | Final master | Result | Note |
|---|---|---|---|---|---|
| 1 | Dot Connect Mania | `dot-connect-mania` | `dot-connect-mania.png` | PASS (regenerated) | Glowing aqua/purple connector-node cluster with light-line links. 1st attempt had a baked rounded-icon bezel — regenerated full-bleed. |
| 2 | Candy Match Blast | `candy-match-blast` | `candy-match-blast.png` | PASS | Cluster of glossy wrapped candies (pink/yellow/aqua) with twisted cellophane ends. |
| 3 | Basketball Arcade | `basketball-arcade` | `basketball-arcade.png` | PASS | Glossy orange basketball mid-bounce with hoop rim + net behind it. |
| 4 | Police Force Pursuit | `police-force-pursuit` | `police-force-pursuit.png` | PASS | Cute chibi toy-style police car, glowing red/blue light-bar, no faces/violence. |
| 5 | Metro Dash Runner | `metro-dash-runner` | `metro-dash-runner.png` | PASS | Glossy gold coin/token flying over vanishing-point subway rails with speed streaks. |
| 6 | Bubble Pop Mania | `bubble-pop-mania` | `bubble-pop-mania.png` | PASS (reused) | Approved sample, copied from `styleboard/thumbs/thumb_bubble_pop_mania_0.png`. |
| 7 | Word Quest Search | `word-quest-search` | `word-quest-search.png` | PASS | Cluster of glossy blank rounded-square tiles (aqua/purple/yellow) — zero markings, no readable letters. |
| 8 | Math Puzzle Master | `math-puzzle-master` | `math-puzzle-master.png` | PASS | Four sculpted 3D vinyl symbol-shapes (+ − × ÷) as toy objects — no digits/equations anywhere. |
| 9 | Chess Classic Board | `chess-classic-board` | `chess-classic-board.png` | PASS | Glossy purple/gold chess knight on two checkerboard tiles. |
| 10 | Car Drift Racing 3D | `car-drift-racing-3d` | `car-drift-racing-3d.png` | PASS (reused) | Approved sample, copied from `styleboard/thumbs/thumb_car_drift_racing_3d_0.png`. |
| 11 | Zombie Shooter Strike | `zombie-shooter-strike` | `zombie-shooter-strike.png` | PASS (regenerated) | Cute non-scary cartoon zombie mascot, waving, no gore/faces issues. 1st attempt used a 3-hue rainbow background inconsistent with the family's 2-stop gradient rule — regenerated with a clean lime→navy 2-stop gradient. |
| 12 | Farm Harvest Sort | `farm-harvest-sort` | `farm-harvest-sort.png` | PASS | Glossy carrot + tomato + wheat-stalk cluster, cozy produce pile. |
| 13 | Block Puzzle Jewel | `block-puzzle-jewel` | `block-puzzle-jewel.png` | PASS (reused) | Approved sample, copied from `styleboard/thumbs/thumb_block_puzzle_jewel_0.png`. |
| 15 | Snake Eats Zone | `snake-eats-zone` | `snake-eats-zone.png` | PASS (reused) | Approved sample, copied from `styleboard/thumbs/thumb_snake_eats_zone_0.png`. |
| 50 | Merge 2048 Number Puzzle | `merge-2048-number-puzzle` | `merge-2048-number-puzzle.png` | PASS (reused) | Approved sample, copied from `styleboard/thumbs/thumb_merge_2048_0.png`. |
| 51 | Fruit Slice Frenzy | `fruit-slice-frenzy` | `fruit-slice-frenzy.png` | PASS (reused) | Approved sample, copied from `styleboard/thumbs/thumb_fruit_slice_frenzy_0.png`. |

(Catalog ids shown where relevant; table ordered to match the task's numbered list plus the 6 reused samples.)

## Regeneration log

1. **Dot Connect Mania** — 1st render baked a glossy rounded-square "app icon" bezel/frame around the node cluster, which none of the 6 approved masters have (they're full-bleed backgrounds). Regenerated with an explicit "full-bleed edge-to-edge square background, NO rounded rectangle icon frame, no app-icon bezel, no card border" clause added to the STYLE preamble. 2nd pass is full-bleed and matches the approved set — used for all remaining 9 games going forward.
2. **Zombie Shooter Strike** — 1st render used a 3-stop rainbow-ish background (aqua→pink→yellow) instead of the family's "2-stop diagonal gradient over deep navy" rule, making it stand out from the rest of the set. Regenerated forcing a clean 2-stop lime-green→navy `#10233F` gradient ("only two colors, not a rainbow"). 2nd pass sits correctly in the family.

All other 8 new games (Candy Match Blast, Basketball Arcade, Police Force Pursuit, Metro Dash Runner, Word Quest Search, Math Puzzle Master, Chess Classic Board, Farm Harvest Sort) passed the quality gate on the first generation.

## Quality gate applied to each of the 10 new images

- **No baked text/letters/numbers/logos/UI** — verified at full resolution, with extra scrutiny on the two highest garble-risk games: Word Quest Search (blank-tile-shapes prompt, explicitly forced "completely BLANK, no engravings, no glyphs" — verified clean) and Math Puzzle Master (four sculpted +/−/×/÷ vinyl shapes, explicitly forced "no digits or numbers anywhere" — verified clean, reads as shapes not text).
- **Matches the actual game** — each subject was derived from the catalog's title + category + hook (basketball → ball+hoop, chess → knight on board tiles, farm → produce cluster, police → light-bar car, etc.), not generic art.
- **Cohesion with the approved 6** — same glossy soft-vinyl finish, soft top-left key light + rim light + contact shadow, navy-based 2-stop diagonal gradient tinted per game, faint dotted-glow background texture, small sparkle accent. Confirmed side-by-side in the new 4×4 contact sheet.
- **Single centered hero, ~65–75% of frame, generous padding** — checked on every image; no subject touches the frame edge.
- **No realistic human faces / no gore / no violence** — Police Force Pursuit and Zombie Shooter Strike were explicitly steered toward cute/toy/cartoon treatments (chibi car, friendly waving zombie) with hard negatives against gore, blood, weapons and realistic faces.

## Output locations (per the catalog's file contract)

- Masters (native ~1024²; matches the resolution of the existing 6 approved masters): `styleboard/thumbs/masters/<slug>.png` — all 16 present, including the 6 approved samples copied/renamed from `styleboard/thumbs/thumb_<name>_0.png`.
- Web-optimized (720² PNG, downscaled with PIL/LANCZOS to keep page weight down): `public/thumbs/<slug>.png` — matches the catalog's `thumb` field for all 16 `hasRealArt:true` games exactly.
- Fresh cohesion contact sheet (4×4, labeled by slug): `styleboard/thumbs/_contact_sheet_batch1.png`.

## Recommendation

All 16 Batch-1 thumbnails read as one cohesive premium family in the new contact sheet — consistent lighting, gradient language, glossy finish and brand palette — and each is clearly identifiable as its own game with zero baked text. Ready to wire into the catalog/GameCard by another agent; no code, catalog, or other docs were touched by this pass.

## Remaining set A — 18 more real-art thumbnails

Owner: Assets (separate pass) | Status: Complete

Same style preamble as above (with the full-bleed / no-app-icon-bezel clause included from the start this time). Generated with the same `generate_image.py` mechanic, from `/Users/chandrakanthpollishetty/Documents/Apps/utlities/gemini-api`.

| # | Game | Slug | Category | Result | Note |
|---|---|---|---|---|---|
| 1 | Solitaire Card Classic | `solitaire-card-classic` | Board | PASS (1st try) | Glossy fanned/stacked playing cards, suits as abstract shapes (heart/spade/diamond/club), zero readable text or rank numbers. |
| 2 | Ludo Party Dice | `ludo-party-dice` | Board | PASS (regenerated) | Glossy dice (pip-dots only) + cone-shaped ludo tokens. 1st attempt had a hard diagonal seam in the background instead of a smooth blend and an off-center, bottom-heavy composition — regenerated with an explicit "smooth blurry gradient, no hard seam" + centered-cluster clause. |
| 3 | Pool Masters 3D | `pool-masters-3d` | Sports | PASS (regenerated) | Glossy black 8-ball (plain white circle, no "8") leaning on a wooden cue, small green-felt disc shadow. 1st attempt let the green felt texture fill the entire lower half of the frame, breaking the navy-gradient background convention — regenerated forcing the felt down to a small toy-diorama disc. |
| 4 | Moto Bike Stunt | `moto-bike-stunt` | Racing | PASS (1st try) | Glossy toy dirt bike frozen mid-jump, faceless helmeted rider, dust/motion trail arc. |
| 5 | Ninja Slash Blade | `ninja-slash-blade` | Action | PASS (1st try) | Cute chibi ninja mascot (stylized non-realistic face) with a katana and a glowing aqua slash-streak arc. No gore/violence. |
| 6 | Tower Defense Empire | `tower-defense-empire` | Strategy | PASS (1st try) | Chunky toy stone turret with a glowing purple crystal cannon and a hovering energy-orb projectile. |
| 7 | Cooking Chef Madness | `cooking-chef-madness` | Casual | PASS (1st try) | Glossy chef hat beside a red frying pan with a sunny-side-up egg and steam swirl. |
| 8 | Pet Rescue Match | `pet-rescue-match` | Matching | PASS (1st try) | Adorable chibi puppy mascot with big round eyes beside a glossy candy-pink heart treat. |
| 9 | Sudoku Brain Trainer | `sudoku-brain-trainer` | Brain | PASS (1st try) | Glossy 3x3 grid of soft rounded cells, three filled with colorful abstract dot-pips — explicitly forced "no numbers/digits anywhere," verified clean. |
| 10 | Crossword Word Connect | `crossword-word-connect` | Word | PASS (1st try) | Cluster of glossy blank rounded-square tiles interlocked in a crossword-like shape — explicitly forced "zero glyphs," verified clean; visually distinct from Word Quest Search's looser tile pile. |
| 11 | Mahjong Tile Match | `mahjong-tile-match` | Matching | PASS (1st try) | Small stack of glossy ivory mahjong tiles with abstract shape motifs (circle/bamboo/flower) — no Chinese characters, no text. |
| 12 | Color Sort Tubes | `color-sort-tubes` | Puzzle | PASS (1st try) | Three short stubby glass tubes with neatly stacked candy-color liquid layers. |
| 13 | Water Sort Flow | `water-sort-flow` | Puzzle | PASS (1st try) | Two tall tilted glass tubes actively pouring layered liquid between them — distinct silhouette/motion from Color Sort Tubes so the pair doesn't read as duplicates. |
| 14 | Parking Jam Escape | `parking-jam-escape` | Puzzle | PASS (regenerated) | Small centered 3x3 toy parking-lot diorama with a glowing highlighted red car. 1st attempt filled the entire frame edge-to-edge with cars and no visible background, violating the "single hero, centered, padded" rule — regenerated as a small floating diorama island with full navy padding around it. |
| 15 | Bridge Builder Race | `bridge-builder-race` | Strategy | PASS (1st try) | Glossy wooden-plank bridge arch with a cute toy cart mid-dash crossing it. |
| 16 | Castle Siege Defense | `castle-siege-defense` | Strategy | PASS (1st try) | Warm-toned glossy stone castle turret with a decorative gem-shield leaning against it. No violence/weapons. |
| 17 | Pirate Treasure Adventure | `pirate-treasure-adventure` | Adventure | PASS (1st try) | Open wooden treasure chest overflowing with gold coins and a glowing purple gem. |
| 18 | Temple Jungle Escape | `temple-jungle-escape` | Adventure | PASS (1st try) | Glossy golden idol figure (abstract, faceless) with lime jungle-leaf fronds. |

### Regeneration log (Remaining set A)

1. **Ludo Party Dice** — 1st render had a hard-edged diagonal seam splitting the background into two flat color blocks (not a smooth blend) and an off-center, bottom-right-heavy composition. Regenerated with an explicit "smooth blurry gradient, no hard seam line" clause and instruction to cluster/center all elements — 2nd pass matches the family's soft gradient language.
2. **Pool Masters 3D** — 1st render let a photoreal-ish green felt texture fill the entire bottom half of the frame instead of sitting as a subtle hint, breaking the navy-gradient-background convention. Regenerated forcing the felt down to a small toy-like disc shadow beneath the ball/cue, with the navy-to-lime gradient restored as the dominant background. 2nd pass sits correctly in the family.
3. **Parking Jam Escape** — 1st render tiled toy cars edge-to-edge across the full frame with no visible background or padding, violating the "single hero centered with padding" rule. Regenerated as a small, centered 3x3 parking-lot diorama floating on the navy gradient with full margin around it — 2nd pass matches the family's composition rule.

### Quality gate applied to each of the 18 games

- **No baked text/letters/numbers/logos/UI** — verified at full resolution on every image, with extra scrutiny on the highest garble-risk games: Sudoku Brain Trainer (dot-pips instead of digits, verified clean), Crossword Word Connect (blank tiles, verified clean), Mahjong Tile Match (abstract motifs instead of characters, verified clean), Solitaire Card Classic (suit shapes only, no rank text).
- **Matches the actual game** — each subject derived from the given slug/category/description (cards → fanned suits, ludo → dice+tokens, pool → 8-ball+cue, dirt bike → jump+trail, ninja → mascot+slash, tower defense → turret+projectile, chef → hat+pan, pet match → puppy+treat, sudoku → grid+pips, crossword → letter-tile shapes, mahjong → tile stack, the two liquid-sort games → visually differentiated tube treatments, parking jam → small diorama+highlighted car, bridge builder → span+cart, castle siege → turret+shield, pirate treasure → chest+gems, temple/jungle → idol+leaves).
- **Cohesion with the existing family** — same glossy soft-vinyl finish, top-left key light + rim light + contact shadow, 2-stop navy-based diagonal gradient tinted per game, faint dotted-glow texture, small sparkle accent, brand palette. Confirmed side by side in `_contact_sheet_remaining_A.png`.
- **Single centered hero, generous padding** — checked on every image; the two regenerated for composition (Ludo, Parking Jam) were fixed specifically for this rule.
- **No realistic human faces / no gore / no violence** — Ninja Slash Blade uses a stylized chibi face (no realism) and a clean light-streak instead of a blood effect; Castle Siege Defense and Tower Defense Empire show structures/projectiles only, no combatants.

### Output locations (Remaining set A)

- Masters (native, matching existing resolution): `styleboard/thumbs/masters/<slug>.png` for all 18 slugs listed above.
- Web-optimized (720x720 PNG, downscaled with PIL/LANCZOS): `public/thumbs/<slug>.png` for all 18 slugs, matching the catalog's `thumb` path convention.
- Cohesion contact sheet (4-wide grid, labeled by slug): `styleboard/thumbs/_contact_sheet_remaining_A.png`.

No code, catalog, or other agents' asset files were touched by this pass — only the 18 slugs' own master/web files, this doc section, and the new contact sheet.

## Remaining set B — 18 games

Owner: Assets | Status: Complete

A further 18 games get real, game-matched art following the same approved style (`docs/04-art-style-guide.md`). Generated with the same free unofficial Gemini web API (`generate_image.py`), same STYLE preamble (including the full-bleed/no-bezel clause from the Batch-1 log) plus each game's own subject description. No reference images were used — every image generated clean from the text prompt alone.

| # | Game (slug) | Category | Subject depicted | Result |
|---|---|---|---|---|
| 1 | `galaxy-space-invaders` | Arcade | Cute glossy alien mascot with big friendly eyes flanked by two small chunky toy starfighter ships, purple/aqua gradient | PASS (1st try) |
| 2 | `alien-shooter-galaxy` | Action | Glossy teal UFO/flying saucer, dome cockpit with a tiny friendly alien silhouette, soft laser-glint light beam underneath | PASS (1st try) |
| 3 | `football-soccer-stars` | Sports | Glossy soccer ball floating in front of a stylized goal-net corner, lime/navy gradient | PASS (1st try) |
| 4 | `cricket-smash-league` | Sports | Glossy wood-tone cricket bat crossed with a glossy red cricket ball, orange/yellow gradient | PASS (1st try) |
| 5 | `tennis-sprint-clash` | Sports | Glossy tennis racket with a tennis ball mid-bounce beside it, lime/aqua gradient | PASS (1st try) |
| 6 | `bike-race-hills` | Racing | Glossy toy mountain bike leaning into a curve on a stylized hill silhouette, orange/blue gradient | PASS (1st try) |
| 7 | `monster-truck-mayhem` | Racing | Glossy chunky monster truck, oversized tires, high suspension, purple/red gradient | PASS (1st try) |
| 8 | `drift-taxi-city` | Racing | Glossy yellow toy taxi mid-drift with motion swoosh and a small city-skyline silhouette hint, yellow/pink gradient | PASS (1st try) |
| 9 | `sniper-elite-mission` | Action | Glossy circular target/reticle with concentric rings and a soft crosshair light glint — no gun, no violence, aqua/navy gradient | PASS (1st try) |
| 10 | `stickman-fighter-legends` | Action | Pair of glossy red boxing gloves, one forward mid-punch — no faces, no gore, red/navy gradient | PASS (1st try) |
| 11 | `crew-impostor-hunt` | Multiplayer | Cute glossy bean-shaped crewmate mascot with round visor, purple/pink gradient | PASS (1st try) |
| 12 | `draw-guess-party` | Word | Glossy pencil crossed with a paintbrush and a small rounded color-palette blob, pink/yellow gradient | PASS (1st try) |
| 13 | `quiz-trivia-brain` | Brain | Glossy 3D question-mark shape beside a glossy lightbulb, purple/blue gradient | PASS (1st try) |
| 14 | `memory-card-match` | Matching | Two glossy card shapes side by side — one plain navy backing, one flipped showing an abstract colored shape face, zero markings, aqua/purple gradient | PASS (1st try) |
| 15 | `jigsaw-puzzle-worlds` | Puzzle | Cluster of glossy interlocking jigsaw pieces, blue/teal gradient | PASS (1st try) |
| 16 | `dominoes-classic` | Board | Two glossy domino tiles leaning together with black pip dots (no digits/text), navy/gold gradient | PASS (1st try) |
| 17 | `checkers-clash` | Board | Stacked glossy red + black checkers discs topped with a small crown shape (the classic "king" stack), red/black/navy gradient | PASS (1st try) |
| 18 | `sky-jump-helix-ball` | Arcade | Glossy bouncing ball caught mid-bounce above a small spiral helix tower platform, pink/purple gradient | PASS (1st try) |

### Quality gate applied

- **No baked text/letters/numbers/logos/UI** — verified at full resolution on every image; extra scrutiny on `dominoes-classic` (pip dots only, no digits) and `memory-card-match` (flipped card face uses an abstract blob shape, not a symbol/letter).
- **Matches the actual game** — each subject depicts the game's real equipment/mascot per the brief (soccer ball+net, cricket bat+ball, boxing gloves, target reticle, bean crewmate, domino pips, checkers king-stack, helix+ball, etc.), not generic art.
- **Cohesion with the approved family** — same glossy soft-vinyl finish, top-left key light + rim light + soft contact shadow, 2-stop navy-based diagonal gradient tinted per game, faint dotted glow, small sparkle accent bottom-right, brand-adjacent candy palette. Confirmed side by side in the new 4×5 contact sheet.
- **Single centered hero, generous padding, full-bleed** — no subject touches the frame edge; no rounded-rectangle icon bezel on any of the 18.
- **Safety** — `sniper-elite-mission` uses only a target/reticle (no gun, no weapon); `stickman-fighter-legends` uses only boxing gloves (no faces, no gore); `alien-shooter-galaxy`'s UFO and `galaxy-space-invaders`' alien are both cute/friendly, not menacing.

### Regenerations

None needed — all 18 images passed the quality gate on the first generation attempt.

### Output locations (per the catalog's file contract)

- Masters (1200²... actual native ~1024², matching the resolution convention of the existing masters): `styleboard/thumbs/masters/<slug>.png` — all 18 present.
- Web-optimized (720² PNG, downscaled with PIL/LANCZOS): `public/thumbs/<slug>.png` — all 18 present.
- Cohesion contact sheet (4×5 grid, labeled by slug): `styleboard/thumbs/_contact_sheet_remaining_B.png`.

### Recommendation

All 18 "Remaining set B" thumbnails sit cleanly in the same premium family as Batch 1 and Set A — consistent lighting, gradient language, glossy finish and palette — each clearly reads as its own game with zero baked text and no regenerations required. Ready to wire into the catalog/GameCard by another agent; no code, catalog, or other docs/slugs were touched by this pass.
