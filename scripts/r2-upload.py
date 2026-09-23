#!/usr/bin/env python3
"""
Upload HTML5 game builds to the Cloudflare R2 bucket (gamewhame-files) under
the h5-games/<slug>/ prefix, preserving folder structure and setting a correct
Content-Type per file (R2 defaults to octet-stream, which would stop HTML/JS
from executing). Threaded for speed. Only ever writes under h5-games/.

Credentials are read from the environment, or auto-loaded from .env.r2.local
at the repo root (git-ignored). Requires: pip install boto3

USAGE
  # upload every game folder under public/games/  ->  h5-games/<folder>/
  python3 scripts/r2-upload.py public/games

  # upload a single game folder                    ->  h5-games/<slug>/
  python3 scripts/r2-upload.py public/games/pull-the-thread pull-the-thread

Resulting public URL (games.gamewhame.com is bound to this bucket):
  https://games.gamewhame.com/h5-games/<slug>/index.html
"""
import os
import sys
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import boto3
    from botocore.config import Config
except ImportError:
    sys.exit("boto3 not installed. Run: pip install boto3")

PREFIX_ROOT = "h5-games"

CT = {
    ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8", ".json": "application/json",
    ".wasm": "application/wasm", ".png": "image/png", ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
    ".svg": "image/svg+xml", ".ico": "image/x-icon", ".bmp": "image/bmp",
    ".ogg": "audio/ogg", ".oga": "audio/ogg", ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4", ".aac": "audio/aac", ".wav": "audio/wav",
    ".webm": "video/webm", ".mp4": "video/mp4", ".ttf": "font/ttf",
    ".otf": "font/otf", ".woff": "font/woff", ".woff2": "font/woff2",
    ".eot": "application/vnd.ms-fontobject", ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml", ".map": "application/json",
}


def load_env_file(path=".env.r2.local"):
    """Populate os.environ from a KEY=VALUE file if the vars aren't already set."""
    if not os.path.exists(path):
        return
    with open(path) as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())


def content_type(path):
    return CT.get(os.path.splitext(path.lower())[1], "application/octet-stream")


_local = threading.local()


def client():
    c = getattr(_local, "c", None)
    if c is None:
        endpoint = os.environ.get("R2_ENDPOINT")
        key = os.environ.get("R2_KEY") or os.environ.get("AWS_ACCESS_KEY_ID")
        secret = os.environ.get("R2_SECRET") or os.environ.get("AWS_SECRET_ACCESS_KEY")
        if not (endpoint and key and secret):
            sys.exit("Missing R2 creds. Set R2_ENDPOINT/R2_KEY/R2_SECRET or add .env.r2.local")
        c = boto3.client(
            "s3", endpoint_url=endpoint, aws_access_key_id=key,
            aws_secret_access_key=secret, region_name="auto",
            config=Config(signature_version="s3v4", max_pool_connections=32),
        )
        _local.c = c
    return c


def upload_one(bucket, fpath, key):
    assert key.startswith(f"{PREFIX_ROOT}/"), f"refuse key outside {PREFIX_ROOT}/: {key}"
    client().upload_file(fpath, bucket, key, ExtraArgs={
        "ContentType": content_type(fpath),
        "CacheControl": "public, max-age=31536000",
    })
    return os.path.getsize(fpath)


def collect(games_dir, only_slug=None):
    tasks = []
    if only_slug:
        slugs = [only_slug]
        bases = {only_slug: games_dir}
    else:
        slugs = sorted(d for d in os.listdir(games_dir)
                       if os.path.isdir(os.path.join(games_dir, d)))
        bases = {s: os.path.join(games_dir, s) for s in slugs}
    for slug in slugs:
        base = bases[slug]
        for root, _d, files in os.walk(base):
            for name in files:
                fpath = os.path.join(root, name)
                rel = os.path.relpath(fpath, base).replace(os.sep, "/")
                tasks.append((fpath, f"{PREFIX_ROOT}/{slug}/{rel}"))
    return slugs, tasks


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    load_env_file()
    bucket = os.environ.get("R2_BUCKET", "gamewhame-files")
    games_dir = sys.argv[1].rstrip("/")
    only_slug = sys.argv[2] if len(sys.argv) > 2 else None

    slugs, tasks = collect(games_dir, only_slug)
    print(f"{len(slugs)} game(s), {len(tasks)} files -> s3://{bucket}/{PREFIX_ROOT}/")
    done = total = 0
    errs = []
    with ThreadPoolExecutor(max_workers=24) as ex:
        futs = {ex.submit(upload_one, bucket, f, k): k for f, k in tasks}
        for fut in as_completed(futs):
            try:
                total += fut.result()
                done += 1
                if done % 200 == 0:
                    print(f"  ...{done}/{len(tasks)}")
            except Exception as e:  # noqa: BLE001
                errs.append((futs[fut], str(e)))
    print(f"DONE: {done}/{len(tasks)} files, {total/1024/1024:.1f} MB, {len(slugs)} game(s)")
    if errs:
        print(f"ERRORS: {len(errs)}")
        for k, e in errs[:10]:
            print("  ", k, "->", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
