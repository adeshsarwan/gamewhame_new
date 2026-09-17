import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

const SITE_URL = "https://gamewhame.com";
const TITLE = "Cookie Policy";
const DESCRIPTION = "How GameWhame uses cookies and similar browser storage for functionality, analytics and advertising.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/cookie-policy" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title: `${TITLE} — GameWhame`,
      description: DESCRIPTION,
      url: `${SITE_URL}/cookie-policy`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITLE} — GameWhame`,
      description: DESCRIPTION,
    },
  };
}

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={TITLE}
      intro="GameWhame uses cookies and similar browser technologies to run the site, remember preferences and support advertising."
    >
      <h2>Essential technologies</h2>
      <p>
        Some browser storage is required for security, consent choices, basic site functionality, game
        operation and preferences. These technologies are used where necessary to provide the service you
        requested.
      </p>

      <h2>Analytics technologies</h2>
      <p>
        When enabled, analytics technologies help us understand visits, page and game popularity, device
        characteristics, performance and how visitors navigate GameWhame.
      </p>

      <h2>Advertising technologies</h2>
      <p>
        GameWhame may use Google Ad Manager and related advertising technologies. Google and advertising
        partners may use cookies, IP addresses, device identifiers and similar signals to deliver and measure
        advertising, prevent fraud, control frequency and, where permitted, personalize ads.
      </p>

      <h2>Consent choices</h2>
      <p>
        Where required by law, non-essential analytics and advertising technologies are controlled through a
        consent-management platform. You may be able to accept, reject or adjust eligible categories, and
        later change those choices through the consent interface.
      </p>

      <h2>More information</h2>
      <p>
        For more information about how GameWhame processes information, see our{" "}
        <a href="/privacy-policy">Privacy Policy</a>, or email us at{" "}
        <a href="mailto:support@gamewhame.com">support@gamewhame.com</a>.
      </p>
    </LegalPage>
  );
}
