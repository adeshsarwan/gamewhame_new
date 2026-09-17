import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

const SITE_URL = "https://gamewhame.com";
const TITLE = "Terms of Use";
const DESCRIPTION = "The terms that govern your use of GameWhame — free browser games, played instantly.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/terms-of-use" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title: `${TITLE} — GameWhame`,
      description: DESCRIPTION,
      url: `${SITE_URL}/terms-of-use`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITLE} — GameWhame`,
      description: DESCRIPTION,
    },
  };
}

export default function TermsOfUsePage() {
  return (
    <LegalPage eyebrow="Legal" title={TITLE} intro="Please read these terms before you play — using GameWhame means you agree to them.">
      <p>
        By accessing or using GameWhame, you agree to comply with these Terms of Use. If you do not agree,
        please do not use the site.
      </p>

      <h2>Use of the service</h2>
      <p>
        GameWhame is provided for lawful personal entertainment. You may play games, browse pages and use
        ordinary website features for their intended purpose. You may not misuse the service, interfere with
        its operation, attempt to bypass technical or security controls, distribute malware, conduct abusive
        automated activity, or use the website in violation of applicable law.
      </p>

      <h2>Games and intellectual property</h2>
      <p>
        GameWhame&apos;s website design, branding, original text and other publisher-created materials are
        protected by applicable intellectual-property laws. Individual games, artwork, trademarks and
        third-party materials remain the property of their respective owners or licensors unless stated
        otherwise.
      </p>
      <p>
        You may not copy, republish, sell, reverse engineer, redistribute or commercially exploit GameWhame
        content or third-party game content except where you have permission or applicable law expressly
        allows it.
      </p>

      <h2>Availability and changes</h2>
      <p>
        Games, features and pages may be changed, suspended or removed at any time. We may also modify game
        availability for technical, commercial, legal, licensing, safety or policy reasons.
      </p>

      <h2>Advertising and third-party services</h2>
      <p>
        GameWhame is supported by advertising and may display advertisements supplied through Google Ad
        Manager or other advertising providers. Advertisements and external links may lead to third-party
        websites or services. We do not control third-party websites and are not responsible for their
        independent content, products or privacy practices.
      </p>

      <h2>Disclaimer</h2>
      <p>
        GameWhame is provided on an &quot;as available&quot; basis. To the extent permitted by applicable law,
        we do not guarantee uninterrupted availability, compatibility with every device, error-free operation
        or continued availability of any particular game.
      </p>

      <h2>Responsible use</h2>
      <p>
        You are responsible for your own device, internet access and use of the service. Parents and guardians
        are responsible for supervising younger users and determining whether individual games are appropriate
        for them.
      </p>

      <h2>Rights concerns</h2>
      <p>
        If you believe material on GameWhame infringes your copyright, trademark or other rights, please
        contact us at <a href="mailto:support@gamewhame.com">support@gamewhame.com</a> and identify the
        material and the basis of your request.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms when the service or applicable requirements change. Continued use of
        GameWhame after an updated version is published constitutes acceptance to the extent permitted by
        law.
      </p>
    </LegalPage>
  );
}
