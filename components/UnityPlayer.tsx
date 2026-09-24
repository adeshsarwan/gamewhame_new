"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Game } from "@/lib/types";
import { categorySlug } from "@/lib/categories";
import Thumb from "./Thumb";
import Icon from "./Icon";
import IconButton from "./IconButton";
import FavoriteButton from "./FavoriteButton";
import { PlayTriangle } from "./BrandMarks";
import { toast } from "./Toast";
import shell from "./PlayerStage.module.css";
import styles from "./UnityPlayer.module.css";

const RECENT_KEY = "gw_recent";
/** Generous ceiling before we surface an error + Retry (Unity wasm can be slow). */
const LOAD_TIMEOUT_MS = 45_000;

/** Push a slug to the front of the MRU recently-played list (localStorage). */
function recordRecent(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = [slug, ...list.filter((s) => s !== slug)].slice(0, 20);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("gw-recent-changed"));
  } catch {
    /* storage blocked — degrade silently */
  }
}

/* ------------------------------------------------------------------ */
/* Memoized iframe — the ONLY place the <iframe> element lives.        */
/*                                                                     */
/* Isolated behind React.memo with fully stable props (src/title from  */
/* metadata, a stable ref setter + onLoad, and a numeric key bumped     */
/* only on Retry). Parent re-renders — fullscreen toggle, favorite      */
/* toggle, responsive/layout shifts, ad UI — never change these props,  */
/* so the iframe DOM node is preserved and the Unity game never         */
/* restarts. Only a Retry (frameKey bump at the call site) recreates it.*/
/* ------------------------------------------------------------------ */
interface UnityFrameProps {
  src: string;
  title: string;
  onLoad: () => void;
  setRef: (el: HTMLIFrameElement | null) => void;
}

const UnityFrame = memo(function UnityFrame({ src, title, onLoad, setRef }: UnityFrameProps) {
  return (
    <iframe
      ref={setRef}
      className={shell.frame}
      src={src}
      title={title}
      onLoad={onLoad}
      /* Trusted first-party CDN (games.gamewhame.com). No `sandbox`: the Unity
         page must reach its own build assets same-origin, and a cross-origin
         frame already cannot script this parent, so a sandbox only risks
         breaking the verified-working build for no isolation gain. */
      allow="autoplay; fullscreen; gamepad; cross-origin-isolated"
      loading="eager"
    />
  );
});

interface UnityPlayerProps {
  game: Game;
  /** Anchor id of the related-games section (for the "play similar" jump). */
  relatedAnchor?: string;
}

/**
 * UnityPlayer — reusable player for externally-hosted Unity WebGL builds.
 *
 * Reads the build URL + engine from game metadata (`game.gameUrl`), so every
 * future Unity title works by setting two catalog fields — no per-game code.
 *
 * Cross-origin limitation (documented): the Unity page loads same-origin from
 * the games CDN, so we CANNOT read its internal load progress from here. We show
 * our own poster + on-brand animated loader, reveal the iframe on its `load`
 * event (Unity's own bar then covers the final wasm compile), and defensively
 * listen for a `postMessage` progress signal in case the build ever posts one —
 * without depending on it.
 */
