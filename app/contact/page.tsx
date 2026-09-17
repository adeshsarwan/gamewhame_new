import type { Metadata } from "next";
import LegalPage, { ContactCard } from "@/components/LegalPage";

const SITE_URL = "https://gamewhame.com";
const TITLE = "Contact GameWhame";
const DESCRIPTION = "Get in touch with GameWhame for support, business, legal, privacy or copyright inquiries.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/contact" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/contact`,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function ContactPage() {
  return (
    <LegalPage eyebrow="Company" title={TITLE} intro="Questions, feedback or a rights concern — we're one email away.">
      <ContactCard email="support@gamewhame.com" />

      <p>
        For business, legal, privacy, copyright or other rights-related inquiries, please email{" "}
        <a href="mailto:support@gamewhame.com">support@gamewhame.com</a>.
      </p>

      <h2>Reporting a game issue</h2>
      <p>
        If you&apos;re reporting a problem with a game, please include the game name, the page URL, your
        device and browser, and a short description of what happened. This helps us reproduce and fix issues
        faster.
      </p>

      <h2>Copyright and rights concerns</h2>
      <p>
        For copyright or trademark concerns, identify the material in question and provide enough information
        for the request to be reviewed. We may remove or disable content while we investigate a valid legal or
        rights-related request.
      </p>
    </LegalPage>
  );
}
