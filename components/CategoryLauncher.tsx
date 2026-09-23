import Link from "next/link";
import Icon from "./Icon";
import BrandImage from "./BrandImage";
import { CATEGORIES } from "@/lib/categories";
import type { IconName } from "@/lib/types";
import styles from "./CategoryLauncher.module.css";

interface LaunchItem {
  label: string;
  slug: string;
  href: string;
  colorVar: string;
  icon: IconName;
}

/** "All" launcher first, then every category — glossy generated emblem with an
 *  <Icon> SVG fallback while the art is still being generated. */
const ITEMS: LaunchItem[] = [
  { label: "All", slug: "all", href: "/games/popular", colorVar: "--navy", icon: "grid" },
  ...CATEGORIES.map((c) => ({
    label: c.label,
    slug: c.slug,
    href: `/games/${c.slug}`,
    colorVar: c.colorVar,
    icon: c.icon,
  })),
];

/**
 * CategoryLauncher — the prominent, horizontally-scrollable row of rounded
 * category tiles that anchors browsing on the home page. Each tile shows the
 * generated `cat-<slug>.png` emblem on a category-tinted disc (SVG fallback),
 * with a springy hover.
 */
export default function CategoryLauncher() {
  return (
    <div className={styles.wrap}>
      <ul className={`${styles.row} gw-noscrollbar`}>
        {ITEMS.map((it) => (
          <li key={it.slug} className={styles.item}>
            <Link
              href={it.href}
              className={styles.tile}
              style={{ ["--c" as string]: `var(${it.colorVar})` } as React.CSSProperties}
            >
              <span className={styles.disc}>
                <BrandImage
                  src={`/icons/cat-${it.slug}.png`}
                  className={styles.emblem}
                  decorative
                  fallback={<Icon name={it.icon} weight="fill" size={34} color="var(--c)" />}
                />
              </span>
              <span className={styles.label}>{it.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
