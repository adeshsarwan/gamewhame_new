import type { CSSProperties } from "react";
import type { IconName } from "@/lib/types";

/**
 * Local bold-rounded SVG icon set — the single glyph source for the whole app.
 * No emoji ever reaches a page (CLAUDE.md hard rule); components import <Icon />
 * rather than inlining SVG. Server-safe (no hooks). `weight="fill"` swaps to the
 * solid variant for active states (heart on, home active, etc.).
 */

export interface IconProps {
  name: IconName;
  size?: number;
  weight?: "line" | "fill";
  /** CSS color; defaults to currentColor (inherits from parent). */
  color?: string;
  className?: string;
  /** Accessible title; omit for decorative icons (defaults to aria-hidden). */
  title?: string;
  style?: CSSProperties;
}

const S = 2.4; // default stroke width for line icons

export default function Icon({ name, size = 22, weight = "line", color, className, title, style }: IconProps) {
  const fill = weight === "fill";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    className,
    style: { color, display: "block", flex: "none", ...style } as CSSProperties,
    role: title ? "img" : undefined,
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
    focusable: false as const,
  };
  const line = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: S,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const solid = { fill: "currentColor" };

  switch (name) {
    case "search":
      return (
        <svg {...common} {...line}>
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5 21 21" />
        </svg>
      );
    case "heart":
      return fill ? (
        <svg {...common} {...solid}>
          <path d="M12 21C7 16.5 2.5 13 2.5 8.8 2.5 6 4.7 4 7.5 4c1.7 0 3.2.9 4.5 2.6C13.3 4.9 14.8 4 16.5 4c2.8 0 5 2 5 4.8 0 4.2-4.5 7.7-9.5 12.2z" />
        </svg>
      ) : (
        <svg {...common} {...line}>
          <path d="M12 20.5S2.5 14.5 2.5 8.8C2.5 5.9 4.8 4 7.4 4c2 0 3.5 1.1 4.6 2.9C13.1 5.1 14.6 4 16.6 4c2.6 0 4.9 1.9 4.9 4.8 0 5.7-9.5 11.7-9.5 11.7z" />
        </svg>
      );
    case "play":
      return (
        <svg {...common} fill="currentColor">
          <path d="M8 5.6c0-1.1 1.2-1.8 2.1-1.2l9 6.4c.8.6.8 1.8 0 2.4l-9 6.4c-.9.6-2.1 0-2.1-1.2V5.6z" />
        </svg>
      );
    case "fullscreen":
      return (
        <svg {...common} {...line}>
          <path d="M4 9V5.5C4 4.7 4.7 4 5.5 4H9M15 4h3.5c.8 0 1.5.7 1.5 1.5V9M20 15v3.5c0 .8-.7 1.5-1.5 1.5H15M9 20H5.5C4.7 20 4 19.3 4 18.5V15" />
        </svg>
      );
    case "share":
      return (
        <svg {...common} {...line}>
          <circle cx="18" cy="5.5" r="2.6" />
          <circle cx="6" cy="12" r="2.6" />
          <circle cx="18" cy="18.5" r="2.6" />
          <path d="M8.3 10.8 15.7 6.8M8.3 13.2l7.4 4" />
        </svg>
      );
    case "reload":
      return (
        <svg {...common} {...line}>
          <path d="M20 12a8 8 0 1 1-2.4-5.7" />
          <path d="M20 4v4h-4" />
        </svg>
      );
    case "soundOn":
      return (
        <svg {...common} {...line}>
          <path d="M4 9.5v5h3l4.5 3.5V6L7 9.5H4z" />
          <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" />
        </svg>
      );
    case "soundOff":
      return (
        <svg {...common} {...line}>
          <path d="M4 9.5v5h3l4.5 3.5V6L7 9.5H4z" />
          <path d="M16.5 9.5 21 14M21 9.5 16.5 14" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common} {...line}>
          <path d="M6 21V4M6 4.5h9.5l-1.7 3.2 1.7 3.3H6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common} {...line}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common} {...line}>
          <path d="M6 6 18 18M18 6 6 18" />
        </svg>
      );
    case "home":
      return fill ? (
        <svg {...common} {...solid}>
          <path d="M11.3 3.3 4 9.2c-.6.5-1 1.3-1 2.1V19c0 1.1.9 2 2 2h3v-5c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v5h3c1.1 0 2-.9 2-2v-7.7c0-.8-.4-1.6-1-2.1l-7.3-5.9c-.4-.3-1-.3-1.4 0z" />
        </svg>
      ) : (
        <svg {...common} {...line}>
          <path d="M4 11.2c0-.6.3-1.2.7-1.6l6-4.9c.7-.6 1.7-.6 2.5 0l6 4.9c.5.4.8 1 .8 1.6V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7.8z" />
          <path d="M9.5 21v-5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v5" />
        </svg>
      );
    case "gamepad":
      return (
        <svg {...common} {...line}>
          <path d="M8 8h8a5 5 0 0 1 5 5.2 3.3 3.3 0 0 1-6 1.8h-6a3.3 3.3 0 0 1-6-1.8A5 5 0 0 1 8 8z" />
          <path d="M6.5 11v2.5M5.25 12.25h2.5M15.5 11.2v.1M17.5 13.2v.1" />
        </svg>
      );
    case "user":
      return fill ? (
        <svg {...common} {...solid}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0 1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
        </svg>
      ) : (
        <svg {...common} {...line}>
          <circle cx="12" cy="8" r="3.8" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case "caretLeft":
      return (
        <svg {...common} {...line}>
          <path d="M14.5 5 8 12l6.5 7" />
        </svg>
      );
    case "caretRight":
      return (
        <svg {...common} {...line}>
          <path d="M9.5 5 16 12l-6.5 7" />
        </svg>
      );
    case "caretDown":
      return (
        <svg {...common} {...line}>
          <path d="M5 9.5 12 16l7-6.5" />
        </svg>
      );
    case "arrowLeft":
      return (
        <svg {...common} {...line}>
          <path d="M20 12H4M10 6 4 12l6 6" />
        </svg>
      );
    case "star":
      return (
        <svg {...common} {...(fill ? solid : line)}>
          <path d="M12 3.6l2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.4l5.4-.8z" />
        </svg>
      );
    case "users":
      return (
        <svg {...common} {...line}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
          <path d="M16 5.2a3.2 3.2 0 0 1 0 6M17.5 14.2a5.5 5.5 0 0 1 3 4.8" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common} {...line}>
          <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
          <path d="M4 10h16M8 3.5v4M16 3.5v4" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common} {...line}>
          <path d="M4 4.5h6.5c.5 0 1 .2 1.4.6l7 7c.8.8.8 2 0 2.8l-5.6 5.6c-.8.8-2 .8-2.8 0l-7-7c-.4-.4-.6-.9-.6-1.4V4.5z" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "devices":
      return (
        <svg {...common} {...line}>
          <rect x="2.5" y="5" width="13" height="10" rx="1.8" />
          <path d="M2.5 18.5h10" />
          <rect x="16.5" y="9" width="5" height="10" rx="1.5" />
        </svg>
      );
    case "lightning":
      return (
        <svg {...common} {...(fill ? solid : line)}>
          <path d="M13 2.5 5 13h5l-1 8.5L17 11h-5l1-8.5z" />
        </svg>
      );
    case "flame":
      return (
        <svg {...common} {...(fill ? solid : line)}>
          <path d="M12 2.8c1.8 3 .3 5-1 6.2-1.3 1.2-2.2 2.4-1.4 4.2.4-.9 1.2-1.5 1.2-1.5-.3 2 .8 2.6 1.3 3.6.6-2 2.2-2.8 2.2-2.8-.2 1.6.9 2.3.9 3.7 0 2.5-2.2 4.5-5.3 4.5S4 20.7 4 17.3C4 12 9.5 10 9 4.8c1 .6 1.8 1.6 2 2.7 1-1.3 1.5-3.2 1-4.7z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common} {...(fill ? solid : line)}>
          <path d="M12 3c.4 3.4 2.6 5.6 6 6-3.4.4-5.6 2.6-6 6-.4-3.4-2.6-5.6-6-6 3.4-.4 5.6-2.6 6-6z" />
          <path d="M18.5 3.5c.15 1.2 1 2 2.2 2.2-1.2.2-2 1-2.2 2.2-.2-1.2-1-2-2.2-2.2 1.2-.2 2-1 2.2-2.2z" />
        </svg>
      );
    case "puzzle":
      return (
        <svg {...common} {...(fill ? solid : line)}>
          <path d="M10 4.5c0-1 .9-1.6 1.9-1.4 1 .2 1.6 1.1 1.4 2 0 .6.4.9 1 .9h2.2c.8 0 1.5.7 1.5 1.5V9.7c0 .6.3 1 .9 1 .9-.2 1.8.4 2 1.4.2 1-.4 1.9-1.4 1.9-.6 0-1 .4-1 1v3.3c0 .8-.7 1.5-1.5 1.5H14c-.6 0-1-.4-1-1 .2-1-.4-1.9-1.4-2.1-1-.2-1.9.5-2.1 1.4-.1.7-.5 1.1-1 1.1H6c-.8 0-1.5-.7-1.5-1.5V14c0-.6-.4-1-1-1-1 0-1.6-.9-1.4-1.9.2-1 1.1-1.6 2-1.4.5 0 .9-.4.9-1V7.5C5 6.7 5.7 6 6.5 6H9c.6 0 1-.4 1-1v-.5z" />
        </svg>
      );
    case "coffee":
      return (
        <svg {...common} {...line}>
          <path d="M4 8.5h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5z" />
          <path d="M16 9.5h2.2a2.3 2.3 0 0 1 0 4.6H16" />
          <path d="M7 3.5c-.6 1 .6 1.6 0 2.6M11 3.5c-.6 1 .6 1.6 0 2.6" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common} {...line}>
          <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2.5H4.5L6 16.5z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
      );
    case "crown":
      return (
        <svg {...common} {...(fill ? solid : line)}>
          <path d="M3.5 7.5 7 12l5-6 5 6 3.5-4.5-1.3 11H4.8L3.5 7.5z" />
          <path d="M5 19.5h14" />
        </svg>
      );
    case "info":
      return (
        <svg {...common} {...line}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 11v5" />
          <circle cx="12" cy="7.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common} {...line}>
          <path d="M7 4.5h10v3.5a5 5 0 0 1-10 0V4.5z" />
          <path d="M7 6H4.5v1.5A3 3 0 0 0 7 10.4M17 6h2.5v1.5A3 3 0 0 1 17 10.4M12 13v3M8.5 20h7M9.5 20c0-1.5.5-2.5 2.5-2.5s2.5 1 2.5 2.5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common} {...line}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3.2 2" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common} {...line}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "check":
      return (
        <svg {...common} {...line}>
          <path d="M5 12.5 10 17.5 19 6.5" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common} {...line}>
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
        </svg>
      );
    case "target":
      return (
        <svg {...common} {...line}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "dice":
      return (
        <svg {...common} {...line}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "swords":
      return (
        <svg {...common} {...line}>
          <path d="M15 4h5v5l-6.5 6.5M9 4H4v5l6.5 6.5M5 15l4 4M19 15l-4 4M8 16l-1.5 1.5M16 16l1.5 1.5" />
        </svg>
      );
    case "car":
      return (
        <svg {...common} {...line}>
          <path d="M4 15v-2.2c0-.4.1-.7.3-1l1.8-3c.4-.6 1-1 1.8-1h8.2c.7 0 1.4.4 1.8 1l1.8 3c.2.3.3.6.3 1V15" />
          <path d="M3.5 15h17M6 15v1.5M18 15v1.5" />
          <circle cx="7.5" cy="15" r="2" />
          <circle cx="16.5" cy="15" r="2" />
        </svg>
      );
    default:
      return (
        <svg {...common} {...line}>
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
  }
}
