"use client";

import { usePathname } from "next/navigation";
import CategoryPill from "./CategoryPill";
import { CATEGORIES } from "@/lib/categories";
import styles from "./CategoryPillBar.module.css";

/** Sticky category bar under the header (docs/02 §3.0). Active pill derived from
 *  the current path. */
export default function CategoryPillBar() {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith("/games/") ? decodeURIComponent(pathname.split("/")[2] ?? "") : "";
  const isHome = pathname === "/";

  return (
    <nav className={styles.bar} aria-label="Game categories">
      <div className={`${styles.scroll} gw-noscrollbar`}>
        <CategoryPill label="All Games" href="/" icon="grid" active={isHome} />
        {CATEGORIES.map((c) => (
          <CategoryPill
            key={c.slug}
            label={c.label}
            href={`/games/${c.slug}`}
            color={c.colorVar}
            active={activeSlug === c.slug}
          />
        ))}
      </div>
    </nav>
  );
}
