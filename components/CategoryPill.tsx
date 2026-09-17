import Link from "next/link";
import Icon from "./Icon";
import type { IconName } from "@/lib/types";
import styles from "./CategoryPill.module.css";

interface CategoryPillProps {
  label: string;
  href: string;
  color?: string; // CSS var name e.g. "--c-puzzle"
  active?: boolean;
  icon?: IconName;
  /** button mode for in-page sub-filters */
  onClick?: () => void;
}

/** CategoryPill — color dot (or icon) + label; active = navy fill + scale. */
export default function CategoryPill({ label, href, color, active, icon, onClick }: CategoryPillProps) {
  const dotStyle = color ? ({ background: `var(${color})` } as React.CSSProperties) : undefined;
  const cls = [styles.pill, active ? styles.active : ""].join(" ");
  const inner = (
    <>
      {icon ? (
        <Icon name={icon} size={15} weight={active ? "fill" : "line"} />
      ) : (
        <span className={styles.dot} style={dotStyle} />
      )}
      <span>{label}</span>
    </>
  );
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick} aria-pressed={active}>
        {inner}
      </button>
    );
  }
  return (
    <Link href={href} className={cls} aria-current={active ? "page" : undefined}>
      {inner}
    </Link>
  );
}
