// Favorites (docs/02 §3.5) — owned by the favorites agent.
// This shell stays a server component so it can export metadata; all
// localStorage-driven behavior lives in the client FavoritesView component
// (never read localStorage during render — see lib/favorites.ts gotcha).
import type { Metadata } from "next";
import FavoritesView from "@/components/FavoritesView";
import styles from "./favorites.module.css";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "The games you've saved on this device. Tap the heart on any tile to add more — no account needed.",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className={`gw-container ${styles.page}`}>
      <FavoritesView />
    </div>
  );
}
