import type { CSSProperties } from "react";

/**
 * Hand-authored brand SVGs (never from the icon set):
 *  - LogoMark: the "Play Spark" tile — the GameWhame brand mark. A rounded
 *    squircle in a navy→teal gradient holding a crisp aqua play glyph with a
 *    yellow spark. Minimalist, gaming, legible down to a 16px favicon, and it
 *    reads on both white and the dark navy header (the tile carries its own
 *    contrast). Kept in sync with app/icon.svg.
 *  - Logo: the full lockup (mark + wordmark) with a light-on-dark variant.
 *  - PlayTriangle: the single Play glyph used in every CTA/overlay/stage so play
 *    reads identically at every size.
 */

let markSeq = 0;

export function LogoMark({ size = 34, style }: { size?: number; style?: CSSProperties }) {
  // Unique gradient id per instance so multiple marks on a page never collide.
  const gid = `gw-mark-${markSeq++}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      focusable={false}
      style={{ display: "block", ...style }}
    >
      <rect x="2" y="2" width="36" height="36" rx="11.5" fill={`url(#${gid})`} />
      <path
        d="M16 12.6c0-1.25 1.35-2 2.4-1.28l9.1 6.1c.95.64.95 2.04 0 2.68l-9.1 6.1c-1.05.72-2.4-.03-2.4-1.28V12.6z"
        fill="#0BE0D0"
      />
      <circle cx="31.5" cy="8.5" r="3.6" fill="#FFC531" />
      <defs>
        <linearGradient id={gid} x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10233F" />
          <stop offset="0.55" stopColor="#153A63" />
          <stop offset="1" stopColor="#0B8F9C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Logo — the full mark + wordmark lockup. `tone="light"` renders the wordmark
 * white with an aqua "Whame" accent for the dark navy header; the default dark
 * tone uses navy text with a pink accent for light surfaces (footer, etc.).
 */
export function Logo({ tone = "dark", size = 38 }: { tone?: "dark" | "light"; size?: number }) {
  const dark = tone === "dark";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={size} />
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <b
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 1000,
            fontSize: size * 0.5,
            letterSpacing: "-0.02em",
            color: dark ? "var(--navy)" : "#fff",
          }}
        >
          Game<i style={{ fontStyle: "normal", color: dark ? "var(--pink)" : "var(--aqua)" }}>Whame</i>
        </b>
        <small
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 800,
            fontSize: 8.5,
            letterSpacing: "1.4px",
            marginTop: 2,
            color: dark ? "var(--muted-2)" : "rgba(180,205,230,0.75)",
          }}
        >
          GAMEWHAME.COM
        </small>
      </span>
    </span>
  );
}

/**
 * Wordmark — the text-only GameWhame logo (no icon/mark). "Game" in the base
 * ink with "Whame" in the aqua brand accent, set in the display font at a heavy
 * weight. Shared by the header and footer; both sit on the dark navy surface so
 * the default renders light. Pass an optional `tagline` for the small line below.
 */
export function Wordmark({
  size = 19,
  tagline,
  className,
  style,
}: {
  size?: number;
  tagline?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={className} style={{ display: "flex", flexDirection: "column", lineHeight: 1.05, ...style }}>
      <b
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 1000,
          fontSize: size,
          letterSpacing: "-0.02em",
          color: "#fff",
        }}
      >
        Game<i style={{ fontStyle: "normal", color: "var(--aqua)" }}>Whame</i>
      </b>
      {tagline ? (
        <small
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 800,
            fontSize: Math.max(8.5, size * 0.45),
            letterSpacing: "1.2px",
            marginTop: 3,
            color: "rgba(180,205,230,0.72)",
          }}
        >
          {tagline}
        </small>
      ) : null}
    </span>
  );
}

export function PlayTriangle({ size = 20, color = "currentColor", style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden
      focusable={false}
      style={{ display: "block", ...style }}
    >
      {/* Equilateral rounded-corner triangle, optically centered (nudged +0.6px x). */}
      <path d="M8.6 5.2c0-1.1 1.2-1.8 2.1-1.2l8.3 6.1c.8.6.8 1.8 0 2.4l-8.3 6.1c-.9.6-2.1 0-2.1-1.2V5.2z" />
    </svg>
  );
}
