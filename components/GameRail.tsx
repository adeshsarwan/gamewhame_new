"use client";

import { useRef } from "react";
import type { Game, IconName } from "@/lib/types";
import GameCard from "./GameCard";
import SectionHeader from "./SectionHeader";
import styles from "./GameRail.module.css";

interface GameRailProps {
  title: string;
  icon: IconName;
  subtitle?: string;
  games: Game[];
  seeAllHref?: string;
  iconColor?: string;
  priority?: boolean;
}

/** GameRail — SectionHeader + horizontal snap-scroll row of square cards. */
export default function GameRail({
  title,
  icon,
  subtitle,
  games,
  seeAllHref,
  iconColor,
  priority = false,
}: GameRailProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  }

  if (!games.length) return null;

  return (
    <section className={styles.rail}>
      <SectionHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        iconColor={iconColor}
        seeAllHref={seeAllHref}
        onScrollLeft={() => scrollBy(-1)}
        onScrollRight={() => scrollBy(1)}
      />
      <ul ref={trackRef} className={`${styles.track} gw-noscrollbar`}>
        {games.map((g, i) => (
          <li key={g.slug} className={styles.item}>
            <GameCard game={g} size="s" context="rail" priority={priority && i < 3} />
          </li>
        ))}
      </ul>
    </section>
  );
}
