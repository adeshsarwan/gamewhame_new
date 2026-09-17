"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SearchBox from "./SearchBox";
import Icon from "./Icon";
import BrandImage from "./BrandImage";
import { LogoMark, PlayTriangle } from "./BrandMarks";
import type { IconName } from "@/lib/types";
import styles from "./HomeHero.module.css";

export interface HeroChip {
  label: string;
  href: string;
  icon: IconName;
}

interface HomeHeroProps {
  /** Instant-play target for the primary CTA (a featured game). */
  playHref: string;
  /** Total games, shown in the eyebrow. */
  total: number;
  /** Quick category chips under the CTAs. */
  chips: HeroChip[];
  /** Anchor id the "Browse games" button scrolls to. */
  browseHref?: string;
}

/**
 * HomeHero — the mascot-led welcome panel. Bright teal gradient, big
 * "Play. Discover. Repeat." headline, embedded live search, an instant-play
 * primary CTA + a browse secondary, quick chips, and floating decorative game
 * bits with a gentle pointer parallax (disabled for reduced-motion / touch).
 */
export default function HomeHero({ playHref, total, chips, browseHref = "#browse" }: HomeHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let raf = 0;
    function onMove(e: PointerEvent) {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const r = el!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        el!.style.setProperty("--px", px.toFixed(3));
        el!.style.setProperty("--py", py.toFixed(3));
      });
    }
    function reset() {
      el!.style.setProperty("--px", "0");
      el!.style.setProperty("--py", "0");
    }
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.hero} aria-labelledby="hero-title">
      {/* Decorative sky: soft clouds + brand blobs */}
      <div className={styles.sky} aria-hidden>
        <span className={`${styles.cloud} ${styles.cloud1}`} />
        <span className={`${styles.cloud} ${styles.cloud2}`} />
        <span className={`${styles.blob} ${styles.blob1}`} />
        <span className={`${styles.blob} ${styles.blob2}`} />
      </div>

      <div className={styles.grid}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>
            <span className={styles.liveDot} aria-hidden />
            {total}+ free games <span className={styles.eyebrowDot} aria-hidden>·</span> no downloads
          </span>

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line}>Play.</span>
            <span className={styles.line}>Discover.</span>
            <span className={`${styles.line} ${styles.accent}`}>Repeat.</span>
          </h1>

          <p className={styles.sub}>
            Your bright arcade of free online games. Jump in, find your next favorite, and keep the good times rolling.
          </p>

          <div className={styles.searchWrap}>
            <SearchBox variant="desktop" placeholder="Search games, e.g. puzzle, racing…" showKbdHint={false} />
          </div>

          <div className={styles.ctas}>
            <Link href={playHref} className={styles.playCta}>
              <PlayTriangle size={18} color="#fff" />
              Play Now
            </Link>
            <a href={browseHref} className={styles.browseCta}>
              Browse games
              <Icon name="caretDown" size={17} />
            </a>
          </div>

          {chips.length > 0 && (
            <div className={styles.chips}>
              <span className={styles.chipsLabel}>Popular now</span>
              {chips.map((c) => (
                <Link key={c.href} href={c.href} className={styles.chip}>
                  <Icon name={c.icon} weight="fill" size={15} />
                  {c.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.stage} aria-hidden>
          <span className={styles.mascotGlow} />
          <span className={styles.speech}>Good games, brighter days!</span>

          <div className={styles.mascotBox}>
            <BrandImage
              src="/brand/mascot-wave.png"
              className={styles.mascot}
              loading="eager"
              decorative
              fallback={
                <span className={styles.mascotFallback}>
                  <LogoMark size={104} />
                </span>
              }
            />
          </div>

          {/* Floating game bits — parallax factors via nth-child in CSS */}
          <span className={`${styles.bit} ${styles.bitA}`}>
            <Icon name="gamepad" weight="fill" size={26} color="#fff" />
          </span>
          <span className={`${styles.bit} ${styles.bitB}`}>
            <Icon name="star" weight="fill" size={22} color="var(--navy)" />
          </span>
          <span className={`${styles.bit} ${styles.bitC}`}>
            <Icon name="puzzle" weight="fill" size={24} color="#fff" />
          </span>
          <span className={`${styles.bit} ${styles.bitD}`}>
            <Icon name="lightning" weight="fill" size={20} color="var(--navy)" />
          </span>
          <span className={`${styles.spark} ${styles.spark1}`} />
          <span className={`${styles.spark} ${styles.spark2}`} />
          <span className={`${styles.spark} ${styles.spark3}`} />
        </div>
      </div>
    </section>
  );
}
