import Link from "next/link";
import Icon from "./Icon";
import type { IconName } from "@/lib/types";
import styles from "./IconButton.module.css";

interface IconButtonProps {
  icon: IconName;
  label: string; // required for a11y
  href?: string;
  onClick?: () => void;
  badge?: number;
  variant?: "surface" | "ghost" | "player" | "nav" | "header";
  active?: boolean;
  weight?: "line" | "fill";
  size?: number;
  disabled?: boolean;
  className?: string;
}

/** IconButton — round 44–46px control used across header, player, rails, nav. */
export default function IconButton({
  icon,
  label,
  href,
  onClick,
  badge,
  variant = "surface",
  active = false,
  weight,
  size = 22,
  disabled,
  className,
}: IconButtonProps) {
  const cls = [styles.btn, styles[variant], active ? styles.active : "", className].filter(Boolean).join(" ");
  const inner = (
    <>
      <Icon name={icon} weight={weight ?? (active ? "fill" : "line")} size={size} />
      {badge != null && badge > 0 && <span className={styles.badge}>{badge > 99 ? "99+" : badge}</span>}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={label} aria-current={active ? "page" : undefined}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick} aria-label={label} aria-pressed={active} disabled={disabled}>
      {inner}
    </button>
  );
}
