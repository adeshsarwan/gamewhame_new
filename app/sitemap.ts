import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { getAllGames } from "@/lib/games";

const SITE_URL = "https://gamewhame.com";

/**
 * Full site map: home, every category (incl. the virtual popular/new rows),
 * every game's play page, and the legal/info routes. Static params only — no
 * per-request data — so this is generated once at build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
  ];

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/games/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const games: MetadataRoute.Sitemap = getAllGames().map((g) => ({
    url: `${SITE_URL}/play/${g.slug}`,
    lastModified: g.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const legal: MetadataRoute.Sitemap = [
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
    "/cookie-policy",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...home, ...categories, ...games, ...legal];
}
