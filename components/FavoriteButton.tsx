"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { isFavorite, toggleFavorite, FAVS_EVENT } from "@/lib/favorites";
import { toast } from "./Toast";
import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  slug: string;
  title: string;
  size?: number;
  variant?: "card" | "ghost";
  onToggle?: (active: boolean) => void;
}

/**
 * FavoriteButton — localStorage-backed (no account). Heart pop + particle burst
 * on activate, toast feedback. Starts inactive on the server (favorites are
 * client-only) then syncs from storage after mount to avoid hydration mismatch.
 */
export default function FavoriteButton({ slug, title, size = 18, variant = "card", onToggle }: FavoriteButtonProps) {
  const [active, setActive] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    setActive(isFavorite(slug));
    function sync() {
      setActive(isFavorite(slug));
    }
    window.addEventListener(FAVS_EVENT, sync);
    return () => window.removeEventListener(FAVS_EVENT, sync);
  }, [slug]);

  function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(slug);
    setActive(next);
    if (next) {
      setBurst((b) => b + 1);
      toast(`Saved "${title}"`, "heart");
    } else {
      toast(`Removed "${title}"`, "heart");
    }
    onToggle?.(next);
  }

  const cls = [styles.btn, styles[variant], active ? styles.active : ""].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={cls}
      onClick={handle}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from favorites` : `Save ${title} to favorites`}
    >
      <span key={burst} className={active ? styles.pop : ""}>
        <Icon name="heart" weight={active ? "fill" : "line"} size={size} />
      </span>
      {variant === "ghost" && <span className={styles.ghostLabel}>{active ? "Saved" : "Favorite"}</span>}
      {burst > 0 && active && (
        <span key={`burst-${burst}`} className={styles.particles} aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={styles.particle} style={{ ["--i" as string]: String(i) } as React.CSSProperties} />
          ))}
        </span>
      )}
    </button>
  );
}
