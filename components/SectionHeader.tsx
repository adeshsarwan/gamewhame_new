import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "./Icon";
import IconButton from "./IconButton";
import type { IconName } from "@/lib/types";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  iconColor?: string;
  /** "See all" link on the right. */
  seeAllHref?: string;
  /** Rail scroll handlers — renders left/right arrows when provided. */
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  /** Sort select or any extra control on the right. */
  sort?: ReactNode;
}

/** SectionHeader — navy icon chip + title (+ optional subtitle, arrows, sort). */
export default function SectionHeader({
  icon,
  title,
  subtitle,
  iconColor,
  seeAllHref,
  onScrollLeft,
  onScrollRight,
  sort,
}: SectionHeaderProps) {
  return (
    <div className={styles.head}>
      <div className={styles.left}>
        <span className={styles.chip} style={iconColor ? { background: iconColor } : undefined}>
          <Icon name={icon} weight="fill" size={20} color="#fff" />
        </span>
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.sub}>{subtitle}</p>}
        </div>
      </div>

      <div className={styles.right}>
        {sort}
        {seeAllHref && (
          <Link href={seeAllHref} className={styles.seeAll}>
            See all
            <Icon name="caretRight" size={16} />
          </Link>
        )}
        {(onScrollLeft || onScrollRight) && (
          <div className={styles.arrows}>
            <IconButton icon="caretLeft" label="Scroll left" onClick={onScrollLeft} size={20} />
            <IconButton icon="caretRight" label="Scroll right" onClick={onScrollRight} size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
