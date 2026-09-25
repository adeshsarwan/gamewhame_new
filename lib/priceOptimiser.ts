/**
 * Thin, defensive client-side wrapper around the Price Optimiser bundle.
 *
 * Rules this file enforces (from the publisher handoff):
 *  - the publisher NEVER calls googletag directly;
 *  - a rewarded reward is granted ONLY when the SDK reports a rewarded/granted
 *    outcome — never on preload success, show, close, no-fill, error or timeout;
 *  - at most one rewarded workflow can be in flight at a time;
 *  - every call fails safe: if the bundle is blocked, missing or throws, the
 *    product keeps working (the player simply gets no reward).
 */

import { adConfig } from "./adConfig";

/**
 * The live bundle exposes its API on `window.PriceOptimiser`. The exact result
 * shape is owned by the bundle, so we accept `unknown` and normalise it rather
 * than asserting a shape we do not control.
 */
interface PriceOptimiserApi {
  preloadRewarded?: () => unknown;
  showRewarded?: () => unknown;
  preloadSlots?: (ids: string[]) => unknown;
  revealSlots?: (ids: string[]) => unknown;
}

declare global {
  interface Window {
    PriceOptimiser?: PriceOptimiserApi;
  }
}

export type RewardedReason =
  | "granted"
  | "disabled"
  | "unavailable"
  | "in-flight"
  | "dismissed"
  | "no-fill"
  | "error"
  | "timeout";

export interface RewardedOutcome {
  /** Grant the in-product reward if and ONLY if this is true. */
  granted: boolean;
  reason: RewardedReason;
}

function api(): PriceOptimiserApi | null {
  if (typeof window === "undefined") return null;
  return window.PriceOptimiser ?? null;
}

/** True once the Price Optimiser bundle has booted and exposed a rewarded API. */
export function isRewardedAvailable(): boolean {
  const po = api();
  return Boolean(po && typeof po.showRewarded === "function");
}

/**
 * Normalise whatever the bundle resolves with into an explicit grant decision.
 * Anything we cannot positively read as "the user earned the reward" counts as
 * NOT granted. Deliberately conservative — an over-grant is a product bug, an
 * under-grant is only a missed bonus.
 */
function normalise(result: unknown): RewardedOutcome {
  if (result === true) return { granted: true, reason: "granted" };
  if (result === false || result == null) return { granted: false, reason: "dismissed" };

  if (typeof result === "string") {
    const s = result.toLowerCase();
    if (s === "granted" || s === "rewarded" || s === "reward" || s === "complete" || s === "completed") {
      return { granted: true, reason: "granted" };
    }
    if (s.includes("fill")) return { granted: false, reason: "no-fill" };
    if (s.includes("error")) return { granted: false, reason: "error" };
    return { granted: false, reason: "dismissed" };
  }

  if (typeof result === "object") {
    const r = result as Record<string, unknown>;
    const truthy = (v: unknown) => v === true || v === "true";
    if (truthy(r.granted) || truthy(r.rewarded) || truthy(r.reward) || truthy(r.earned)) {
      return { granted: true, reason: "granted" };
    }
    const state = [r.status, r.state, r.outcome, r.type, r.event]
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.toLowerCase());
    if (state.some((s) => s === "granted" || s === "rewarded" || s === "reward" || s === "completed")) {
      return { granted: true, reason: "granted" };
    }
    if (state.some((s) => s.includes("fill"))) return { granted: false, reason: "no-fill" };
    if (state.some((s) => s.includes("error"))) return { granted: false, reason: "error" };
  }

  return { granted: false, reason: "dismissed" };
}

/** Only one rewarded workflow at a time — repeated clicks reuse this promise. */
let inFlight: Promise<RewardedOutcome> | null = null;

