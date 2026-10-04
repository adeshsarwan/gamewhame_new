---
name: gamewhame-price-optimiser
description: Diagnose and fix website-level Price Optimiser integration in the gamewhame.com publisher frontend. Trace each blank placement from DOM through PO and GPT to its GAM response before editing. Excludes in-game ads, PO infrastructure, and GAM administration.
---

# GameWhame: publisher integration and missing-ad diagnosis

(Partner-supplied, received 2026-10-04. Replaces the September 30 publisher implementation checklist.)

Use this as the replacement for the September 30 publisher implementation checklist. It is a diagnostic and ownership handoff, not a promise that frontend changes will produce filled ads.

## Task and ownership

Find why the requested GameWhame WEBSITE placements are not visibly showing ads. First capture the current behavior. Make publisher code changes only for demonstrated publisher failures within the user's authorized task. Do not repeat already completed layout work.

Publisher repository: https://github.com/adeshsarwan/gamewhame_new

Publisher owns DOM, responsive layout, script inclusion, client navigation, and eligible game-tile links. Price Optimiser owns GPT initialization, slot definition, requests, pricing, experiments, retries, refresh, out-of-page formats and telemetry. GAM/demand determines delivery eligibility and auction outcome.

Do not edit Price Optimiser services, bundles, databases, snapshots, Cloudflare configuration, GAM units, targeting, protections, floors or experiments. Do not modify Unity/H5 in-game ads, game postMessage protocols, in-game rewarded flow or in-game interstitial timing. Do not add a second advertising SDK or publisher-owned GPT calls. Deploy publisher changes only if the user has authorized deployment.

## Deployment is already confirmed

The owner supplied Cloudflare screenshots on October 2, 2026 showing:

- Publisher Worker: gamewhame-new, Production.
- Connected repository: adeshsarwan/gamewhame_new; production branch: main.
- Deploy command: npm run deploy; root directory: /.
- Active Worker version prefix: 95dcf786, receiving 100% traffic.
- Deployment description: "Website ads: implement final publisher handoff inventory".
- The owner reports that ads still do not appear after this deployment.

Treat the previous handoff as IMPLEMENTED AND DEPLOYED, with the missing-ad problem unresolved. Do not ask the publisher to repeat that layout checklist or deploy it again as the proposed fix. The displayed Worker version is not a Git commit SHA. Exact commit correlation can be recorded for reproducibility, but lack of deployment is not the leading explanation supported by this evidence.

Next investigate actual behavior on this deployed build: whether each eligible placement requests GAM, whether the response is empty, or whether a filled creative is hidden/clipped. If valid requests return empty, the operator must investigate delivery rather than redirecting the publisher to another speculative frontend rewrite.

## Facts checked on October 2, 2026

Production PO bundle returned HTTP 200:

https://priceoptimiser1.thebesads.com/experiences/gamewhame.js

SHA-256: 4e36b7a56b0f3fadab4702ab3b174aaa96f740bc8d6b8be7c3a782b48f1210d6.

Runtime returned site gamewhame.com (site ID 51), all eight enabled mappings below, no active experiment, and null effective floors:

https://priceoptimiser1.thebesads.com/v1/runtime-config?site=gamewhame.com

| DOM ID / API slot key | Format | GAM path |
| --- | --- | --- |
| ad-leaderboard | Native/fluid | /23360556473/gamewhame.com_Native |
| ad-incontent | Native/fluid | /23360556473/gamewhame.com_Native |
| ad-incontent-2 | Native/fluid | /23360556473/gamewhame.com_Native |
| ad-incontent-3 | Native/fluid | /23360556473/gamewhame.com_Native |
| ad-results | Native/fluid | /23360556473/gamewhame.com_Native |
| ad-anchor | Anchor, 320x50 / 728x90 | /23360556473/gamewhame.com_Anchor |
| interstitial | Standard web interstitial, no publisher div | /23360556473/gamewhame.com_Interstitial |
| rewarded | Rewarded, no publisher div | /23360556473/gamewhame.com_Rewarded |

