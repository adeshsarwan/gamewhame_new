"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import AdSlot from "./AdSlot";
import styles from "./InterstitialGate.module.css";

const COUNT_KEY = "gw_interstitial_count";
const EVERY = 3; // show an interstitial on every 3rd game-to-game transition
const DURATION = 4; // seconds

/**
 * InterstitialGate — wraps the discovery region (related rails + sidebar). When
 * the player taps through to the NEXT game, it intercepts the /play/ link,
 * increments a localStorage counter and — on every 3rd transition — shows a
 * short, skippable interstitial in the natural gap between plays before
 * navigating. Never blocks the first play and never interrupts an active run.
 */
export default function InterstitialGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [left, setLeft] = useState(DURATION);
  const wrapRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (href: string) => {
      setPending(null);
      router.push(href);
    },
    [router],
  );

  // Countdown while the interstitial is showing, then auto-continue.
  // The display tick and the navigation are kept separate so router.push never
  // runs inside a setState updater (which React flags as a cross-component update).
  useEffect(() => {
    if (!pending) return;
    setLeft(DURATION);
    const tick = window.setInterval(() => {
      setLeft((n) => (n <= 1 ? 1 : n - 1));
    }, 1000);
    const done = window.setTimeout(() => go(pending), DURATION * 1000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [pending, go]);

  const onClickCapture = useCallback(
    (e: React.MouseEvent) => {
      // Only intercept plain left-clicks on internal /play/ links.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      const href = anchor?.getAttribute("href");
      if (!href || !href.startsWith("/play/")) return;

      let count = 0;
      try {
        count = Number(window.localStorage.getItem(COUNT_KEY) || "0") + 1;
        window.localStorage.setItem(COUNT_KEY, String(count));
      } catch {
        count = 0;
      }

      if (count > 0 && count % EVERY === 0) {
        e.preventDefault();
        setPending(href);
      }
      // Otherwise let Next's <Link> handle navigation normally.
    },
    [],
  );

  return (
    <div ref={wrapRef} onClickCapture={onClickCapture}>
      {children}

      {pending && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Loading next game">
          <div className={styles.card}>
            <div className={styles.head}>
              <span className={styles.kicker}>
                <Icon name="sparkle" weight="fill" size={15} color="var(--aqua)" />
                Up next
              </span>
              <button
                type="button"
                className={styles.skip}
                onClick={() => go(pending)}
                aria-label="Skip ad and continue"
              >
                Skip
                <Icon name="caretRight" size={15} />
              </button>
            </div>

            <AdSlot variant="interstitial" label="Interstitial" height={220} />

            <div className={styles.footer}>
              <span className={styles.track} aria-hidden>
                <span
                  className={styles.fill}
                  style={{ width: `${Math.round(((DURATION - left) / DURATION) * 100)}%` }}
                />
              </span>
              <span className={styles.count}>Continuing in {left}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
