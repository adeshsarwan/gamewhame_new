"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import BrandImage from "./BrandImage";
import { CATEGORIES } from "@/lib/categories";
import type { IconName } from "@/lib/types";
import styles from "./CategorySidebar.module.css";

interface NavItem {
  label: string;
  slug: string;
  href: string;
  colorVar: string;
  icon: IconName;
}

/** "Home" first, then every category — the Poki-style browse rail. */
const ITEMS: NavItem[] = [
  { label: "Home", slug: "all", href: "/", colorVar: "--aqua", icon: "home" },
  ...CATEGORIES.map((c) => ({
    label: c.label,
    slug: c.slug,
    href: `/games/${c.slug}`,
    colorVar: c.colorVar,
    icon: c.icon,
  })),
];

/**
 * CategorySidebar — the slim left icon rail that replaces the old sticky
 * category pill bar (docs/10). Desktop-only (hidden < 1024px, where the
 * MobileBottomNav + header menu drawer take over). Sticky under the header with
 * its own quiet scroll. Each item is a category-tinted disc emblem
 * (/icons/cat-<slug>.png, SVG fallback) with a small label, linking to
 * /games/<slug>.
 */
export default function CategorySidebar() {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith("/games/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : pathname === "/"
      ? "all"
      : "";

  return (
    <aside className={styles.sidebar} aria-label="Game categories">
      <nav className={`${styles.rail} gw-noscrollbar`}>
        {ITEMS.map((it) => {
          const active = activeSlug === it.slug;
          return (
            <Link
              key={it.slug}
              href={it.href}
              className={`${styles.item} ${active ? styles.active : ""}`}
              style={{ ["--c" as string]: `var(${it.colorVar})` } as React.CSSProperties}
              aria-current={active ? "page" : undefined}
            >
              <span className={styles.disc}>
                <BrandImage
                  src={`/icons/cat-${it.slug}.png`}
                  className={styles.emblem}
                  decorative
                  fallback={<Icon name={it.icon} weight="fill" size={22} color="#fff" />}
                />
              </span>
              <span className={styles.label}>{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
