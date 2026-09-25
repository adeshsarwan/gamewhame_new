"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adConfig } from "@/lib/adConfig";

/**
 * Props to spread onto a game tile's anchor so it becomes an approved Google
 * web-interstitial opportunity.
 *
 * Two things matter here:
 *
 * 1. `data-google-interstitial="true"` is the ONLY interstitial wiring the
 *    publisher does. We never call googletag, never define a slot and never
 *    refresh — Price Optimiser owns when an opportunity actually fires.
 *
 * 2. One user action must produce at most one interstitial workflow. We never
 *    intercept the click (that would create a competing workflow); instead the
 *    tile stops accepting pointer events for a moment after the first click, so
 *    a double tap can never open a second workflow or a second navigation.
 */
export function useInterstitialLink(enabled = true) {
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = useCallback(() => {
    // Deliberately no preventDefault / stopPropagation: the click must reach
    // Price Optimiser and Next's router untouched.
    setBusy(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBusy(false), adConfig.interstitial.clickGuardMs);
  }, []);

  if (!enabled || !adConfig.interstitial.enabled) return {};

  return {
    "data-google-interstitial": "true",
    "data-po-busy": busy ? "true" : undefined,
    onClick,
  } as const;
}