export default function UnityPlayer({ game, relatedAnchor = "related-games" }: UnityPlayerProps) {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const src = game.gameUrl as string;

  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false); // iframe `load` event fired
  const [error, setError] = useState(false); // failed / timed out
  const [frameKey, setFrameKey] = useState(0); // bump to recreate the iframe (Retry)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null); // best-effort, may stay null

  /** Blank + drop the iframe so the browser can reclaim its memory. */
  const teardown = useCallback(() => {
    const el = iframeRef.current;
    if (el) {
      try {
        el.src = "about:blank";
      } catch {
        /* cross-origin edge — node removal on unmount still frees it */
      }
    }
    iframeRef.current = null;
  }, []);

  // Hard teardown on unmount / route change (memory-leak guard at 1M users).
  useEffect(() => () => teardown(), [teardown]);

  // Track native fullscreen state so the control icon stays in sync.
  useEffect(() => {
    function sync() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  // Defensive progress listener. The frame is cross-origin, so we can only
  // trust `e.source === our contentWindow` (never an origin === our origin
  // check). We read a progress hint IF the build ever posts one; gameplay does
  // not depend on it, and the iframe `load` event is the real reveal trigger.
  useEffect(() => {
    if (!playing) return;
    function onMessage(e: MessageEvent) {
      try {
        if (e.source !== iframeRef.current?.contentWindow) return;
        const d = e.data as { progress?: unknown; unityProgress?: unknown } | null;
        if (!d || typeof d !== "object") return;
        const raw = typeof d.progress === "number" ? d.progress : d.unityProgress;
        if (typeof raw === "number" && raw >= 0 && raw <= 1) setProgress(raw);
      } catch {
        /* malformed message — ignore */
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [playing]);

  // Load watchdog: while a frame is mounting and hasn't loaded/errored, arm a
  // generous timeout. Re-arms on Retry (frameKey) and clears the moment `load`
  // flips `loaded` (the guard stops it re-arming).
  useEffect(() => {
    if (!playing || loaded || error) return;
    const id = window.setTimeout(() => setError(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [playing, loaded, error, frameKey]);

  const setFrameRef = useCallback((el: HTMLIFrameElement | null) => {
    iframeRef.current = el;
  }, []);

  const handleLoad = useCallback(() => {
    // about:blank teardown also fires load — ignore once we've stopped playing.
    setLoaded(true);
    setError(false);
  }, []);

  const startPlay = useCallback(() => {
    setPlaying(true);
    setLoaded(false);
    setError(false);
    setProgress(null);
    recordRecent(game.slug);
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [game.slug]);

  // Let the info-card "Play Now" CTA (elsewhere on the page) start the run.
  useEffect(() => {
    function onRequest(e: Event) {
      const detail = (e as CustomEvent<{ slug?: string }>).detail;
      if (detail?.slug && detail.slug !== game.slug) return;
      startPlay();
    }
    window.addEventListener("gw-request-play", onRequest);
    return () => window.removeEventListener("gw-request-play", onRequest);
  }, [game.slug, startPlay]);

  // Retry / restart — recreate the iframe (new frameKey => fresh DOM node).
  const retry = useCallback(() => {
    teardown();
    setLoaded(false);
    setError(false);
    setProgress(null);
    setFrameKey((n) => n + 1);
  }, [teardown]);

  const backToArcade = useCallback(() => {
    teardown();
    setPlaying(false);
    router.push(`/games/${categorySlug(game.category)}`);
  }, [teardown, router, game.category]);

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        el.requestFullscreen();
      }
    } catch {
      toast("Fullscreen is not available here", "info");
    }
  }, []);

  const share = useCallback(() => {
    const url =
      typeof window !== "undefined" ? window.location.href : `https://gamewhame.com/play/${game.slug}`;
    const ok = () => toast("Link copied to clipboard", "share");
    const fail = () => toast("Copy failed — long-press to share", "share");
    try {
      const res = navigator.clipboard?.writeText(url);
      if (res && typeof res.then === "function") res.then(ok, fail);
      else ok();
    } catch {
      fail();
    }
  }, [game.slug]);

  const showFrame = playing && !error;
  const showLoader = playing && !loaded && !error;
  const pct = progress != null ? Math.round(progress * 100) : null;

  return (
    <section id="player" className={shell.wrap} aria-label={`${game.title} player`}>
      {/* Player top bar — controls live here, never over the play area. */}
      <div className={shell.chrome}>
        <div className={shell.chromeLeft}>
          <span className={`${shell.liveDot} ${playing && loaded ? shell.live : ""}`} aria-hidden />
          <span className={shell.chromeTitle}>
            {game.title}
            <span className={shell.chromeTag}>GameWhame Player</span>
          </span>
        </div>
        <div className={shell.controls}>
          <IconButton
            icon="reload"
            label="Restart game"
            variant="player"
            size={20}
            onClick={retry}
            disabled={!playing}
          />
          <span className={shell.favWrap}>
            <FavoriteButton slug={game.slug} title={game.title} size={19} />
          </span>
          <IconButton icon="share" label="Copy share link" variant="player" size={20} onClick={share} />
          <IconButton
            icon="fullscreen"
            label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            variant="player"
            size={20}
            onClick={toggleFullscreen}
          />
          <IconButton icon="arrowLeft" label="Back to arcade" variant="player" size={20} onClick={backToArcade} />
        </div>
      </div>

      {/* Reserved stage box (aspect set in CSS at SSR -> zero CLS). The extra
          .stage class adds overscroll/touch containment so gestures over the
          game never scroll the page, without affecting scroll elsewhere. */}
      <div
        className={`${shell.stage} ${styles.stage}`}
        ref={stageRef}
        data-fullscreen={isFullscreen || undefined}
        data-orientation={game.orientation || undefined}
      >
        {/* 1. Playable Unity iframe (client-only, mounted on Play). */}
        {showFrame && (
          <UnityFrame
            key={frameKey}
            src={src}
            title={`${game.title} — playable game`}
            onLoad={handleLoad}
            setRef={setFrameRef}
          />
        )}

        {/* 2. On-brand loading overlay until the iframe's `load` event fires. */}
        {showLoader && (
          <div className={styles.loading} role="status" aria-live="polite">
            <span className={styles.dots} aria-hidden>
              <span className={styles.link} />
              <i style={{ ["--i" as string]: 0 } as React.CSSProperties} />
              <i style={{ ["--i" as string]: 1 } as React.CSSProperties} />
              <i style={{ ["--i" as string]: 2 } as React.CSSProperties} />
              <i style={{ ["--i" as string]: 3 } as React.CSSProperties} />
            </span>
            <span className={styles.loadingText}>Loading {game.title}…</span>
            <span className={styles.loadingSub}>
              {pct != null ? `${pct}%` : "Starting the game engine"}
            </span>
            <span className={styles.bar} aria-hidden>
              <span
                className={pct != null ? styles.barFillDet : styles.barFill}
                style={pct != null ? ({ width: `${pct}%` } as React.CSSProperties) : undefined}
              />
            </span>
          </div>
        )}

        {/* 3. Poster / preview (before first play — no Unity bytes fetched). */}
        {!playing && (
          <div className={shell.poster}>
            {game.hasRealArt && !game.placeholder && (
              <span
                className={shell.posterBg}
                style={{ backgroundImage: `url(${game.thumb})` }}
                aria-hidden
              />
            )}
            <span className={shell.posterScrim} aria-hidden />
            <div className={shell.posterInner}>
              <span className={shell.posterArt}>
                <Thumb game={game} sizes="(max-width:767px) 60vw, 320px" priority />
              </span>
              <button
                type="button"
                className={shell.bigPlay}
                onClick={startPlay}
                aria-label={`Play ${game.title}`}
              >
                <PlayTriangle size={34} color="var(--pink)" />
              </button>
            </div>
          </div>
        )}

        {/* 4. Error + Retry (load failed or watchdog fired). */}
        {error && (
          <div className={styles.error} role="alert">
            <span className={styles.errorIcon}>
              <Icon name="reload" size={28} color="var(--aqua)" />
            </span>
            <h2 className={styles.errorTitle}>This game didn&apos;t load</h2>
            <p className={styles.errorCopy}>
              The game engine took too long or the connection dropped. Check your network and try again.
            </p>
            <div className={styles.errorActions}>
              <button type="button" className={styles.retry} onClick={retry}>
                <Icon name="reload" size={17} color="#fff" />
                Retry
              </button>
              <a className={styles.errorSimilar} href={`#${relatedAnchor}`}>
                <Icon name="flame" weight="fill" size={16} color="var(--pink)" />
                Play similar games now
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
