import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Serve prerendered (SSG) pages from Workers Static Assets instead of
// re-rendering them on every request. The default ("dummy") cache made every
// page a full SSR render, which tripped "Worker exceeded CPU time limit".
// Requires the deploy command `npx opennextjs-cloudflare deploy` (it populates
// the cache); a bare `wrangler deploy` ships an empty cache.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
