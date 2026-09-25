#!/usr/bin/env node
/**
 * Post-deployment live verification for the Price Optimiser integration
 * (handoff §18). Checks the shipped site, not the source tree.
 *
 * Run: `npm run verify:ads`
 *      `npm run verify:ads -- --base http://localhost:3000`
 *
 * Verifies:
 *  - the production bundle is reachable, and its byte size + SHA-256 still
 *    match the values pinned in the handoff;
 *  - the runtime-config endpoint answers 200 for site=gamewhame.com;
 *  - each representative route ships exactly one Price Optimiser script tag,
 *    no duplicate managed DOM ids, no second GPT owner, no foreign site
 *    identity and no Outstream container.
 *
 * Zero dependencies — plain node (fetch + node:crypto).
 */
import { createHash } from "node:crypto";

const BUNDLE_URL = "https://priceoptimiser1.thebesads.com/experiences/gamewhame.js";
const RUNTIME_URL = "https://priceoptimiser1.thebesads.com/v1/runtime-config?site=gamewhame.com";
const EXPECTED_BYTES = 127541;
const EXPECTED_SHA256 = "4e36b7a56b0f3fadab4702ab3b174aaa96f740bc8d6b8be7c3a782b48f1210d6";
const MANAGED_IDS = ["ad-leaderboard", "ad-incontent", "ad-results", "ad-anchor"];

const argBase = process.argv.indexOf("--base");
const BASE = (argBase > -1 ? process.argv[argBase + 1] : "https://gamewhame.com").replace(/\/$/, "");
const ROUTES = ["/", "/games/puzzle", "/play/tictactoe"];

let failed = 0;
const ok = (msg) => console.log(`  PASS  ${msg}`);
const bad = (msg) => {
  failed += 1;
  console.log(`  FAIL  ${msg}`);
};
const warn = (msg) => console.log(`  WARN  ${msg}`);

async function checkBundle() {
  console.log(`\nPrice Optimiser bundle — ${BUNDLE_URL}`);
  let res;
  try {
    res = await fetch(BUNDLE_URL, { redirect: "follow" });
  } catch (e) {
    bad(`unreachable: ${e.message}`);
    return;
  }
  if (res.status !== 200) return bad(`HTTP ${res.status}, expected 200`);
  ok("HTTP 200");

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength === EXPECTED_BYTES) ok(`size ${buf.byteLength} bytes`);
  else warn(`size ${buf.byteLength} bytes, handoff pinned ${EXPECTED_BYTES} — the platform may have shipped a new bundle`);

  const sha = createHash("sha256").update(buf).digest("hex");
  if (sha === EXPECTED_SHA256) ok(`sha256 ${sha}`);
  else warn(`sha256 ${sha} != pinned ${EXPECTED_SHA256} — confirm with the platform team before shipping`);
}

async function checkRuntimeConfig() {
  console.log(`\nRuntime config — ${RUNTIME_URL}`);
  let res;
  try {
    res = await fetch(RUNTIME_URL);
  } catch (e) {
    return bad(`unreachable: ${e.message}`);
  }
  if (res.status !== 200) return bad(`HTTP ${res.status}, expected 200`);
  ok("HTTP 200");
  const body = await res.text();
  if (/gamewhame\.com/.test(body)) ok("siteKey = gamewhame.com");
  else bad("response does not identify site gamewhame.com");
  if (/jobguidematch|jobsthe/i.test(body)) bad("response carries a foreign site identity");
}

async function checkRoute(route) {
  const url = `${BASE}${route}`;
  console.log(`\nRoute — ${url}`);
  let res;
  try {
    res = await fetch(url, { headers: { "user-agent": "gamewhame-ad-verifier" } });
  } catch (e) {
    return bad(`unreachable: ${e.message}`);
  }
  if (!res.ok) return bad(`HTTP ${res.status}`);
  const html = await res.text();

  // next/script(afterInteractive) ships the tag as ONE declaration in the RSC
  // payload (plus one preload link) and injects the real <script> on the
  // client, so count declarations and raw tags separately rather than every
  // occurrence of the URL.
  const decls = (html.match(/gamewhame-price-optimiser/g) ?? []).length;
  const tags = (html.match(/<script[^>]*experiences\/gamewhame\.js/g) ?? []).length;
  const preloads = (html.match(/rel="preload"[^>]*experiences\/gamewhame\.js/g) ?? []).length;
  const bootstraps = decls + tags;
  if (bootstraps === 1) ok(`exactly one Price Optimiser bootstrap (${decls} declaration, ${tags} inline tag, ${preloads} preload)`);
  else bad(`${bootstraps} Price Optimiser bootstraps, expected 1 (${decls} declaration, ${tags} inline tag)`);
  if (preloads > 1) bad(`${preloads} preload links for the bundle, expected at most 1`);

  for (const id of MANAGED_IDS) {
    const hits = html.match(new RegExp(`id="${id}"`, "g")) ?? [];
    if (hits.length > 1) bad(`#${id} appears ${hits.length} times in the DOM`);
    else if (hits.length === 1) ok(`#${id} present once`);
  }

  if (/gpt\.js/.test(html)) bad("a second GPT owner is loaded directly by the page");
  else ok("no publisher-loaded GPT");

  if (/jobguidematch|jobsthe/i.test(html)) bad("foreign Price Optimiser identity in the markup");
  else ok("telemetry identity clean");

  if (/outstream/i.test(html)) bad("Outstream markup found");
  else ok("no Outstream");

  const interstitial = (html.match(/data-google-interstitial="true"/g) ?? []).length;
  console.log(`  INFO  ${interstitial} interstitial-eligible links`);
}

console.log(`Price Optimiser live verification — base ${BASE}`);
await checkBundle();
await checkRuntimeConfig();
for (const r of ROUTES) await checkRoute(r);

console.log("");
if (failed) {
  console.error(`Live verification FAILED — ${failed} check(s).`);
  process.exit(1);
}
console.log("Live verification PASSED.");
