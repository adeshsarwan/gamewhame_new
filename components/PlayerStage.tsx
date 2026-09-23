"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Game } from "@/lib/types";
import { categorySlug } from "@/lib/categories";
import Icon from "./Icon";
import IconButton from "./IconButton";
import FavoriteButton from "./FavoriteButton";
import { PlayTriangle } from "./BrandMarks";
import { toast } from "./Toast";
import RewardedContinue from "./RewardedContinue";
import styles from "./PlayerStage.module.css";

const RECENT_KEY = "gw_recent";
const NOTIFY_KEY = "gw_notify";

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

function rememberNotify(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(NOTIFY_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(slug)) {
      window.localStorage.setItem(NOTIFY_KEY, JSON.stringify([...list, slug]));
    }
  } catch {
    /* ignore */
  }
}

interface PlayerStageProps {
  game: Game;
  /** Anchor id of the related-games section (for the "play similar" jump). */
  relatedAnchor?: string;
}

/**
 * PlayerStage — the P1 core. Reserves a 16:9 (desktop) / 9:16 (mobile) stage at
 * SSR for zero CLS, then AUTO-MOUNTS the sandboxed game iframe CLIENT-SIDE only
 * on mount (no GameWhame poster / Play step — the user lands straight on the
 * loading overlay, then the game's own start screen). The iframe is torn down
 * (src -> about:blank, node removed, refs nulled) on unmount / route change /
 * Back so it is garbage-collected — a hard PRD requirement at 1M users.
 *
 * Listens to the game's postMessage protocol (gw:ready / gw:score / gw:gameover)
 * with an origin + source + shape check, and on game over shows a tasteful,
 * player-initiated panel (Play again + optional rewarded "watch to continue").
 * No ad ever gates the first play and no ad interrupts an active run.
 */
