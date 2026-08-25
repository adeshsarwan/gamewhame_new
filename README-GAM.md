# GameWhame GAM setup

Website-level Google Ad Manager units configured in `assets/js/gam.js`:

- `/23360556473/gamewhame.com_Native`
- `/23360556473/gamewhame.com_Interstitial`
- `/23360556473/gamewhame.com_Rewarded`
- `/23360556473/gamewhame.com_Anchor`

## What appears where

- Homepage top: Native unit
- Homepage in-feed: Native unit
- Game page top: Native unit
- Game page right rail: Native unit
- Game page below game: Native unit
- Bottom anchor: GAM out-of-page bottom anchor unit
- Web interstitial: GAM out-of-page web interstitial unit; GAM controls eligibility/frequency
- Rewarded: implemented but never auto-opened. Invoke `GameWhameAds.showRewarded(...)` only after a user explicitly chooses a real reward.

## Important

The network code is currently configured as `23360556473`. If these GameWhame units are in another GAM network, change only `NETWORK_CODE` at the top of `assets/js/gam.js`.

`ads.txt` still needs the exact authorized seller line from GAM/AdX. A GAM network code is not the same thing as the Google publisher ID used in ads.txt.

Game-specific units such as `gamewhame.com_draw-the-path_Anchor` are intentionally NOT wired here. They belong inside the individual Construct game integration.
