// Search (docs/02 §3.3) — owned by the search agent.
// Server-rendered shell reading ?q= directly (searchGames is a pure, deterministic
// helper — safe to call at render time). Three states: empty query (on-brand
// landing with categories + trending/popular rails), results (GameGrid), and
// no-results (illustration + "did you mean" categories + a popular rail so the
// visitor never dead-ends). The header/mobile live dropdown lives in SearchBox
// and is untouched here.
import type { Metadata } from "next";
import Link from "next/link";
import { searchGames, getPopularGames, getTrendingGames } from "@/lib/games";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryDef } from "@/lib/types";
import GameGrid from "@/components/GameGrid";
import GameRail from "@/components/GameRail";
import CategoryPill from "@/components/CategoryPill";
import Icon from "@/components/Icon";
import { RecordSearch, RecentSearchChips } from "@/components/RecentSearches";
import styles from "./search.module.css";

/** Curated category picks for the empty-query landing tiles. */
const LANDING_SLUGS = ["puzzle", "arcade", "racing", "action", "adventure", "word", "multiplayer", "3d"];

function landingCategories(): CategoryDef[] {
  return LANDING_SLUGS.map((slug) => CATEGORIES.find((c) => c.slug === slug)).filter(
    (c): c is CategoryDef => Boolean(c),
  );
}

/** Lightweight "did you mean" matcher — scores real categories against the
 *  query, then tops up with the landing picks so it's never empty. */
function suggestCategories(query: string, count = 4): CategoryDef[] {
  const q = query.toLowerCase();
  const scored = CATEGORIES.filter((c) => !c.virtual)
    .map((c) => {
      const label = c.label.toLowerCase();
      let s = 0;
      if (label === q) s += 30;
      if (label.includes(q) || q.includes(label)) s += 14;
      if (c.slug.includes(q) || q.includes(c.slug)) s += 10;
      return { c, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.c);
  const fallback = landingCategories();
  const combined = [...scored, ...fallback.filter((c) => !scored.includes(c))];
  return combined.slice(0, count);
}

export function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Metadata {
  const q = (searchParams?.q ?? "").trim();
  if (q) {
    return {
      title: `"${q}" — search results`,
      description: `Search results for "${q}" on GameWhame — free instant-play browser games, no download.`,
      robots: { index: false, follow: true },
      alternates: { canonical: "/search" },
    };
  }
  return {
    title: "Search games",
    description: "Search hundreds of free instant-play browser games on GameWhame by title, category or tag.",
    alternates: { canonical: "/search" },
  };
}

/** Tasteful "nothing found" illustration — a magnifier over a few empty tiles. No emoji. */
function NoResultsArt() {
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" aria-hidden focusable="false">
      <circle cx="64" cy="64" r="64" fill="var(--aqua-wash)" />
      <rect x="28" y="72" width="22" height="22" rx="6" fill="var(--paper)" stroke="var(--line)" strokeWidth="2.4" strokeDasharray="4 4" />
      <rect x="55" y="60" width="22" height="34" rx="6" fill="var(--paper)" stroke="var(--line)" strokeWidth="2.4" strokeDasharray="4 4" />
      <rect x="82" y="76" width="18" height="18" rx="6" fill="var(--paper)" stroke="var(--line)" strokeWidth="2.4" strokeDasharray="4 4" />
      <circle cx="54" cy="46" r="20" fill="var(--paper)" stroke="var(--navy)" strokeWidth="4.5" />
      <path d="M38 38c1-4 4.5-7.5 8.5-8.5" stroke="var(--aqua-2)" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M68 60 81 73" stroke="var(--navy)" strokeWidth="7" strokeLinecap="round" />
      <path d="M46.5 38.5 61.5 53.5M61.5 38.5 46.5 53.5" stroke="var(--pink)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams?.q ?? "").trim();
  const hasQuery = q.length > 0;
  const results = hasQuery ? searchGames(q) : [];
  const hasResults = results.length > 0;

  return (
    <div className={`gw-container ${styles.page}`}>
      {hasQuery && <RecordSearch q={q} />}

      <Link href="/" className={styles.back}>
        <Icon name="arrowLeft" size={18} /> Home
      </Link>

      <h1 className={styles.h1}>
        <span className={styles.chip}>
          <Icon name="search" size={20} color="#fff" />
        </span>
        {hasQuery ? (
          <>
            Results for “{q}” <small>{results.length} found</small>
          </>
        ) : (
          "What do you want to play?"
        )}
      </h1>

      {hasQuery ? (
        hasResults ? (
          <GameGrid games={results} priorityCount={8} />
        ) : (
          <NoResultsState q={q} />
        )
      ) : (
        <LandingState />
      )}
    </div>
  );
}

function LandingState() {
  const trending = getTrendingGames(10);
  const popular = getPopularGames(12);
  const cats = landingCategories();

  return (
    <div className={styles.landing}>
      <p className={styles.prompt}>Search by title, category or tag — try “puzzle”, “racing” or “3D”.</p>

      <RecentSearchChips />

      <div className={styles.catSection}>
        <h2 className={styles.subhead}>Popular categories</h2>
        <div className={styles.catGrid}>
          {cats.map((c) => (
            <CategoryPill key={c.slug} label={c.label} href={`/games/${c.slug}`} color={c.colorVar} icon={c.icon} />
          ))}
        </div>
      </div>

      <GameRail title="Trending now" icon="flame" games={trending} seeAllHref="/games/popular" />
      <GameRail title="Popular Games" icon="flame" games={popular} seeAllHref="/games/popular" />
    </div>
  );
}

function NoResultsState({ q }: { q: string }) {
  const suggestions = suggestCategories(q, 4);
  const popular = getPopularGames(10);

  return (
    <div className={styles.noResults}>
      <div className={styles.empty}>
        <NoResultsArt />
        <h2>No games found for “{q}”</h2>
        <p>Try a shorter word, or jump into one of these instead.</p>
        <div className={styles.emptyCtas}>
          <Link href="/" className={styles.ctaPrimary}>
            Explore arcade
          </Link>
          <Link href="/games/puzzle" className={styles.ctaGhost}>
            Puzzle picks
          </Link>
        </div>
      </div>

      <div className={styles.didYouMean}>
        <h2 className={styles.subhead}>Did you mean</h2>
        <div className={styles.catGrid}>
          {suggestions.map((c) => (
            <CategoryPill key={c.slug} label={c.label} href={`/games/${c.slug}`} color={c.colorVar} icon={c.icon} />
          ))}
        </div>
      </div>

      <GameRail title="Popular Games" icon="flame" games={popular} seeAllHref="/games/popular" />
    </div>
  );
}
