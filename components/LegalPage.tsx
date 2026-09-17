import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "@/components/Icon";
import styles from "./LegalPage.module.css";

interface LegalPageProps {
  /** Small label above the H1, e.g. "Legal" or "Company". */
  eyebrow: string;
  title: string;
  /** Optional one-line summary under the H1. */
  intro?: string;
  children: ReactNode;
}

/**
 * Shared prose shell for the legal/info pages (privacy, terms, cookies,
 * about, contact) — centered readable column dressed in our design tokens.
 * Page files pass plain semantic children (h2/p/ul/a); typography for those
 * is scoped by `.prose` in LegalPage.module.css so pages stay content-only.
 */
export default function LegalPage({ eyebrow, title, intro, children }: LegalPageProps) {
  return (
    <div className={`gw-container ${styles.wrap}`}>
      <nav className={styles.crumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <Icon name="caretRight" size={12} />
        <b>{title}</b>
      </nav>

      <article className={styles.card}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.h1}>{title}</h1>
          {intro && <p className={styles.intro}>{intro}</p>}
        </header>

        <div className={styles.prose}>{children}</div>
      </article>
    </div>
  );
}

/** Inline mail glyph — not part of the shared Icon set, drawn locally like
 * Footer's social marks (real SVG path, no emoji). */
function MailGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

/** Reused email CTA card — contact page today, easy to drop into others. */
export function ContactCard({ email }: { email: string }) {
  return (
    <div className={styles.contactCard}>
      <span className={styles.contactIcon}>
        <MailGlyph />
      </span>
      <div className={styles.contactText}>
        <span className={styles.contactLabel}>Email us</span>
        <a className={styles.contactEmail} href={`mailto:${email}`}>
          {email}
        </a>
      </div>
    </div>
  );
}
