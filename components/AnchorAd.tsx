"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { adConfig, MANAGED_SLOT_IDS } from "@/lib/adConfig";
import styles from "./AnchorAd.module.css";

/**
 * AnchorAd — the site's ONE sticky Price Optimiser anchor container.
 *
 * Mounted a single time from the root layout, so `#ad-anchor` can never appear
 * twice in the DOM. It renders nothing (rather than hiding itself) when the
 * anchor does not belong on the current route or viewport, so Price Optimiser
 * never owns a slot the user cannot see:
 *
 *  - never on /play/* — a sticky bar over the game frame is the single worst
 *    thing we could do to time-on-site, our P1 metric;
 *  - phones are opt-in (`adConfig.anchor.mobile`) because the GameWhame bottom
 *    nav already occupies that strip.
 *
 * The publisher supplies only the container and its geometry (320x50 mobile /
 * 728x90 desktop). Price Optimiser owns the slot lifecycle — there is no
 * googletag call, no refresh and no reveal call here.
 */
export default function AnchorAd() {
  const pathname = usePathname();
  const [wideEnough, setWideEnough] = useState(false);

  useEffect(() => {
    if (adConfig.anchor.mobile) {
      setWideEnough(true);
      return;
    }
    const mq = window.matchMedia(`(min-width: ${adConfig.anchor.minWidth}px)`);
    const sync = () => setWideEnough(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!adConfig.anchor.enabled || !wideEnough) return null;
  if (adConfig.anchor.excludeRoutePrefixes.some((p) => pathname?.startsWith(p))) return null;

  return (
    <div className={styles.anchor} aria-label="Advertisement">
      <div id={MANAGED_SLOT_IDS.anchor} className={styles.inner} />
    </div>
  );
}
