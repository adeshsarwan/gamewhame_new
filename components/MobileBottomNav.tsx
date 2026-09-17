"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import type { IconName } from "@/lib/types";
import styles from "./MobileBottomNav.module.css";

export const OPEN_SEARCH_EVENT = "gw-open-search";

interface Item {
  label: string;
  icon: IconName;
  href?: string;
  action?: "search";
}

const ITEMS: Item[] = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Search", icon: "search", action: "search" },
  { label: "Games", icon: "gamepad", href: "/games/popular" },
  { label: "Saved", icon: "heart", href: "/favorites" },
];

/** Floating bottom nav (docs/02 §3.0), shown <768px. */
export default function MobileBottomNav() {
  const pathname = usePathname();

  function isActive(item: Item) {
    if (item.href === "/") return pathname === "/";
    if (item.href === "/favorites") return pathname === "/favorites";
    if (item.href?.startsWith("/games")) return pathname.startsWith("/games");
    return false;
  }

  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.bar}>
        {ITEMS.map((item) => {
          const active = isActive(item);
          const inner = (
            <>
              <Icon name={item.icon} size={23} weight={active ? "fill" : "line"} />
              <span>{item.label}</span>
            </>
          );
          if (item.action === "search") {
            return (
              <button
                key={item.label}
                type="button"
                className={styles.item}
                aria-label="Search games"
                onClick={() => window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT))}
              >
                {inner}
              </button>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`${styles.item} ${active ? styles.active : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
