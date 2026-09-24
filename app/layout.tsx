import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { nunito, jakarta } from "./fonts";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategorySidebar from "@/components/CategorySidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Toaster } from "@/components/Toast";

const SITE_URL = "https://gamewhame.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GameWhame — Play free online games instantly",
    template: "%s · GameWhame",
  },
  description:
    "Play hundreds of free HTML5 games instantly on GameWhame — puzzle, arcade, racing, sports and more. No sign-up, no download. Just tap and play.",
  applicationName: "GameWhame",
  keywords: ["free online games", "html5 games", "puzzle games", "arcade games", "play games online", "browser games"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "GameWhame",
    url: SITE_URL,
    title: "GameWhame — Play free online games instantly",
    description: "Hundreds of free HTML5 games. No sign-up, no download. Play. Discover. Repeat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameWhame — Play free online games instantly",
    description: "Hundreds of free HTML5 games. No sign-up, no download. Play. Discover. Repeat.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#10233F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${jakarta.variable}`}>
      <head>
        {/* Warm up the games CDN connection (DNS + TLS + TCP) before the user
            opens a game, so the cross-origin iframe starts loading instantly. */}
        <link rel="preconnect" href="https://games.gamewhame.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://games.gamewhame.com" />
      </head>
      <body>
        <a href="#main" className="gw-skip-link">
          Skip to games
        </a>
        <Header />
        <div className="gw-shell">
          <CategorySidebar />
          <main id="main" className="gw-main">
            {children}
          </main>
        </div>
        <Footer />
        <MobileBottomNav />
        <Toaster />
        {/* Price Optimiser publisher bundle — loaded once, site-wide. The
            site-specific bundle pins gamewhame.com internally, so no
            data-po-site attribute is needed. Price Optimiser owns the managed
            GPT slots (#ad-leaderboard, #ad-incontent, …); the publisher only
            renders the DOM containers and loads this script. */}
        <Script
          src="https://priceoptimiser1.thebesads.com/experiences/gamewhame.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
