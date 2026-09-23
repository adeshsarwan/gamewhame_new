#!/usr/bin/env python3
"""thumb-toggle.py -- manage GameWhame game thumbnail variants.

The persistent source store lives in `thumbnails/<slug>/{notitle,withtitle}.png`.
The files actually served to production live in `public/thumbs/<slug>.{png,webp}`,
and each game's `thumb` / `hasRealArt` fields live in BOTH catalog mirrors
(`lib/games-catalog.json` and `data/games-catalog.json`), which must stay
byte-identical.

Commands:
  list                              Show every stored game, which variants exist,
                                    and which variant is currently live.
  activate <slug> <notitle|withtitle>
                                    Copy the chosen variant into public/thumbs,
                                    build the .webp sibling, and point both
                                    catalog mirrors at it (hasRealArt=true).
  activate-all <notitle|withtitle>  activate every slug that has that variant.

Python 3 stdlib only. Safe + idempotent; preserves catalog JSON formatting
(2-space indent, trailing newline).
"""

import json
import shutil
import subprocess
import sys
from pathlib import Path

# Repo root = parent of this script's directory (scripts/..).
ROOT = Path(__file__).resolve().parent.parent
THUMBS_SRC = ROOT / "thumbnails"
PUBLIC_THUMBS = ROOT / "public" / "thumbs"
CATALOGS = [ROOT / "lib" / "games-catalog.json", ROOT / "data" / "games-catalog.json"]
VARIANTS = ("notitle", "withtitle")


def eprint(*a):
    print(*a, file=sys.stderr)


def stored_variants(slug):
    """Return the set of variant names that exist on disk for a slug."""
    out = set()
    for v in VARIANTS:
        if (THUMBS_SRC / slug / f"{v}.png").is_file():
            out.add(v)
    return out


def all_slugs():
    if not THUMBS_SRC.is_dir():
        return []
    return sorted(
        p.name for p in THUMBS_SRC.iterdir() if p.is_dir() and stored_variants(p.name)
    )


def active_variant(slug):
    """Compare bytes of the live png against the stored variants.

    Returns 'notitle', 'withtitle', or None (no live art / no match)."""
    live = PUBLIC_THUMBS / f"{slug}.png"
    if not live.is_file():
        return None
    live_bytes = live.read_bytes()
    for v in stored_variants(slug):
        if (THUMBS_SRC / slug / f"{v}.png").read_bytes() == live_bytes:
            return v
    return "unknown"  # a live png exists but matches neither stored variant


def make_webp(png_path, webp_path):
    """Build webp from png. Try cwebp, fall back to sips. Returns tool name."""
    # cwebp
    if shutil.which("cwebp"):
        r = subprocess.run(
            ["cwebp", "-quiet", "-q", "82", str(png_path), "-o", str(webp_path)],
            capture_output=True,
        )
        if r.returncode == 0 and webp_path.is_file():
            return "cwebp"
        eprint("  cwebp failed:", r.stderr.decode(errors="replace").strip())
    # sips fallback
    if shutil.which("sips"):
        r = subprocess.run(
            ["sips", "-s", "format", "webp", str(png_path), "--out", str(webp_path)],
            capture_output=True,
        )
        if r.returncode == 0 and webp_path.is_file():
            return "sips"
        eprint("  sips failed:", r.stderr.decode(errors="replace").strip())
    raise RuntimeError(
        "could not build webp: neither cwebp nor sips succeeded (install one)"
    )


def update_catalogs(slug):
    """Set thumb + hasRealArt for `slug` in every catalog mirror.

    Loads each file, updates the matching game object, and writes it back with
    identical formatting (indent=2 + trailing newline). Idempotent. Returns the
    number of catalog entries changed."""
    thumb_val = f"/thumbs/{slug}.png"
    changed = 0
    for cat in CATALOGS:
        if not cat.is_file():
            eprint(f"  WARNING: catalog missing: {cat}")
            continue
        data = json.loads(cat.read_text(encoding="utf-8"))
        games = data.get("games", [])
        found = False
        for g in games:
            if g.get("slug") == slug:
                found = True
                if g.get("thumb") != thumb_val or g.get("hasRealArt") is not True:
                    g["thumb"] = thumb_val
                    g["hasRealArt"] = True
                    changed += 1
                break
        if not found:
            eprint(f"  WARNING: slug '{slug}' not found in {cat.name}")
            continue
        cat.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    return changed


def cmd_list():
    slugs = all_slugs()
    if not slugs:
        print("No games found under thumbnails/.")
        return 0
    width = max(len(s) for s in slugs)
    print(f"{'SLUG'.ljust(width)}  VARIANTS            ACTIVE")
    print(f"{'-' * width}  ------------------  ------")
    for slug in slugs:
        have = stored_variants(slug)
        variants_str = ", ".join(v for v in VARIANTS if v in have)
        active = active_variant(slug)
        active_str = active if active else "none"
        print(f"{slug.ljust(width)}  {variants_str.ljust(18)}  {active_str}")
    return 0


def cmd_activate(slug, variant):
    if variant not in VARIANTS:
        eprint(f"error: variant must be one of {VARIANTS}, got '{variant}'")
        return 2
    src = THUMBS_SRC / slug / f"{variant}.png"
    if not src.is_file():
        eprint(f"error: no stored variant at {src}")
        return 2
    PUBLIC_THUMBS.mkdir(parents=True, exist_ok=True)
    dst_png = PUBLIC_THUMBS / f"{slug}.png"
    dst_webp = PUBLIC_THUMBS / f"{slug}.webp"
    shutil.copyfile(src, dst_png)
    tool = make_webp(dst_png, dst_webp)
    changed = update_catalogs(slug)
    print(
        f"activated {slug} -> {variant}  (png+webp via {tool}; "
        f"catalog entries changed: {changed})"
    )
    return 0


def cmd_activate_all(variant):
    if variant not in VARIANTS:
        eprint(f"error: variant must be one of {VARIANTS}, got '{variant}'")
        return 2
    slugs = [s for s in all_slugs() if variant in stored_variants(s)]
    if not slugs:
        print(f"No games have a stored '{variant}' variant.")
        return 0
    rc = 0
    for slug in slugs:
        rc |= cmd_activate(slug, variant)
    return rc


def main(argv):
    if len(argv) < 2:
        eprint(__doc__)
        return 2
    cmd = argv[1]
    if cmd == "list":
        return cmd_list()
    if cmd == "activate":
        if len(argv) != 4:
            eprint("usage: thumb-toggle.py activate <slug> <notitle|withtitle>")
            return 2
        return cmd_activate(argv[2], argv[3])
    if cmd == "activate-all":
        if len(argv) != 3:
            eprint("usage: thumb-toggle.py activate-all <notitle|withtitle>")
            return 2
        return cmd_activate_all(argv[2])
    eprint(f"unknown command: {cmd}")
    eprint(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
