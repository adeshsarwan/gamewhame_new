#!/usr/bin/env node
/**
 * GameWhame Price Optimiser publisher acceptance gate.
 *
 * Statically enforces the publisher contract in
 * `skills/gamewhame-price-optimiser-publisher-handoff.md` so a regression can
 * never reach production silently. Zero dependencies — run with plain node.
 *
 * Run: `npm run check:ads`
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

const PO_SCRIPT = "https://priceoptimiser1.thebesads.com/experiences/gamewhame.js";
const SITE_KEY = "gamewhame.com";
const MANAGED_IDS = ["ad-leaderboard", "ad-incontent", "ad-results", "ad-anchor"];

/** Components allowed to mark a link as an interstitial opportunity. */
const INTERSTITIAL_ALLOWED = ["components/GameCard.tsx", "components/RelatedList.tsx", "components/useInterstitialLink.ts"];

/** The one place the Price Optimiser <script> may be declared. */
const SCRIPT_OWNERS = ["lib/adConfig.ts", "app/layout.tsx"];

/** The one component allowed to render the sticky anchor container. */
const ANCHOR_OWNERS = ["components/AnchorAd.tsx", "lib/adConfig.ts", "scripts/check-ads.mjs"];

const failures = [];
const files = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === ".next") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (EXTS.has(extname(name))) files.push(full);
  }
}
ROOTS.forEach(walk);

/** Strip block + line comments so prose about a rule never trips the rule. */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
}

const sources = files.map((f) => {
  const text = readFileSync(f, "utf8");
  return { path: relative(process.cwd(), f), text, code: stripComments(text) };
});
const find = (re) => sources.filter((s) => re.test(s.text));
const findCode = (re) => sources.filter((s) => re.test(s.code));
const fail = (rule, detail) => failures.push(`${rule}: ${detail}`);

/* 1. Exactly one Price Optimiser script, at application level, with the id that
      makes Next dedupe it (one bootstrap across SPA navigation). */
{
  const urlHits = sources.filter((s) => s.text.includes(PO_SCRIPT));
  const unexpected = urlHits.filter((s) => !SCRIPT_OWNERS.includes(s.path));
  if (urlHits.length === 0) fail("script", "the Price Optimiser bundle URL is not referenced anywhere");
  if (unexpected.length) fail("script", `bundle URL referenced outside ${SCRIPT_OWNERS.join(" / ")}: ${unexpected.map((s) => s.path).join(", ")}`);

  const layout = sources.find((s) => s.path === "app/layout.tsx");
  if (!layout) fail("script", "app/layout.tsx not found");
  else {
    const tags = layout.text.match(/<Script\b/g) ?? [];
    if (tags.length !== 1) fail("script", `app/layout.tsx renders ${tags.length} <Script> tags, expected exactly 1`);
    if (!/id=\{PO_SCRIPT_ID\}|id="gamewhame-price-optimiser"/.test(layout.text)) {
      fail("script", "the Price Optimiser <Script> has no stable id — Next cannot dedupe it across SPA navigation");
    }
    if (!/strategy="afterInteractive"/.test(layout.text)) fail("script", 'the Price Optimiser <Script> must use strategy="afterInteractive"');
  }
}

