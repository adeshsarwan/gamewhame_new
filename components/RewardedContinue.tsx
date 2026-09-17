"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import AdSlot from "./AdSlot";
import styles from "./RewardedContinue.module.css";

interface RewardedContinueProps {
  /** Fired when the (mock) rewarded ad finishes — grant the continue. */
  onComplete: () => void;
  /** Fired when the player backs out before the reward is earned. */
  onCancel: () => void;
  /** Countdown seconds for the mock ad. */
  seconds?: number;
}

/**
 * RewardedContinue — the single rewarded surface. Player-initiated ONLY (opened
 * from the game-over panel), never a pre-play gate and never mid-run. Mocks a
 * short rewarded ad with a countdown over an `AdSlot variant="rewarded"`, then
 * grants the continue. Skippable before the reward is earned (no reward if so).
 */
export default function RewardedContinue({ onComplete, onCancel, seconds = 5 }: RewardedContinueProps) {
  const [left, setLeft] = useState(seconds);
  const doneRef = useRef(false);

  useEffect(() => {
    // Respect reduced motion / just tick a real timer.
    const id = window.setInterval(() => {
      setLeft((n) => {
        if (n <= 1) {
          window.clearInterval(id);
          if (!doneRef.current) {
            doneRef.current = true;
            // Defer so we grant after this render tick settles.
            window.setTimeout(onComplete, 350);
          }
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [onComplete]);

  const pct = Math.round(((seconds - left) / seconds) * 100);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Watch to continue">
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.crown}>
            <Icon name="crown" weight="fill" size={20} color="var(--yellow)" />
          </span>
          <div>
            <h2 className={styles.title}>Watch to continue</h2>
            <p className={styles.sub}>Finish the short ad to jump back in with a fresh run.</p>
          </div>
          <button type="button" className={styles.close} onClick={onCancel} aria-label="Cancel and close">
            <Icon name="close" size={18} />
          </button>
        </div>

        <AdSlot variant="rewarded" label="Rewarded video" height={150} />

        <div className={styles.progressRow}>
          <span className={styles.progressTrack} aria-hidden>
            <span className={styles.progressFill} style={{ width: `${pct}%` }} />
          </span>
          <span className={styles.count} aria-live="polite">
            {left > 0 ? `Reward in ${left}s` : "Unlocking…"}
          </span>
        </div>

        <button type="button" className={styles.skip} onClick={onCancel}>
          Skip — no reward
        </button>
      </div>
    </div>
  );
}
