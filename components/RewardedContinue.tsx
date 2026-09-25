"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { showRewardedAd, preloadRewardedAd, isRewardedAvailable } from "@/lib/priceOptimiser";
import styles from "./RewardedContinue.module.css";

interface RewardedContinueProps {
  /** Fired ONLY when the rewarded ad reports a granted/rewarded outcome. */
  onComplete: () => void;
  /** Fired when no reward was earned (dismissed, no fill, error, unavailable). */
  onCancel: (reason?: string) => void;
}

const COPY: Record<string, string> = {
  unavailable: "Rewarded ads aren't available right now.",
  "no-fill": "No ad was available this time.",
  error: "The ad couldn't load. Nothing lost — jump back in.",
  timeout: "The ad took too long. Nothing lost — jump back in.",
  dismissed: "Ad closed early, so no reward this time.",
  disabled: "Rewarded ads are turned off.",
  "in-flight": "An ad is already playing.",
};

/**
 * RewardedContinue — the single rewarded surface. Player-initiated ONLY (opened
 * from the game-over panel), never a pre-play gate and never mid-run.
 *
 * Price Optimiser owns the rewarded lifecycle: this component just asks the SDK
 * for an ad and reports the outcome. The reward is granted ONLY when the SDK
 * says the ad was actually rewarded — never on preload, show, close, no-fill,
 * error or timeout. Failure is silent and harmless: the player keeps their
 * game-over options.
 */
export default function RewardedContinue({ onComplete, onCancel }: RewardedContinueProps) {
  const [status, setStatus] = useState<"loading" | "failed">("loading");
  const [note, setNote] = useState<string | null>(null);
  const started = useRef(false);
  const alive = useRef(true);

  // Warm the ad as soon as the panel opens; the request itself follows.
  useEffect(() => {
    preloadRewardedAd();
  }, []);

  useEffect(() => {
    alive.current = true;
    // Guard against React double-invoking effects (StrictMode) or a re-render
    // starting a second workflow — one open panel means one ad request.
    if (started.current) return;
    started.current = true;

    if (!isRewardedAvailable()) {
      setStatus("failed");
      setNote(COPY.unavailable);
      return;
    }

    showRewardedAd().then((outcome) => {
      if (!alive.current) return;
      if (outcome.granted) {
        onComplete();
        return;
      }
      setStatus("failed");
      setNote(COPY[outcome.reason] ?? COPY.dismissed);
    });

    return () => {
      alive.current = false;
    };
    // Intentionally run once per mounted panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Watch to continue">
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.crown}>
            <Icon name="crown" weight="fill" size={20} color="var(--yellow)" />
          </span>
          <div>
            <h2 className={styles.title}>Watch to continue</h2>
            <p className={styles.sub}>
              {status === "loading"
                ? "Finding your ad — finish it to jump back in with a fresh run."
                : "No reward this time."}
            </p>
          </div>
          <button type="button" className={styles.close} onClick={() => onCancel()} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className={styles.stage} aria-live="polite">
          {status === "loading" ? (
            <span className={styles.spinner} aria-hidden />
          ) : (
            <p className={styles.note}>{note}</p>
          )}
        </div>

        <button type="button" className={styles.skip} onClick={() => onCancel()}>
          {status === "loading" ? "Cancel" : "Back to game"}
        </button>
      </div>
    </div>
  );
}