The live server-rendered HTML already included:

- /: leaderboard and all three in-content IDs.
- /games/puzzle: leaderboard and all three in-content IDs.
- /play/dot-connect-mania: leaderboard, in-content and in-content-2.
- Canonical script reference and interstitial opt-in links on all three pages.

This is HTML evidence, not a fresh browser request/fill capture. Anchor is mounted client-side; absence in raw HTML alone does not prove it is missing.

Publisher source inspected at commit 657670c1dbda28f34bac3874567cb58123b79dd9 already includes the extra IDs, Home/Category leaderboards, removal of decorative Reveal wrappers around managed ads, and excludeRoutePrefixes: [] for Anchor. Anchor still has mobile:false and minimum width 768. The former mobile Play rules hiding both ad wrappers are no longer present. Verify the currently deployed behavior; do not state that those old restrictions are still the cause.

The September 30 browser audit observed existing Native/Anchor requests ending empty. That historical result does not establish today's cause. Neither a blank box nor isEmpty:true proves genuine no bids; demand, eligibility, protection, policy and pricing constraints require GAM evidence.

## Do not repeat these mistaken fixes

- There is no known global rename issue. window.PriceOptimiser and window.PriceOptimiserExperience reference the same GameWhame API in the audited production bundle. Keep the current wrapper unless new evidence contradicts this.
- Leaderboard is intentionally Native/fluid. Do not convert its GAM size to numeric banner sizes because the layout reserves 728x90-like space.
- The new in-content mappings already exist. Do not request new GAM units or duplicate existing IDs.
- Native is visibility-first with a 300px loading margin. An off-screen placement need not request immediately.
- Do not preload or refresh every AdSlot to force demand. Do not keep retrying an empty slot in React effects or timers.
- opacity:0 Reveal was not a proven request blocker. If present, assess actual visibility separately from discovery.
- A collapsed PO slot may have zero geometry BECAUSE it returned empty. Do not automatically call that pre-request CSS failure.

## Required diagnostic procedure before editing

1. Inspect the actual deployed page and current publisher source; distinguish those two sources. Record URL, UTC time, viewport, browser, direct load versus client navigation, and relevant consent/blocker state. Do not bypass consent or browser privacy settings.
2. Start with / on desktop. Confirm each ID occurs once. Record computed visibility through ancestors and actual dimensions before eligibility/request, where possible.
3. Confirm one canonical script and API readiness. Inspect po.status() and existing GPT slots read-only.
4. Normally scroll toward lower placements once. Observe whether PO registers/defines/requests when within its margin. Do not call refresh/preload merely to manufacture diagnostic requests.
5. Inspect the actual gampad/ads request and its mapped path/slot, then PO/GPT render result. Use DevTools Network with Preserve log if necessary. Capture slotRenderEnded.isEmpty for future events without triggering requests, or record the existing PO empty/filled state with that evidentiary limitation.
6. Repeat a representative Category and Play route, including mobile Play, and one real client navigation. Do not assume a clicked link performed SPA navigation: check whether the document actually reloaded.
7. For a missing request, identify the first failed transition. For a filled-but-invisible slot, inspect creative/container clipping, ancestor opacity, overlap and collapse behavior. For a request ending empty, preserve the request evidence and route delivery diagnosis to the operator.

### Optional read-only browser-console capture

Run after page load, then after normal scrolling. This does not define slots, request ads, refresh, or change DOM. It reads parent-page resource timing; it does not inspect game iframe advertising.