async function runRewarded(timeoutMs: number): Promise<RewardedOutcome> {
  const po = api();
  if (!po || typeof po.showRewarded !== "function") {
    return { granted: false, reason: "unavailable" };
  }

  let timer: number | undefined;
  const timeout = new Promise<RewardedOutcome>((resolve) => {
    timer = window.setTimeout(() => resolve({ granted: false, reason: "timeout" }), timeoutMs);
  });

  const workflow = (async (): Promise<RewardedOutcome> => {
    try {
      // Preload success is NOT a reward signal — it only warms the ad.
      await Promise.resolve(po.preloadRewarded?.());
    } catch {
      /* preload failures are non-fatal; showRewarded still decides */
    }
    try {
      return normalise(await Promise.resolve(po.showRewarded!()));
    } catch {
      return { granted: false, reason: "error" };
    }
  })();

  try {
    return await Promise.race([workflow, timeout]);
  } finally {
    if (timer !== undefined) window.clearTimeout(timer);
  }
}

/**
 * Show the rewarded ad and report whether the reward was actually earned.
 * Never throws. Never grants on anything but an explicit rewarded outcome.
 */
export function showRewardedAd(timeoutMs = adConfig.rewarded.timeoutMs): Promise<RewardedOutcome> {
  if (!adConfig.rewarded.enabled) return Promise.resolve({ granted: false, reason: "disabled" });
  if (inFlight) return inFlight.then(() => ({ granted: false, reason: "in-flight" as const }));

  inFlight = runRewarded(timeoutMs).finally(() => {
    inFlight = null;
  });
  return inFlight;
}

/** Slots already preloaded on this page load — a preload is reused, never repeated. */
const preloaded = new Set<string>();

/**
 * Register a managed container that was NOT in the server-rendered HTML.
 *
 * Price Optimiser scans for its destinations when it boots, so a div that
 * mounts later (route-gated, viewport-gated, or revealed from hidden) is
 * invisible to it until we announce it. Verified against the live bundle:
 * `revealSlots()` alone is a no-op for a slot Price Optimiser has not seen —
 * `preloadSlots()` is what registers the destination and defines the GAM slot,
 * and `revealSlots()` then makes it live. Both are the documented
 * preload/reveal lifecycle; neither is `refreshSlots()` / `refreshAll()`,
 * which would be publisher-owned slot management.
 *
 * A container that remounts (SPA navigation) reuses its existing preload and
 * only reveals again, so no duplicate slot is ever defined.
 *
 * The bundle loads `afterInteractive`, so it may not be on the page yet when a
 * container mounts. Waits (bounded) for it, then registers once. Never throws.
 */
export function registerManagedSlots(ids: string[], maxWaitMs = 10000): () => void {
  if (typeof window === "undefined" || !ids.length) return () => {};

  let cancelled = false;
  let timer: number | undefined;
  let raf2: number | undefined;
  const deadline = Date.now() + maxWaitMs;

  const attempt = () => {
    if (cancelled) return;
    const po = api();
    if (po && typeof po.revealSlots === "function") {
      const fresh = ids.filter((id) => !preloaded.has(id));
      try {
        if (fresh.length && typeof po.preloadSlots === "function") {
          po.preloadSlots(fresh);
          fresh.forEach((id) => preloaded.add(id));
        }
      } catch {
        /* the bundle owns this; a failure here must never break the page */
      }
      // Reveal on the next frame so the container is laid out and measurable.
      raf2 = window.requestAnimationFrame(() => {
        if (cancelled) return;
        try {
          po.revealSlots!(ids);
        } catch {
          /* ignore */
        }
      });
      return;
    }
    if (Date.now() >= deadline) return;
    timer = window.setTimeout(attempt, 250);
  };

  const raf = window.requestAnimationFrame(attempt);

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(raf);
    if (raf2 !== undefined) window.cancelAnimationFrame(raf2);
    if (timer !== undefined) window.clearTimeout(timer);
  };
}

/** Warm the rewarded ad ahead of time. Safe to call repeatedly; never throws. */
export function preloadRewardedAd(): void {
  if (!adConfig.rewarded.enabled) return;
  try {
    api()?.preloadRewarded?.();
  } catch {
    /* ignore */
  }
}
