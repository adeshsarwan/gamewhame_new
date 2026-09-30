import Script from "next/script";

/**
 * GA4 measurement ID for THIS site. Per-site value (see the rebrand-delta table
 * in CLAUDE.md) — PlayLoft must use its own property, never this one, or the two
 * sites' data would merge. Empty string disables analytics entirely.
 */
export const GA_MEASUREMENT_ID = "G-7HMLBZ1B26";

/**
 * Google Analytics 4 (gtag.js). Loaded `afterInteractive` so it never competes
 * with the ad SDK or the first paint. This is the standard gtag bootstrap — note
 * `gtag()` / `googletagmanager.com` are GA, distinct from GPT's `googletag.*`
 * which Price Optimiser owns and the publisher must never call.
 */
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
