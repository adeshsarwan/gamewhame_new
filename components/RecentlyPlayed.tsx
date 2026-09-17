"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/lib/types";
import GameRail from "./GameRail";

const RECENT_KEY = "gw_recent";

/**
 * RecentlyPlayed — retention hook. Reads the `gw_recent` MRU slug list written by
 * PlayerStage on Play and renders a rail of those games (excluding the current
 * one). Client-only: renders nothing on the server, then hydrates from storage
 * after mount so there is no hydration mismatch and no layout shift.
 */
export default function RecentlyPlayed({ games, currentSlug }: { games: Game[]; currentSlug: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    function load() {
      try {
        const raw = window.localStorage.getItem(RECENT_KEY);
        setSlugs(raw ? (JSON.parse(raw) as string[]) : []);
      } catch {
        setSlugs([]);
      }
    }
    load();
    window.addEventListener("gw-recent-changed", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("gw-recent-changed", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const bySlug = new Map(games.map((g) => [g.slug, g]));
  const list = slugs
    .filter((s) => s !== currentSlug)
    .map((s) => bySlug.get(s))
    .filter((g): g is Game => Boolean(g));

  if (list.length < 2) return null; // need a couple to be worth a rail

  return <GameRail title="Recently played" icon="clock" games={list} />;
}