export default function PlayerStage({ game, relatedAnchor = "related-games" }: PlayerStageProps) {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const playable = Boolean(game.playUrl);
  const [playing, setPlaying] = useState(false);
  const [runId, setRunId] = useState(0); // bump to remount (reload / play again)
  const [ready, setReady] = useState(false); // gw:ready received
  const [score, setScore] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [showRewarded, setShowRewarded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /** Blank + drop the iframe so the browser can reclaim its memory. */
  const teardown = useCallback(() => {
    const el = iframeRef.current;
    if (el) {
      try {
        el.src = "about:blank";
      } catch {
        /* cross-origin edge — node removal below still frees it */
      }
    }
    iframeRef.current = null;
  }, []);

  // Hard teardown on unmount / route change (memory-leak guard).
  useEffect(() => () => teardown(), [teardown]);

  // Fallback readiness: self-hosted third-party games (Construct, CreateJS, …)
  // never emit gw:ready, so treat the iframe's load event as "ready" after a
  // short settle for the first frame to paint. Games that DO integrate our SDK
  // still flip ready earlier via the gw:ready message — whichever fires first.
  const onFrameLoad = useCallback(() => {
    const el = iframeRef.current;
    // Ignore the load event fired by teardown's about:blank swap.
    if (!el || el.src === "about:blank") return;
    window.setTimeout(() => setReady(true), 150);
  }, []);

  // Track native fullscreen state so the control icon stays in sync.
  useEffect(() => {
    function sync() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  // Game -> host messages. Trust only our own iframe, same origin, gw:* shape.
  useEffect(() => {
    if (!playing) return;
    function onMessage(e: MessageEvent) {
      try {
        if (e.source !== iframeRef.current?.contentWindow) return;
        if (e.origin !== window.location.origin) return;
        const data = e.data as { type?: unknown; score?: unknown };
        if (!data || typeof data.type !== "string" || !data.type.startsWith("gw:")) return;
        switch (data.type) {
          case "gw:ready":
            setReady(true);
            break;
          case "gw:score":
            if (typeof data.score === "number") setScore(data.score);
            break;
          case "gw:gameover":
            setFinalScore(typeof data.score === "number" ? data.score : null);
            setGameOver(true);
            break;
          default:
            break;
        }
      } catch {
        /* malformed message — ignore */
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [playing]);

  const startPlay = useCallback(() => {
    if (!playable) return;
    setPlaying(true);
    setReady(false);
    setScore(null);
    setGameOver(false);
    recordRecent(game.slug);
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [playable, game.slug]);

  // Auto-mount the game on first client render for playable games — no poster /
  // Play step. Runs in an effect (not during render/SSR) so the iframe stays
  // client-only and hydration matches. Games with no playUrl are never mounted.
  useEffect(() => {
    if (!playable) return;
    setPlaying(true);
    setReady(false);
    setScore(null);
    setGameOver(false);
    recordRecent(game.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.slug, playable]);

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

  const reloadGame = useCallback(() => {
    setGameOver(false);
    setShowRewarded(false);
    setReady(false);
    setScore(null);
    setRunId((n) => n + 1);
  }, []);

  const backToArcade = useCallback(() => {
    teardown();
    setPlaying(false);
    setGameOver(false);
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
    const url = typeof window !== "undefined" ? window.location.href : `https://gamewhame.com/play/${game.slug}`;
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

  const notifyMe = useCallback(() => {
    rememberNotify(game.slug);
    toast(`We'll ping you when ${game.title} lands`, "bell");
  }, [game.slug, game.title]);

  // The rewarded "watch to continue" completed -> resume the run.
  const onRewardComplete = useCallback(() => {
    try {
      iframeRef.current?.contentWindow?.postMessage({ type: "gw:continue", slug: game.slug }, window.location.origin);
    } catch {
      /* ignore */
    }
    reloadGame();
    toast("Continue unlocked — good luck!", "crown");
  }, [game.slug, reloadGame]);

  return (
    <section id="player" className={styles.wrap} aria-label={`${game.title} player`}>
      {/* Player top bar — controls live here, never over the play area. */}
      <div className={styles.chrome}>
        <div className={styles.chromeLeft}>
          <span className={`${styles.liveDot} ${playing && ready ? styles.live : ""}`} aria-hidden />
          <span className={styles.chromeTitle}>
            {game.title}
            <span className={styles.chromeTag}>GameWhame Player</span>
          </span>
          {playing && score != null && (
            <span className={styles.scorePill} aria-live="polite">
              Score <b>{score.toLocaleString()}</b>
            </span>
          )}
        </div>
        <div className={styles.controls}>
          <IconButton
            icon="reload"
            label="Restart game"
            variant="player"
            size={20}
            onClick={reloadGame}
            disabled={!playing}
          />
          <span className={styles.favWrap}>
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

      {/* Reserved stage box (aspect set in CSS at SSR -> zero CLS). */}
      <div className={styles.stage} ref={stageRef} data-fullscreen={isFullscreen || undefined}>
        {/* 1. Playable iframe (client-only, mounted on Play). */}
        {playable && playing && (
          <iframe
            key={runId}
            ref={iframeRef}
            className={styles.frame}
            src={game.playUrl as string}
            title={`${game.title} — playable game`}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            allow="autoplay; fullscreen; gamepad"
            loading="eager"
            onLoad={onFrameLoad}
          />
        )}

        {/* Lively indeterminate loader until the iframe load event / gw:ready.
            Cross-origin means no real %, so we keep the motion continuous so it
            never reads as frozen. */}
        {playable && playing && !ready && (
          <div className={styles.loading} role="status" aria-live="polite">
            <span className={styles.loadMark} aria-hidden>
              <span className={styles.loadMarkRing} />
              <span className={styles.loadMarkCore}>
                <PlayTriangle size={22} color="#fff" />
              </span>
            </span>
            <span className={styles.loadTitle}>{game.title}</span>
            <span className={styles.loadTrack} aria-hidden>
              <span className={styles.loadFill} />
            </span>
            <span className={styles.loadingText}>
              Loading
              <span className={styles.loadDots} aria-hidden>
                <b />
                <b />
                <b />
              </span>
            </span>
          </div>
        )}

        {/* 2. Honest "coming to the browser arcade" state (playUrl null). */}
        {!playable && (
          <div className={styles.coming}>
            <span className={styles.comingIcon}>
              <Icon name="gamepad" size={30} color="var(--aqua)" />
            </span>
            <h2 className={styles.comingTitle}>Coming to the browser arcade</h2>
            <p className={styles.comingCopy}>
              We&apos;re hand-porting {game.title} to play instantly in your browser — no fake emulator, no
              half-baked build. It&apos;ll be here soon.
            </p>
            <div className={styles.comingActions}>
              <a
                className={styles.comingStore}
                href={game.externalStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="devices" size={18} />
                Play on Android
                <Icon name="caretRight" size={15} />
              </a>
              <button type="button" className={styles.comingGhost} onClick={notifyMe}>
                <Icon name="bell" size={18} />
                Notify me
              </button>
            </div>
            <a className={styles.comingSimilar} href={`#${relatedAnchor}`}>
              <Icon name="flame" weight="fill" size={16} color="var(--pink)" />
              Play similar games now
            </a>
          </div>
        )}

        {/* 4. Player-initiated game-over panel (never auto ads / never mid-run). */}
        {gameOver && !showRewarded && (
          <div className={styles.overlay} role="dialog" aria-label="Game over" aria-modal="true">
            <div className={styles.gameover}>
              <span className={styles.goKicker}>Nice run</span>
              <h2 className={styles.goTitle}>Game over</h2>
              {finalScore != null && (
                <p className={styles.goScore}>
                  Score <b>{finalScore.toLocaleString()}</b>
                </p>
              )}
              <div className={styles.goActions}>
                <button type="button" className={styles.goPrimary} onClick={reloadGame}>
                  <PlayTriangle size={18} color="#fff" />
                  Play again
                </button>
                <button type="button" className={styles.goReward} onClick={() => setShowRewarded(true)}>
                  <Icon name="crown" weight="fill" size={18} color="var(--yellow)" />
                  Watch to continue
                </button>
              </div>
              <a className={styles.goSimilar} href={`#${relatedAnchor}`}>
                Or discover a new game
                <Icon name="caretRight" size={14} />
              </a>
            </div>
          </div>
        )}

        {/* 5. Opt-in rewarded "continue" overlay (mock ad + countdown). */}
        {showRewarded && (
          <RewardedContinue
            onComplete={onRewardComplete}
            onCancel={() => setShowRewarded(false)}
          />
        )}
      </div>
    </section>
  );
}
