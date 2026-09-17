import Icon from "./Icon";
import styles from "./RatingBadge.module.css";

/**
 * RatingBadge — `badge` = white pill (star + value) for card corners;
 * `inline` = stars row + numeric for detail pages.
 */
export default function RatingBadge({
  rating,
  variant = "badge",
  count,
}: {
  rating: number;
  variant?: "badge" | "inline";
  count?: number;
}) {
  if (variant === "inline") {
    const full = Math.round(rating);
    return (
      <span className={styles.inline}>
        <span className={styles.stars} aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <Icon key={i} name="star" weight={i < full ? "fill" : "line"} size={16} color={i < full ? "var(--yellow)" : "var(--muted-2)"} />
          ))}
        </span>
        <b className={styles.num}>{rating.toFixed(1)}</b>
        {count != null && <small className={styles.count}>({count.toLocaleString()})</small>}
      </span>
    );
  }
  return (
    <span className={styles.badge}>
      <Icon name="star" weight="fill" size={13} color="var(--yellow)" />
      {rating.toFixed(1)}
    </span>
  );
}
