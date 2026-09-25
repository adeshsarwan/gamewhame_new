"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { adConfig, MANAGED_SLOT_IDS } from "@/lib/adConfig";
import { registerManagedSlots } from "@/lib/priceOptimiser";
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
 * googletag call and no refresh here.
 *
 * Because this container is route- and viewport-gated it is NOT in the
 * server-rendered HTML, so it does not exist when Price Optimiser boots and
 * scans for its destinations. Once mounted we announce it through the
 * documented reveal lifecycle; without that the anchor is never requested and
 * can never fill (verified live).
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

  const excluded = adConfig.anchor.excludeRoutePrefixes.some((p) => pathname?.startsWith(p));
  const visible = adConfig.anchor.enabled && wideEnough && !excluded;

  useEffect(() => {
    if (!visible) return;
    return registerManagedSlots([MANAGED_SLOT_IDS.anchor]);
  }, [visible, pathname]);

  if (!visible) return null;

  return (
    <div className={styles.anchor} aria-label="Advertisement">
      <div id={MANAGED_SLOT_IDS.anchor} className={styles.inner} />
    </div>
  );
}
