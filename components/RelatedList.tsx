import Link from "next/link";
import type { Game } from "@/lib/types";
import Thumb from "./Thumb";
import Icon from "./Icon";
import styles from "./RelatedList.module.css";

/**
 * RelatedList — compact vertical list of related games for the desktop sidebar,
 * placing loop-B discovery above the fold right beside the frame. Rows link
 * straight to /play/[slug]; the InterstitialGate wrapping the page catches the
 * click for the between-games cap.
 */
export default function RelatedList({ games, title = "You might also like" }: { games: Game[]; title?: string }) {
  if (!games.length) return null;
  return (
    <div className={styles.box}>
      <div className={styles.head}>
        <span className={styles.chip}>
          <Icon name="flame" weight="fill" size={16} color="#fff" />
        </span>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <ul className={styles.list}>
        {games.map((g) => (
          <li key={g.slug}>
            <Link href={`/play/${g.slug}`} className={styles.row} aria-label={`Play ${g.title}`}>
              <span className={styles.art}>
                <Thumb game={g} sizes="72px" />
                {g.playUrl === null && <span className={styles.soon}>Soon</span>}
              </span>
              <span className={styles.body}>
                <b className={styles.name}>{g.title}</b>
                <small className={styles.meta}>{g.category}</small>
              </span>
              <span className={styles.go} aria-hidden>
                <Icon name="caretRight" size={16} color="var(--muted)" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
