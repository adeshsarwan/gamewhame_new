import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedGames,
  getPopularGames,
  getNewGames,
  getGamesByCategory,
  getAllGames,
  TOTAL_GAMES,
} from "@/lib/games";
import { categoryColorVar } from "@/lib/categories";
import MascotSearchCard from "@/components/MascotSearchCard";
import HomeTop from "@/components/HomeTop";
import GameGrid from "@/components/GameGrid";
import GameRail from "@/components/GameRail";
import SectionHeader from "@/components/SectionHeader";
import AdSlot from "@/components/AdSlot";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "GameWhame — Play free online games instantly",
  description:
    "Play hundreds of free HTML5 games instantly on GameWhame — puzzle, arcade, racing, sports, board and more. No sign-up, no download. Play. Discover. Repeat.",
  alternates: { canonical: "/" },
};

function cssVar(name: string) {
  return `var(${name})`;
}

export default function HomePage() {
  const featured = getFeaturedGames(9);
  const allGames = getAllGames();
  const popular = getPopularGames(24);
  const fresh = getNewGames(18);
  const puzzle = getGamesByCategory("Puzzle").slice(0, 12);
  const relax = getGamesByCategory("Casual").concat(getGamesByCategory("Matching")).slice(0, 12);
  const challenge = getGamesByCategory("Action").concat(getGamesByCategory("Racing")).slice(0, 12);

  // JSON-LD ItemList for the popular grid (SEO / rich results).
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Popular games on GameWhame",
    numberOfItems: popular.length,
    itemListElement: popular.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://gamewhame.com/play/${g.slug}`,
      name: g.title,
    })),
  };

  return (
    <div className={`gw-container ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      {/* Games-first: the big-tile strip leads the page. The mascot is demoted
          to a single tile INSIDE this row (not a hero) — one of the widgets. */}
      <section className={styles.top}>
        <HomeTop featured={featured} all={allGames} leadWidget={<MascotSearchCard games={allGames} />} />
      </section>

      {/* Popular — the dense, app-like grid front-and-center. */}
      <Reveal as="section" className={styles.section}>
        <SectionHeader
          icon="flame"
          title="Popular Games"
          subtitle="What everyone is playing right now"
          iconColor={cssVar(categoryColorVar("Popular"))}
          seeAllHref="/games/popular"
        />
        <GameGrid games={popular} priorityCount={6} />
      </Reveal>

      {/* In-content Price Optimiser managed Native container — id must be unique. */}
      <Reveal as="section" className={styles.adWrap}>
        <AdSlot variant="display" managedId="ad-incontent" height={110} />
      </Reveal>

      {/* New — another dense grid so games keep filling the screen. */}
      <Reveal as="section" className={styles.section}>
        <SectionHeader
          icon="sparkle"
          title="New Games"
          subtitle="Fresh drops in the arcade"
          iconColor={cssVar(categoryColorVar("New Games"))}
          seeAllHref="/games/new"
        />
        <GameGrid games={fresh} />
      </Reveal>

      {/* Category discovery rows — horizontal variety, still games-first. */}
      <Reveal as="section" className={styles.section}>
        <GameRail
          title="Puzzle & Brain"
          subtitle="Clever boards and satisfying logic"
          icon="puzzle"
          iconColor={cssVar(categoryColorVar("Puzzle"))}
          games={puzzle}
          seeAllHref="/games/puzzle"
        />
      </Reveal>

      <Reveal as="section" className={styles.section}>
        <GameRail
          title="Challenge Yourself"
          subtitle="Fast reflexes and high stakes"
          icon="flame"
          iconColor={cssVar(categoryColorVar("Action"))}
          games={challenge}
          seeAllHref="/games/action"
        />
      </Reveal>

      <Reveal as="section" className={styles.section}>
        <GameRail
          title="Play & Relax"
          subtitle="Easy-going games for a quick break"
          icon="coffee"
          iconColor={cssVar(categoryColorVar("Casual"))}
          games={relax}
          seeAllHref="/games/casual"
        />
      </Reveal>

      <Reveal as="section" className={styles.adWrap}>
        <AdSlot variant="display" height={110} />
      </Reveal>

      {/* SEO card */}
      <Reveal as="section" className={styles.seo}>
        <div className={styles.seoCol}>
          <h2 className={styles.seoTitle}>
            <Icon name="gamepad" weight="fill" size={22} color="var(--aqua-2)" />
            Free online games on GameWhame
          </h2>
          <p>
            GameWhame is a bright, fast arcade of {TOTAL_GAMES}+ free HTML5 games you can play instantly in your browser
            — no sign-up, no download, no waiting. Jump into puzzle, arcade, racing, sports, board and brain games, save
            your favorites, and let the next great game find you.
          </p>
          <p>
            Every game runs right here on your phone, tablet or desktop. Tap a tile, start playing in seconds, and when
            you finish one round, a related pick is always a tap away.
          </p>
        </div>
        <div className={styles.seoCol}>
          <h2 className={styles.seoTitle}>
            <Icon name="lightning" weight="fill" size={22} color="var(--yellow)" />
            How to play
          </h2>
          <ul className={styles.howto}>
            <li>
              <Icon name="check" size={18} color="var(--aqua-2)" /> Pick any game tile — it opens on its own play page.
            </li>
            <li>
              <Icon name="check" size={18} color="var(--aqua-2)" /> Play instantly in the browser; no install needed.
            </li>
            <li>
              <Icon name="check" size={18} color="var(--aqua-2)" /> Tap the heart to save favorites to this device.
            </li>
            <li>
              <Icon name="check" size={18} color="var(--aqua-2)" /> Use the related rail to discover your next game.
            </li>
          </ul>
          <Link href="/games/popular" className={styles.seoCta}>
            Explore popular games
            <Icon name="caretRight" size={16} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
