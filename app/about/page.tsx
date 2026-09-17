import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

const SITE_URL = "https://gamewhame.com";
const TITLE = "About GameWhame";
const DESCRIPTION = "GameWhame is a browser gaming website — free HTML5 games you can play instantly, no download, no sign-up.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/about" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/about`,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function AboutPage() {
  return (
    <LegalPage eyebrow="Company" title={TITLE} intro="Free browser games, curated and ready to play the moment you land on the page.">
      <p>
        GameWhame is a browser gaming website. We publish and curate HTML5 games that play directly in a modern
        web browser — no app to install, no account to create.
      </p>
      <p>
        Our goal is to make games easy to discover and enjoyable on both desktop and mobile. Every published
        game has its own page with gameplay information, controls, tips and related recommendations, so
        players can understand a game before — and while — they play.
      </p>
      <p>
        GameWhame is supported by advertising. Advertising keeps the service free to play without charging
        players for access. We aim to place ads in a way that doesn&apos;t obscure gameplay, imitate
        navigation, or encourage accidental clicks.
      </p>
      <p>
        Have a question or feedback? Reach us at{" "}
        <a href="mailto:support@gamewhame.com">support@gamewhame.com</a> or visit our{" "}
        <a href="/contact">contact page</a>.
      </p>
    </LegalPage>
  );
}
