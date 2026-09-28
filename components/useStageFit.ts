"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Sizes the player stage so it (and the banner beneath it) always fit the
 * viewport on desktop — the player is never pushed off-screen, whatever the
 * window height. It measures the stage's real distance from the top of the page
 * (header + breadcrumb + chips + chrome bar, which is fixed content above it)
 * and sets `--maxh` to whatever height is left, minus a reserve for the banner.
 *
 * Only runs on desktop/tablet (>=768px). On mobile the CSS fills the screen, and
 * in fullscreen the CSS takes over — in both cases the inline value is cleared so
 * it never fights the stylesheet.
 */
export function useStageFit(ref: RefObject<HTMLElement>, reserveBelow = 116) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    const apply = () => {
      // Mobile CSS fill / native fullscreen own the height — don't override them.
      if (isMobile() || document.fullscreenElement) {
        el.style.removeProperty("--maxh");
        return;
      }
      // Distance from the document top to the stage top = the fixed chrome above
      // it. getBoundingClientRect().top + scrollY is that offset at any scroll.
      const top = el.getBoundingClientRect().top + window.scrollY;
      const avail = window.innerHeight - top - reserveBelow;
      // Never smaller than a usable floor; on a very short window the game area
      // shrinks rather than the player overflowing.
      const maxh = Math.max(300, Math.round(avail));
      el.style.setProperty("--maxh", `${maxh}px`);
    };

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("resize", schedule);
    document.addEventListener("fullscreenchange", schedule);
    // Web-font load can nudge the breadcrumb/chip height — re-measure once ready.
    if (document.fonts?.ready) document.fonts.ready.then(apply).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("fullscreenchange", schedule);
      el.style.removeProperty("--maxh");
    };
  }, [ref, reserveBelow]);
}