```js
(async () => {
  const ids = ["ad-leaderboard", "ad-incontent", "ad-incontent-2",
    "ad-incontent-3", "ad-anchor", "ad-results"];
  const po = window.PriceOptimiser;
  const slots = window.googletag?.apiReady
    ? window.googletag.pubads().getSlots() : [];
  let status = null;
  try { status = po?.status ? await po.status() : null; }
  catch (error) { status = { error: String(error) }; }
  const dom = ids.map(id => {
    const nodes = document.querySelectorAll(`[id="${id}"]`);
    const e = nodes[0];
    if (!e) return { id, count: 0 };
    const r = e.getBoundingClientRect();
    const hiddenAncestors = [];
    for (let n = e; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (n.hidden || s.display === "none" || s.visibility !== "visible" || Number(s.opacity) === 0)
        hiddenAncestors.push({ tag: n.tagName, id: n.id,
          hidden: n.hidden, display: s.display, visibility: s.visibility, opacity: s.opacity });
    }
    return { id, count: nodes.length,
      rect: { top: r.top, width: r.width, height: r.height }, hiddenAncestors,
      po: Object.fromEntries(Object.entries(e.dataset).filter(([k]) => k.startsWith("po"))) };
  });
  const requests = performance.getEntriesByType("resource")
    .filter(e => e.name.includes("/gampad/ads"))
    .map(e => {
      const p = new URL(e.name).searchParams;
      return { startMs: e.startTime,
        ...Object.fromEntries(["iu", "iu_parts", "enc_prev_ius", "dids", "sz", "prev_iu_szs", "fluid"]
          .map(k => [k, p.get(k)])) };
    });
  console.log(JSON.stringify({ utc: new Date().toISOString(), path: location.pathname,
    viewport: { width: innerWidth, height: innerHeight },
    scripts: [...document.scripts].map(s => s.src)
      .filter(src => /priceoptimiser|publisher-sdk|gpt\.js/.test(src)).map(src => src.split("?")[0]),
    api: { present: !!po, sameAlias: !!po && po === window.PriceOptimiserExperience,
      methods: po ? Object.keys(po).filter(k => typeof po[k] === "function") : [] },
    poSlots: status?.slots ?? null, statusError: status?.error ?? null, dom,
    gpt: slots.map(s => ({ id: s.getSlotElementId(), path: s.getAdUnitPath(),
      sizes: s.getSizes().map(size => String(size)) })), requests }, null, 2));
})();
```

Resource timing can be cleared or incomplete. No entry in this capture alone is not proof of no request; confirm with Network. Fluid encoding in the network URL need not look identical to GPT getSizes(); do not diagnose a size mismatch from that difference alone. Redact unrelated query strings, cookies, identifiers and personal data before sharing captures; do not send an unredacted HAR by default.

## Classification and smallest action

| Evidence | Classification | Responsible next step |
| --- | --- | --- |
| Intended container absent/duplicated or publisher-hidden before request | Publisher frontend | Fix that specific markup/layout defect |
| Bundle missing/blocked/duplicated, wrong load timing or proven wrapper exception | Publisher frontend or concrete delivery blocker | Fix demonstrated loader/CSP issue without adding GPT ownership |
| Container exists, runtime maps it, eligible, but no PO/GPT slot | PO discovery or publisher route lifecycle; not yet resolved | Compare direct load/client mount and explicit lifecycle, retain evidence |
| Correct GPT slot and GAM request, empty response | GAM/PO delivery investigation | No speculative publisher change; operator checks eligible demand and constraints |
| Filled response, creative invisible/clipped | Publisher layout or creative rendering | Inspect geometry/ancestor styles and creative before changing dimensions |
| No inspectable request/result | Unproven | Collect missing evidence; do not label it no-fill or no-bid |

A publisher integration can pass while the monetization issue remains unresolved. Never report "ads fixed" when the only proof is script HTTP 200, slots registered, or empty responses.

## Correct GameWhame integration contract

Load once globally through the existing framework loader:

```html
<script async src="https://priceoptimiser1.thebesads.com/experiences/gamewhame.js"></script>
```

Reuse lib/priceOptimiser.ts, lib/adConfig.ts, components/AdSlot.tsx, components/AnchorAd.tsx, and the existing global layout. Do not add a parallel wrapper. Calls must wait for script availability; PO public methods await internal initialization. Avoid unbounded readiness polling.

Initial SSR slots use automatic discovery. For intentionally dynamic containers use the current explicit API with non-empty DOM-ID arrays after mounting:

