import Icon from "./Icon";
import styles from "./AdSlot.module.css";

interface AdSlotProps {
  variant?: "display" | "interstitial" | "rewarded" | "sidebar";
  label?: string;
  /** Reserved dimensions — height is always fixed so CLS stays 0. */
  height?: number;
  className?: string;
}

/**
 * AdSlot — reserved-height container so ads never cause layout shift. In dev it
 * renders an intentional labeled placeholder; in prod the network slot mounts
 * inside the same reserved box. Monetization rules (never over the frame, never
 * before first play) are enforced by placement, not by this component.
 */
export default function AdSlot({ variant = "display", label, height = 120, className }: AdSlotProps) {
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