/* 2. Price Optimiser owns the GPT/GAM lifecycle — no publisher googletag. */
{
  const gpt = findCode(/\bgoogletag\s*\./);
  if (gpt.length) fail("gpt-owner", `publisher googletag usage found in: ${gpt.map((s) => s.path).join(", ")}`);
  const gam = findCode(/\/23360556473\//);
  if (gam.length) fail("gpt-owner", `GAM ad unit paths must not be hardcoded in frontend code: ${gam.map((s) => s.path).join(", ")}`);
  const otherGpt = findCode(/securepubads\.g\.doubleclick\.net\/tag\/js\/gpt\.js/);
  if (otherGpt.length) fail("gpt-owner", `a second GPT owner is being loaded in: ${otherGpt.map((s) => s.path).join(", ")}`);
}

/* 3. Managed DOM ids: never duplicated within a module, anchor mounted once. */
{
  for (const id of MANAGED_IDS) {
    const re = new RegExp(`(["'\`])${id}\\1`, "g");
    for (const s of sources) {
      const hits = s.text.match(re) ?? [];
      if (hits.length > 1 && s.path !== "lib/adConfig.ts" && s.path !== "scripts/check-ads.mjs") {
        fail("duplicate-id", `"${id}" appears ${hits.length} times in ${s.path}`);
      }
    }
  }

  const anchorRenderers = sources.filter((s) => /MANAGED_SLOT_IDS\.anchor|["'`]ad-anchor["'`]/.test(s.text) && !ANCHOR_OWNERS.includes(s.path));
  if (anchorRenderers.length) fail("anchor", `#ad-anchor may only be rendered by AnchorAd: also found in ${anchorRenderers.map((s) => s.path).join(", ")}`);

  const layout = sources.find((s) => s.path === "app/layout.tsx");
  const anchorMounts = (layout?.text.match(/<AnchorAd\b/g) ?? []).length;
  if (anchorMounts !== 1) fail("anchor", `app/layout.tsx mounts <AnchorAd /> ${anchorMounts} times, expected exactly 1`);

  // ad-results must not be rendered while it is disabled in config.
  const cfg = sources.find((s) => s.path === "lib/adConfig.ts")?.text ?? "";
  const resultsEnabled = /results:\s*\{\s*enabled:\s*true/.test(cfg);
  const resultsRendered = sources.some((s) => /MANAGED_SLOT_IDS\.results/.test(s.text));
  if (resultsRendered && !resultsEnabled) fail("ad-results", "#ad-results is rendered but adConfig.results.enabled is false (no real results UX)");
}

/* 4. Interstitial: attribute only on approved game-tile links, and no publisher
      code may intercept the click (that would create a competing workflow). */
{
  const marked = findCode(/data-google-interstitial/);
  const bad = marked.filter((s) => !INTERSTITIAL_ALLOWED.includes(s.path));
  if (bad.length) fail("interstitial", `data-google-interstitial used outside approved game-tile links: ${bad.map((s) => s.path).join(", ")}`);

  for (const s of marked) {
    if (/preventDefault\(\)/.test(s.text)) {
      fail("interstitial", `${s.path} marks an interstitial link AND calls preventDefault() — that is a competing workflow`);
    }
  }
  const gate = sources.find((s) => /InterstitialGate/.test(s.code));
  if (gate) fail("interstitial", `a publisher-owned interstitial gate still exists (${gate.path}); Price Optimiser owns the interstitial`);
}

/* 5. Rewarded: granted only on an explicit rewarded outcome. */
{
  const wrapper = sources.find((s) => s.path === "lib/priceOptimiser.ts");
  if (!wrapper) fail("rewarded", "lib/priceOptimiser.ts is missing");
  else if (!/outcome\.granted|\.granted\b/.test(wrapper.text)) fail("rewarded", "the rewarded wrapper does not express an explicit grant decision");

  const panel = sources.find((s) => s.path === "components/RewardedContinue.tsx");
  if (panel) {
    if (!/outcome\.granted/.test(panel.text)) fail("rewarded", "RewardedContinue does not gate onComplete on outcome.granted");
    if (/setInterval|setTimeout\(onComplete/.test(panel.text)) fail("rewarded", "RewardedContinue still grants on a timer instead of an SDK outcome");
  }
}

/* 6. Outstream is disabled platform-side and must never be implemented. */
{
  const outstream = findCode(/outstream/i).filter((s) => s.path !== "lib/adConfig.ts");
  if (outstream.length) fail("outstream", `Outstream references found (must not be implemented): ${outstream.map((s) => s.path).join(", ")}`);
}

/* 7. Telemetry identity: gamewhame.com only — never another site's identity. */
{
  const foreign = findCode(/jobguidematch|jobsthe/i);
  if (foreign.length) fail("telemetry", `foreign Price Optimiser identity referenced in: ${foreign.map((s) => s.path).join(", ")}`);
  const www = findCode(/www\.gamewhame\.com/);
  if (www.length) fail("telemetry", `www.gamewhame.com is not a production origin: ${www.map((s) => s.path).join(", ")}`);
  const cfg = sources.find((s) => s.path === "lib/adConfig.ts")?.text ?? "";
  if (!cfg.includes(`"${SITE_KEY}"`)) fail("telemetry", `lib/adConfig.ts does not pin the canonical site key "${SITE_KEY}"`);
}

if (failures.length) {
  console.error(`\nPrice Optimiser acceptance FAILED (${failures.length}):\n`);
  failures.forEach((f) => console.error(`  - ${f}`));
  console.error("");
  process.exit(1);
}
console.log(`Price Optimiser acceptance OK — ${sources.length} source files checked.`);
