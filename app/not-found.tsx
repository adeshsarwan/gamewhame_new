import Link from "next/link";
import { getPopularGames } from "@/lib/games";
import GameRail from "@/components/GameRail";
import Icon from "@/components/Icon";
import styles from "./not-found.module.css";

/** 404 — keeps the discover loop alive with a popular rail. */
export default function NotFound() {
  const popular = getPopularGames(12);
  return (
    <div className={`gw-container ${styles.wrap}`}>
      <div className={styles.hero}>
        <span className={styles.chip}>
          <Icon name="gamepad" weight="fill" size={34} color="#fff" />
        </span>
        <h1 className={styles.code}>404</h1>
        <p className={styles.msg}>That game wandered off. Let&apos;s find you another.</p>
        <Link href="/" className={styles.cta}>
          Back to the arcade
          <Icon name="caretRight" size={16} />
        </Link>
      </div>
      <GameRail title="Popular right now" icon="flame" games={popular} />
    </div>
  );
}
