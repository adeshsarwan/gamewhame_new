import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

const SITE_URL = "https://gamewhame.com";
const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How GameWhame collects, uses and protects information when you play free browser games on the site.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/privacy-policy" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title: `${TITLE} — GameWhame`,
      description: DESCRIPTION,
      url: `${SITE_URL}/privacy-policy`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITLE} — GameWhame`,
      description: DESCRIPTION,
    },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={TITLE}
      intro="This page explains what information GameWhame processes and why, and how you can reach us with questions."
    >
      <p>
        This Privacy Policy explains the privacy practices of GameWhame, a free browser games website. It
        covers the information we process when you visit the site, play a game or interact with our features.
        If you have questions about this policy, contact us at{" "}
        <a href="mailto:support@gamewhame.com">support@gamewhame.com</a>.
      </p>

      <h2>Information we process</h2>
      <p>
        When you use GameWhame, technical information may be processed to deliver, protect and improve the
        service. This may include your IP address, browser and device information, referring and requested
        URLs, an approximate location derived from your IP address, timestamps, diagnostic information and
        security logs.
      </p>
      <p>
        GameWhame may also use browser storage, including cookies or local storage, for functions such as
        remembering recently played games, favorites, preferences, consent choices and other site
        functionality.
      </p>

      <h2>Analytics</h2>
      <p>
        We may use analytics services to understand how visitors use the website — which games and pages are
        popular, device characteristics, session activity and performance. Where applicable, analytics storage
        is controlled by your consent choices.
      </p>

      <h2>Advertising and Google Ad Manager</h2>
      <p>
        GameWhame is advertising-supported and may use Google Ad Manager and related Google advertising
        technologies. Google and participating advertising partners may use cookies, web beacons, IP addresses,
        device identifiers and similar technologies to select, deliver, measure, limit the frequency of and
        report on advertising.
      </p>
      <p>
        Depending on your location and consent choices, advertising may be personalized or non-personalized.
        Where required, a consent-management platform is used before non-essential advertising or analytics
        technologies are activated.
      </p>

      <h2>Third-party games and services</h2>
      <p>
        Games and other embedded services may process technical information required to operate in the
        browser. Third-party services linked from GameWhame may have their own privacy practices, and you
        should review those policies where appropriate.
      </p>

      <h2>Children</h2>
      <p>
        GameWhame is intended as a general-audience browser gaming service and is not designed specifically
        for children. Parents and guardians should supervise younger users and review the games they access.
      </p>

      <h2>Data security and retention</h2>
      <p>
        We use reasonable technical and organizational measures to protect the website and associated
        information. Technical and operational records are retained only for as long as reasonably necessary
        for security, legal, accounting, analytics and service-operation purposes.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        Depending on your location, you may have rights relating to access, correction, deletion, restriction,
        objection or portability of your personal information. You may also be able to withdraw consent
        through the site&apos;s consent controls. To make a privacy request, email{" "}
        <a href="mailto:support@gamewhame.com">support@gamewhame.com</a>.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy when our website, advertising, analytics or legal requirements change. The
        version published on this page is the version that applies to GameWhame.
      </p>
    </LegalPage>
  );
}
