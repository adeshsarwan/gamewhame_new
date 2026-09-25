// Category page owner: full build per docs/02 §3.2 — banner, top f/t/w/m/s
// mosaic, sub-filter pills + sort select (delegated to the CategoryView client
// subcomponent), dense "all games" grid with client-side Load more, one AdSlot
// after the mosaic, and a related-categories row to keep the browse loop going.
// Shared helpers live in lib/ — getGamesByCategory, getPopularGames,
// getNewGames, sortGames. Do NOT reinvent the data layer.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, categoryBySlug, categoryColorVar } from "@/lib/categories";
import { getGamesByCategory, getPopularGames, getNewGames, sortGames } from "@/lib/games";
import type { CategoryDef, Game } from "@/lib/types";
import Mosaic from "@/components/Mosaic";
import SectionHeader from "@/components/SectionHeader";
import AdSlot from "@/components/AdSlot";
import { MANAGED_SLOT_IDS } from "@/lib/adConfig";
import CategoryPill from "@/components/CategoryPill";
import CategoryView, { type SubFilter } from "@/components/CategoryView";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import styles from "./category.module.css";

const SITE_URL = "https://gamewhame.com";

/** Every real category plus the "popular" / "new" pseudo-categories (docs/05). */
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

/** Resolve a category (or virtual popular/new) slug to its game list. */
function gamesFor(slug: string): Game[] {
  if (slug === "popular") return getPopularGames();
  if (slug === "new") return getNewGames();
  const def = categoryBySlug(slug);
  return def ? getGamesByCategory(def.label) : [];
}

/**
 * Secondary tags within the category, ranked by how many games carry them —
 * the sub-filter pill row. Virtual categories (popular/new) span every
 * primary category, so filter by primary category there instead of by
 * secondary tag.
 */
function subFiltersFor(def: CategoryDef, games: Game[]): SubFilter[] {
  const counts = new Map<string, number>();
  games.forEach((g) => {
    const labels = def.virtual ? [g.category] : g.categories.filter((c) => c.toLowerCase() !== def.label.toLowerCase());
    labels.forEach((label) => counts.set(label, (counts.get(label) ?? 0) + 1));
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label]) => ({ label, colorVar: categoryColorVar(label) }));
}

/** A deterministic, page-varying rotation of other categories to keep browsing. */
function relatedCategories(slug: string, count = 8): CategoryDef[] {
  const real = CATEGORIES.filter((c) => !c.virtual && c.slug !== slug);
  if (!real.length) return [];
  const idx = CATEGORIES.findIndex((c) => c.slug === slug);
  const start = idx >= 0 ? idx % real.length : 0;
  return [...real.slice(start), ...real.slice(0, start)].slice(0, count);
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const def = categoryBySlug(params.category);
  if (!def) {
    return { title: "Category not found", robots: { index: false, follow: false } };
  }
  const count = gamesFor(params.category).length;
  const description = `${def.blurb} Play ${count} free ${def.label.toLowerCase()} games instantly on GameWhame — no download, no sign-up.`;
  return {
    title: `${def.label} Games`,
    description,
    alternates: { canonical: `/games/${params.category}` },
    keywords: [`${def.label.toLowerCase()} games`, "free online games", "play games online", "html5 games"],
    openGraph: {
      type: "website",
      title: `${def.label} Games — GameWhame`,
      description,
      url: `/games/${params.category}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${def.label} Games — GameWhame`,
      description,
    },
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const def = categoryBySlug(params.category);
  if (!def) notFound();

  const games = gamesFor(params.category);
  const mosaicGames = sortGames(games, "popular").slice(0, 18);
  const subFilters = subFiltersFor(def, games);
  const related = relatedCategories(params.category);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${def.label} games on GameWhame`,
    numberOfItems: mosaicGames.length,
    itemListElement: mosaicGames.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/play/${g.slug}`,
      name: g.title,
    })),
  };

  return (
    <div className={`gw-container ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <nav className={styles.crumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <Icon name="caretRight" size={13} />
        <span>Categories</span>
        <Icon name="caretRight" size={13} />
        <b>{def.label}</b>
      </nav>

      <header className={styles.banner} style={{ ["--cat-c" as string]: `var(${def.colorVar})` } as React.CSSProperties}>
        <span className={styles.bannerChip}>
          <Icon name={def.icon} weight="fill" size={26} color="#fff" />
        </span>
        <div className={styles.bannerText}>
          <h1 className={styles.h1}>{def.label} Games</h1>
          <p className={styles.blurb}>{def.blurb} Free to play instantly — no download, no sign-up.</p>
        </div>
        <span className={styles.count}>
          {games.length} {games.length === 1 ? "game" : "games"}
        </span>
      </header>

      {games.length ? (
        <>
          <section aria-label={`Best ${def.label} games`} className={styles.mosaicSection}>
            <Mosaic games={mosaicGames} priorityCount={4} />
          </section>

          {/* Price Optimiser managed in-content container — the category
              route's single display unit. Unique per rendered DOM. */}
          <Reveal as="section" className={styles.adWrap}>
            <AdSlot variant="display" managedId={MANAGED_SLOT_IDS.incontent} height={110} />
          </Reveal>

          <Reveal as="section" className={styles.gridSection}>
            <SectionHeader
              icon="grid"
              title={`All ${def.label} Games`}
              subtitle={`${games.length} ${games.length === 1 ? "game" : "games"} to play free`}
              iconColor={`var(${def.colorVar})`}
            />
            <CategoryView games={games} subFilters={subFilters} />
          </Reveal>
        </>
      ) : (
        <p className={styles.empty}>No games in this category yet — explore related categories below.</p>
      )}

      {related.length > 0 && (
        <Reveal as="section" className={styles.relatedSection}>
          <SectionHeader icon="gamepad" title="Keep exploring" subtitle="More categories to discover" />
          <div className={styles.relatedRow}>
            {related.map((c) => (
              <CategoryPill key={c.slug} label={c.label} href={`/games/${c.slug}`} color={c.colorVar} icon={c.icon} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
