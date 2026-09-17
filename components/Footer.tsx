import Link from "next/link";
import { LogoMark } from "./BrandMarks";
import { CATEGORIES } from "@/lib/categories";
import styles from "./Footer.module.css";

/** Minimal monochrome brand marks (currentColor) — no emoji, real SVG paths. */
const SOCIALS: { label: string; path: string }[] = [
  { label: "Discord", path: "M19.5 5.3A16 16 0 0 0 15.6 4l-.2.4a12 12 0 0 1 3.4 1.7 13.7 13.7 0 0 0-11.6 0A12 12 0 0 1 10.6 4.4L10.4 4A16 16 0 0 0 6.5 5.3C3.9 9.2 3.2 13 3.5 16.8A16 16 0 0 0 8.4 19l.6-1a10 10 0 0 1-1.6-.8l.4-.3a11.5 11.5 0 0 0 9.8 0l.4.3a10 10 0 0 1-1.6.8l.6 1a16 16 0 0 0 4.9-2.2c.4-4.4-.7-8.2-2.4-11.5zM9.3 14.5c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2zm5.4 0c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2z" },
  { label: "X", path: "M17.5 4h2.6l-5.7 6.5L21 20h-5.2l-4.1-5.4L6.9 20H4.3l6.1-7L4 4h5.3l3.7 4.9L17.5 4zm-.9 14.4h1.4L8.4 5.5H6.9l9.7 12.9z" },
  { label: "YouTube", path: "M22 8.2a2.6 2.6 0 0 0-1.8-1.9C18.6 6 12 6 12 6s-6.6 0-8.2.3A2.6 2.6 0 0 0 2 8.2 27 27 0 0 0 1.7 12 27 27 0 0 0 2 15.8a2.6 2.6 0 0 0 1.8 1.9C5.4 18 12 18 12 18s6.6 0 8.2-.3a2.6 2.6 0 0 0 1.8-1.9A27 27 0 0 0 22.3 12 27 27 0 0 0 22 8.2zM10 15V9l5.2 3-5.2 3z" },
  { label: "TikTok", path: "M16.5 3c.3 2 1.5 3.6 3.5 3.9v2.6a6.4 6.4 0 0 1-3.5-1.1v5.7a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.7a2.9 2.9 0 1 0 2 2.8V3h2.7z" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.dots} aria-hidden />
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <LogoMark size={40} />
            <span className={styles.word}>
              <b>
                GAME<i>WHAME</i>
              </b>
              <small>Play. Discover. Repeat.</small>
            </span>
          </div>
          <p className={styles.blurb}>
            A bright, fast arcade of free HTML5 games. No sign-up, no download — just tap a tile and play, then let the
            next favorite find you.
          </p>
          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a key={s.label} href="#" className={styles.social} aria-label={s.label}>
                <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden focusable="false">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <nav className={styles.col} aria-label="Explore">
          <h3 className={styles.colTitle}>Explore</h3>
          <Link href="/">Home</Link>
          <Link href="/games/popular">Popular</Link>
          <Link href="/games/new">New Games</Link>
          <Link href="/favorites">Favorites</Link>
        </nav>

        <nav className={styles.col} aria-label="Categories">
          <h3 className={styles.colTitle}>Categories</h3>
          {CATEGORIES.slice(2, 8).map((c) => (
            <Link key={c.slug} href={`/games/${c.slug}`}>
              {c.label}
            </Link>
          ))}
        </nav>

        <nav className={styles.col} aria-label="Company">
          <h3 className={styles.colTitle}>Company</h3>
          <Link href="/about">About</Link>
          <a href="#">Submit a game</a>
          <Link href="/contact">Contact</Link>
        </nav>

        <nav className={styles.col} aria-label="Legal">
          <h3 className={styles.colTitle}>Legal</h3>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-of-use">Terms</Link>
          <Link href="/cookie-policy">Cookies</Link>
        </nav>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} GameWhame. All rights reserved.</span>
        <span>Made for players.</span>
      </div>
    </footer>
  );
}
