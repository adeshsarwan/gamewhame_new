/* GameWhame Google Ad Manager integration
 * Website-level units only. Construct game-level ads remain separate.
 */
(function () {
  'use strict';

  const NETWORK_CODE = '23360556473';
  const UNIT = {
    native: `/${NETWORK_CODE}/gamewhame.com_Native`,
    interstitial: `/${NETWORK_CODE}/gamewhame.com_Interstitial`,
    rewarded: `/${NETWORK_CODE}/gamewhame.com_Rewarded`,
    anchor: `/${NETWORK_CODE}/gamewhame.com_Anchor`
  };

  window.googletag = window.googletag || { cmd: [] };
  window.GameWhameAds = window.GameWhameAds || {};
  window.GameWhameAds.config = { networkCode: NETWORK_CODE, units: UNIT };

  // Load GPT once.
  if (!document.querySelector('script[data-gamewhame-gpt]')) {
    const gpt = document.createElement('script');
    gpt.async = true;
    gpt.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
    gpt.dataset.gamewhameGpt = '1';
    document.head.appendChild(gpt);
  }

  const slotIds = [];
  let rewardedSlot = null;
  let rewardedReady = false;
  let rewardedGranted = false;
  let rewardedRequest = null;

  function defineInPageSlots() {
    const nodes = document.querySelectorAll('[data-gam-native]');
    if (!nodes.length) return;

    const responsive = googletag.sizeMapping()
      .addSize([1024, 0], [[970, 250], [970, 90], [728, 90], [336, 280], [300, 250], 'fluid'])
      .addSize([768, 0], [[728, 90], [336, 280], [300, 250], 'fluid'])
      .addSize([0, 0], [[336, 280], [320, 100], [320, 50], [300, 250], 'fluid'])
      .build();

    const rail = googletag.sizeMapping()
      .addSize([1000, 0], [[300, 600], [300, 250], 'fluid'])
      .addSize([0, 0], [[300, 250], 'fluid'])
      .build();

    nodes.forEach((node, i) => {
      if (!node.id) node.id = `gw-gam-native-${i + 1}`;
      const isRail = node.dataset.gamNative === 'rail';
      const sizes = isRail
        ? [[300, 600], [300, 250], 'fluid']
        : [[970, 250], [970, 90], [728, 90], [336, 280], [320, 100], [320, 50], [300, 250], 'fluid'];

      const slot = googletag.defineSlot(UNIT.native, sizes, node.id);
      if (!slot) return;
      slot.defineSizeMapping(isRail ? rail : responsive);
      slot.addService(googletag.pubads());
      slotIds.push(node.id);
    });
  }

  function defineAnchor() {
    const slot = googletag.defineOutOfPageSlot(
      UNIT.anchor,
      googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
    );
    if (slot) {
      slot.addService(googletag.pubads());
      googletag.display(slot);
    }
  }

  function defineInterstitial() {
    const slot = googletag.defineOutOfPageSlot(
      UNIT.interstitial,
      googletag.enums.OutOfPageFormat.INTERSTITIAL
    );
    if (slot) {
      slot.addService(googletag.pubads());
      googletag.display(slot);
    }
  }

  // Rewarded is deliberately opt-in. Call:
  // GameWhameAds.showRewarded({ onGranted: () => { ...give reward... } })
  window.GameWhameAds.showRewarded = function (options) {
    const opts = options || {};
    rewardedRequest = opts;
    rewardedGranted = false;

    googletag.cmd.push(function () {
      if (rewardedSlot) {
        googletag.destroySlots([rewardedSlot]);
        rewardedSlot = null;
      }

      rewardedSlot = googletag.defineOutOfPageSlot(
        UNIT.rewarded,
        googletag.enums.OutOfPageFormat.REWARDED
      );

      if (!rewardedSlot) {
        if (typeof opts.onUnavailable === 'function') opts.onUnavailable();
        return;
      }

      rewardedSlot.addService(googletag.pubads());
      googletag.display(rewardedSlot);
    });
  };

  googletag.cmd.push(function () {
    googletag.pubads().setCentering(true);
    googletag.pubads().collapseEmptyDivs(true);

    googletag.pubads().addEventListener('rewardedSlotReady', function (event) {
      if (event.slot !== rewardedSlot) return;
      rewardedReady = true;
      event.makeRewardedVisible();
      if (rewardedRequest && typeof rewardedRequest.onOpened === 'function') {
        rewardedRequest.onOpened();
      }
    });

    googletag.pubads().addEventListener('rewardedSlotGranted', function (event) {
      if (event.slot !== rewardedSlot) return;
      rewardedGranted = true;
      if (rewardedRequest && typeof rewardedRequest.onGranted === 'function') {
        rewardedRequest.onGranted(event.payload || null);
      }
    });

    googletag.pubads().addEventListener('rewardedSlotClosed', function (event) {
      if (event.slot !== rewardedSlot) return;
      if (rewardedRequest && typeof rewardedRequest.onClosed === 'function') {
        rewardedRequest.onClosed({ granted: rewardedGranted, ready: rewardedReady });
      }
      googletag.destroySlots([rewardedSlot]);
      rewardedSlot = null;
      rewardedReady = false;
      rewardedGranted = false;
      rewardedRequest = null;
    });

    defineInPageSlots();
    defineAnchor();
    defineInterstitial();

    googletag.enableServices();
    slotIds.forEach(id => googletag.display(id));
  });
})();
