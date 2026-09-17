"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Game } from "@/lib/types";
import { LogoMark } from "./BrandMarks";
import Icon from "./Icon";
import styles from "./MascotSearchCard.module.css";

/**
 * MascotSearchCard — the mascot demoted to a single grid-cell tile that sits
 * INSIDE the top game strip (docs/10), never a full-width hero. It is one of the
 * widgets in the row: a small idling mascot, a short prompt, a "Surprise me"
 * button (jumps to a random game) and a link to full search. Search already
 * lives in the header, so this is a compact playful accent, not the centerpiece.
 *
 * The mascot idles with a subtle CSS bob and a periodic wink built from two
 * normalized frames (frame-1 = eyes open, frame-2 = wink) that share the exact
 * same pose/scale/position, so only the eyes move — no jump. Both frames are
 * decorative and load eagerly into a fixed box (zero CLS); if they fail we fall
 * back to the brand LogoMark. Motion is disabled under prefers-reduced-motion
 * (handled in CSS), leaving a single static frame.
 */
export default function MascotSearchCard({ games = [] }: { games?: Game[] }) {
  const router = useRouter();
  const [artFailed, setArtFailed] = useState(false);

  function surprise() {
    const playable = games.filter((g) => g.playUrl !== null);
    const pool = playable.length ? playable : games;
    if (!pool.length) {
      router.push("/games/popular");
      return;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/play/${pick.slug}`);
  }

  return (
    <section className={styles.tile} aria-label="Find a game to play">
      <span className={styles.glow} aria-hidden />
      <div className={styles.mascotBox} aria-hidden>
        <span className={styles.halo} aria-hidden />
        {artFailed ? (
          <LogoMark size={52} />
        ) : (
          <span className={styles.mascot}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/mascot-anim/frame-1.png"
              alt=""
              aria-hidden
              className={`${styles.frame} ${styles.frameBase}`}
              draggable={false}
              loading="eager"
              decoding="async"
              onError={() => setArtFailed(true)}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/mascot-anim/frame-2.png"
              alt=""
              aria-hidden
              className={`${styles.frame} ${styles.frameWink}`}
              draggable={false}
              loading="eager"
              decoding="async"
            />
          </span>
        )}
      </div>
      <div className={styles.copy}>
        <h2 className={styles.title}>What to play?</h2>
        <button type="button" className={styles.surprise} onClick={surprise}>
          <Icon name="sparkle" weight="fill" size={15} color="var(--navy)" />
          Surprise me
        </button>
        <Link href="/search" className={styles.searchLink}>
          <Icon name="search" size={13} color="#06263a" />
          Search games
        </Link>
      </div>
    </section>
  );
}
