import Icon from "./Icon";
import styles from "./AdSlot.module.css";

interface AdSlotProps {
  variant?: "display" | "interstitial" | "rewarded" | "sidebar";
  label?: string;
  /** Reserved dimensions — height is always fixed so CLS stays 0. */
  height?: number;
  className?: string;
  /**
   * When set, renders a REAL Price Optimiser managed ad container carrying this
   * exact DOM id (e.g. "ad-leaderboard", "ad-incontent"). The id must be unique
   * and appear only once in the rendered DOM. Price Optimiser requests against
   * and fills this container, so no placeholder/mock chrome is drawn — only the
   * reserved-height box is kept so CLS stays 0.
   */
  managedId?: string;
}

/**
 * AdSlot — reserved-height container so ads never cause layout shift. In dev it
 * renders an intentional labeled placeholder; in prod the network slot mounts
 * inside the same reserved box. Monetization rules (never over the frame, never
 * before first play) are enforced by placement, not by this component.
 *
 * With `managedId`, it instead renders an empty Price Optimiser managed
 * container (the div Price Optimiser fills) — no placeholder text.
 */
export default function AdSlot({ variant = "display", label, height = 120, className, managedId }: AdSlotProps) {
  if (managedId) {
    return (
      <aside
        className={[styles.slot, styles.managed, styles[variant], className].filter(Boolean).join(" ")}
        style={{ minHeight: height }}
        aria-label="Advertisement"
      >
        <div id={managedId} className={styles.managedInner} />
      </aside>
    );
  }

  const rewarded = variant === "rewarded";
  const title = label ?? (rewarded ? "Rewarded" : "Advertisement");
  return (
    <aside
      className={[styles.slot, styles[variant], className].filter(Boolean).join(" ")}
      style={{ minHeight: height }}
      aria-label="Advertisement"
    >
      <span className={styles.tag}>Ad</span>
      <span className={styles.body}>
        {rewarded && <Icon name="crown" weight="fill" size={20} color="var(--yellow)" />}
        <span className={styles.title}>{title}</span>
        <span className={styles.sub}>Placement reserved</span>
      </span>
    </aside>
  );
}
