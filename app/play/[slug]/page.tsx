// OWNER: play agent — THE P1 ENGINE (docs/02 §3.4).
// Server-renders the SEO shell + reserved stage (zero CLS); the iframe itself is
// mounted client-side only inside <PlayerStage> and destroyed on route change.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllGames, getGameBySlug, getRelated } from "@/lib/games";
import { categoryColorVar, categorySlug } from "@/lib/categories";
import GameRail from "@/components/GameRail";
import AdSlot from "@/components/AdSlot";
import { MANAGED_SLOT_IDS } from "@/lib/adConfig";
import Icon from "@/components/Icon";
import PlayerStage from "@/components/PlayerStage";
import UnityPlayer from "@/components/UnityPlayer";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import styles from "./play.module.css";

const SITE_URL = "https://gamewhame.com";

export function generateStaticParams() {
  return getAllGames().map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const game = getGameBySlug(params.slug);
  if (!game) return { title: "Game not found" };
  const canonical = `/play/${game.slug}`;
  const ogTitle = `Play ${game.title} — free online ${game.category} game`;
  return {
    title: `Play ${game.title}`,
    description: game.description,
    keywords: [game.title, `${game.title} online`, `${game.category} games`, ...game.tags, "free game", "play online"],
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonical}`,
      siteName: "GameWhame",
      title: ogTitle,
      description: game.hook,
      images: [{ url: game.thumb, width: 1200, height: 1200, alt: game.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: game.hook,
      images: [game.thumb],
    },
  };
}

export default function PlayPage({ params }: { params: { slug: string } }) {
  const game = getGameBySlug(params.slug);
  if (!game) notFound();

  const related = getRelated(game, 12);
  const moreInCategory = getRelated(game, 30)
    .filter((g) => g.category === game.category)
    .slice(0, 12);
  const catSlug = categorySlug(game.category);
  const isUnity = game.engine === "unity-webgl" && Boolean(game.gameUrl);
  // Playable = a local build (playUrl) OR an externally-hosted build (gameUrl).
  const playable = Boolean(game.playUrl || game.gameUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    url: `${SITE_URL}/play/${game.slug}`,
    image: `${SITE_URL}${game.thumb}`,
    genre: game.categories,
    keywords: game.tags.join(", "),
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    gamePlatform: "Web Browser",
    playMode: "SinglePlayer",
    inLanguage: "en",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: game.rating.toFixed(1),
      ratingCount: game.playsNum,
      bestRating: "5",
      worstRating: "1",
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    publisher: { "@type": "Organization", name: "GameWhame", url: SITE_URL },
  };

  return (
    <div className={`gw-container ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className={styles.crumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <Icon name="caretRight" size={13} />
        <Link href={`/games/${catSlug}`}>{game.category}</Link>
        <Icon name="caretRight" size={13} />
        <b>{game.title}</b>
      </nav>

      {/* Status chips above the frame. */}
      <div className={styles.chips}>
        <span
          className={styles.catChip}
          style={{ ["--cat" as string]: `var(${categoryColorVar(game.category)})` } as React.CSSProperties}
        >
          <Icon name="tag" size={13} />
          {game.category}
        </span>
      </div>

      <div className={styles.grid}>
        {/* Left — the stage (client iframe lifecycle inside) + banner ad below. */}
        <div className={styles.stageCol}>
          {isUnity ? (
            <UnityPlayer game={game} relatedAnchor="related-games" />
          ) : (
            <PlayerStage game={game} relatedAnchor="related-games" />
          )}

          {/* Leaderboard banner directly below the player (never gates play).
              Price Optimiser managed Native container — id must be unique. */}
          <AdSlot variant="display" managedId={MANAGED_SLOT_IDS.leaderboard} height={90} className={styles.playerAd} />
        </div>

        {/* Right — game info. */}
        <aside className={styles.info}>
          <h1 className={styles.title}>{game.title}</h1>
          <p className={styles.desc}>{game.description}</p>

          {game.tags.length > 0 && (
            <ul className={styles.tags}>
              {game.tags.map((t) => (
                <li key={t}>
                  <Link href={`/games/${categorySlug(t)}`} className={styles.tag}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {/* THE P1 module — full width, right after the frame. */}
      <section id="related-games" className={styles.related}>
        <GameRail title="More Games Like This" icon="flame" games={related} priority />
      </section>

      {moreInCategory.length >= 4 && (
        <section className={styles.related}>
          <GameRail title={`More ${game.category} Games`} icon={playable ? "puzzle" : "gamepad"} games={moreInCategory} />
        </section>
      )}

      <section className={styles.related}>
        <RecentlyPlayed games={getAllGames()} currentSlug={game.slug} />
      </section>

      {/* Bottom-of-page Price Optimiser managed container, after the discovery
          rails. Second (and last) managed display id on this route — the page
          already owns #ad-leaderboard, and each id may appear only once. */}
      <AdSlot variant="display" managedId={MANAGED_SLOT_IDS.incontent} height={90} className={styles.bottomAd} />
    </div>
  );
}
