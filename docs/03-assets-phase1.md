# GameWhame — Assets Phase 1: Thumbnail Style Sign-off

Owner: Assets | Status: Ready for review
Source of truth: `docs/02-ui-ux-spec.md` §5 (art direction + prompts), mockups in `inspiration/GameWhame_High_Resolution_Designs (2)/`.

Goal (per spec §5): approve the thumbnail **art style** on a small set before generating all 52+ game thumbnails. This phase is assets-only — no components, no pages, no styleboard HTML were built.

## Shared style preamble (used for every prompt)

> STYLE: glossy 3D-rendered premium mobile game cover icon, single hero subject centered with generous padding, smooth soft-vinyl forms, soft top-left key light with gentle rim light and a soft contact shadow, high-saturation candy colors, smooth 2-stop diagonal gradient background over deep navy #10233F with a faint dotted glow, clean edges, nothing touching the frame. Square 1:1, ~1200x1200. ABSOLUTELY NO text, letters, words, numbers-as-labels, logos, watermarks, UI, buttons, or borders. No photorealism, no realistic human faces.

Generated with the free unofficial Gemini web API (`generate_image.py`), output at `styleboard/thumbs/thumb_<slug>_0.png`.

## Final thumbnail set (6)

| Game | Final file | Result | Note |
|---|---|---|---|
| Snake Eats Zone | `thumb_snake_eats_zone_0.png` | PASS | Cute glossy coiled snake hero + single apple accent; clean edges, no text. |
| Bubble Pop Mania | `thumb_bubble_pop_mania_0.png` | PASS | Tight glossy bubble cluster, one bubble mid-pop with sparkle; strong candy palette. |
| Fruit Slice Frenzy | `thumb_fruit_slice_frenzy_0.png` | PASS | Diagonal blade slice through watermelon/orange with juice droplets; dynamic but centered. |
| Merge 2048 | `thumb_merge_2048_0.png` | PASS (regenerated) | See note below — first attempt failed the no-text gate. |
| Block Puzzle Jewel | `thumb_block_puzzle_jewel_0.png` | PASS | Faceted gems + tetromino cubes in purple/aqua/pink, violet-to-navy gradient. |
| Car Drift Racing 3D | `thumb_car_drift_racing_3d_0.png` | PASS | Glossy toy-style red car mid-drift with motion arc + tire smoke, purple-to-navy gradient. |

Contact sheet for side-by-side cohesion review: `styleboard/thumbs/_contact_sheet.png`.

## Regeneration log

**Merge 2048 — regenerated once, reason: baked-in letter-like garble.**
The first-pass image (per the original prompt's "digits only as subtle embossed shapes") produced cube faces with organic embossed marks that, on close inspection, read as an accidental lowercase "p"/apostrophe-like glyph — a violation of the hard "NO letters" constraint and exactly the garble risk flagged for this game. Regenerated with a stricter prompt dropping all digit/shape iconography in favor of completely blank, unmarked glossy cube faces (a pyramid stack, single sparkle accent for family consistency). Second pass is clean at full res and under 2x zoom — no residual marks. All other 5 thumbnails passed the text/letter check on first generation.

## Quality gate applied to each image

- (a) No baked-in text/letters/numbers-as-labels/logos/watermarks/UI — verified at full resolution and 2x zoom crops (especially Merge 2048).
- (b) Cohesion — all six share the same glossy soft-vinyl finish, soft top-left key light, navy-based 2-stop diagonal gradient tinted per game's dominant hue, faint dotted-glow texture, and a small sparkle accent motif.
- (c) Matches mockups' premium glossy tile look — cross-checked against `06_category_page_puzzle.png` tile art (Color Burst spheres, Block Puzzle cubes, Hexa Puzzle gems use the same glossy candy-3D language). Mockup tiles bake the title into the art; per spec §5.2/§4 GameCard, our thumbnails intentionally leave titles out (rendered by the app's meta bar instead).
- (d) Single centered hero subject with ~12%+ padding, survives center-crop to `f/w/t/m/s` aspect tokens.
- (e) No AI-slop — clean edges, no clutter, no garbled shapes (Merge 2048 corrected as above).

## Recommendation

The 6-thumbnail set reads as one cohesive premium family and matches the mockups' art direction. Ready for style sign-off; once approved, scale the same prompt formula to the remaining ~46 games in the roster.
