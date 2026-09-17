"use client";

import { useCallback } from "react";
import FavoriteButton from "./FavoriteButton";
import { PlayTriangle } from "./BrandMarks";
import Icon from "./Icon";
import { toast } from "./Toast";
import styles from "./InfoActions.module.css";

/**
 * InfoActions — the info-card CTA row. "Play Now" asks the PlayerStage on the
 * same page to start (via a slug-scoped event) so first play stays instant and
 * user-initiated; Favorite reuses the shared FavoriteButton, Share copies the
 * play URL to the clipboard with a toast. Disabled-play (coming-soon) games get
 * the honest store link instead of a Play button.
 */
export default function InfoActions({
  slug,
  title,
  playable,
  storeUrl,
}: {
  slug: string;
  title: string;
  playable: boolean;
  storeUrl: string;
}) {
  const play = useCallback(() => {
    window.dispatchEvent(new CustomEvent("gw-request-play", { detail: { slug } }));
  }, [slug]);

  const share = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : `https://gamewhame.com/play/${slug}`;
    const ok = () => toast("Link copied to clipboard", "share");
    const fail = () => toast("Copy failed — long-press to share", "share");
    try {
      const res = navigator.clipboard?.writeText(url);
      if (res && typeof res.then === "function") res.then(ok, fail);
      else ok();
    } catch {
      fail();
    }
  }, [slug]);

  return (
    <div className={styles.row}>
      {playable ? (
        <button type="button" className={styles.play} onClick={play} aria-label={`Play ${title}`}>
          <PlayTriangle size={18} color="#fff" />
          Play Now
        </button>
      ) : (
        <a
          className={styles.play}
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Get ${title} on the store`}
        >
          <Icon name="devices" size={18} />
          Get the app
        </a>
      )}
      <FavoriteButton slug={slug} title={title} variant="ghost" />
      <button type="button" className={styles.share} onClick={share} aria-label="Copy share link">
        <Icon name="share" size={18} />
        Share
      </button>
    </div>
  );
}