```js
const po = window.PriceOptimiser;
await po.init();
// Optional intentional preload; the real destination div must exist.
await po.preloadSlots(["ad-incontent-2"]);
// After the publisher makes that SAME div visible and layout settles:
await new Promise(resolve => requestAnimationFrame(resolve));
await po.revealSlots(["ad-incontent-2"]);
```

Preload can intentionally request while hidden under this real-div preload contract. It is not a mandatory fix for every initial placement. A visible new mapped container can be resolved by revealSlots() through the current bootstrap; do not rely on the old wrapper comment claiming reveal can never register a placement. Preserve existing wrapper behavior unless a failure is reproduced.

Keep initialized ad DOM nodes stable across navigation. The current runtime identifies display ownership by DOM ID; replacing a node with another node of the same ID is not proven to transfer GPT ownership. Do not promise arbitrary same-ID remount support. Test that lifecycle and report an operator limitation if necessary, without adding manual GPT destruction. Do not call global destroy/init on every route.

refreshSlots(["ad-incontent"]) exists for a deliberate refresh opportunity only. Do not use refreshAll(), empty refresh lists, generic native tokens, or refresh-on-no-fill loops. Guard effects to one intended opportunity; repeated reveal of an empty slot may request again.

Layout uses unique IDs and Native/fluid inventory. Banner-like reserved space is not a numeric GAM-size requirement. Verify overflow:hidden and height constraints if a filled creative is clipped. Do not blanket-remove styles merely because an empty slot collapses. Keep mobile Play Anchor off under the existing approved layout, and keep all website ads outside the game and its controls.

## GameWhame interstitial behavior — different from PlayLoft

Do NOT copy PlayLoft's API keys or its automatic-initialization assumptions.

GameWhame's entrypoint already requests the existing standard web interstitial after initialization and installs a link eligibility policy. Intended game-navigation anchors use:

```html
<a href="/play/dot-connect-mania" data-google-interstitial="true">Play</a>
```

Unmarked links are excluded by the site policy. Preserve the existing game-tile marker and normal navigation; do not attach another showInterstitial() request to every tile click. true is an eligibility convention, not a force-show command. GPT still controls actual presentation and frequency.

The public method is po.showInterstitial("interstitial"), not PlayLoft's "ad-interstitial". Use it only for a separately intended opportunity, not duplicate initial/tile requests. filled is not a shown/closed event. Do not await a fake modal-close promise or block navigation on no-fill.

## Rewarded boundary

Website API names are po.preloadRewarded("rewarded") and po.showRewarded("rewarded", { usePreload: true }) — not PlayLoft's "ad-rewarded".

The supported show callbacks are onReady, onGranted, onVideoCompleted, onClosed, and onFallback. Grant a website reward once, only on onGranted or returned status granted; do not grant on preload/ready/fill/close. Preserve existing approved reward wiring. This handoff does not authorize changes to game-provider/Unity/H5 rewarded integration or new reward UX.

## Required return report to the owner

Return this table for each tested route and viewport:

| UTC / route / viewport | Placement | DOM count / visible? | PO registered? | GPT path / sizes | GAM request? | Filled / empty / unknown | First failed layer | Owner / next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Include:

- Current publisher commit/build actually tested; separate repository findings from deployed evidence.
- Direct-load versus true client-navigation results, including actual affected IDs.
- Exact publisher changes and relevant checks, or "No publisher defect demonstrated; no changes made."
- For empty requests: UTC timestamp, page path, ad-unit path, DOM ID, effective sizes, country if known, device, and observed consent/blocking signals. Do not infer country from timezone.
- Concise console/network evidence supporting the classification.
- Two separate statuses: PUBLISHER INTEGRATION: PASS / FAIL / UNPROVEN and GAM DELIVERY: FILLED / EMPTY / UNPROVEN.

When requests are valid but empty, report "GAM/Price Optimiser operator investigation required". Operator should check demand eligibility, targeting, protections, pricing constraints, consent/policy and format compatibility for that exact request. Do not claim genuine zero demand until delivery evidence supports it. Do not send the publisher back through the same placement checklist without identifying a new failed layer.
