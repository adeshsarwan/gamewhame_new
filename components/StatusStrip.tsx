"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { favoriteCount, FAVS_EVENT } from "@/lib/favorites";
import styles from "./StatusStrip.module.css";

/** Home top strip — mini status pills (docs/02 §3.1). "Saved" count is live. */
export default function StatusStrip({ total, trending }: { total: number; trending: number }) {
  const [saved, setSaved] = useState(0);
  useEffect(() => {
    const sync = () => setSaved(favoriteCount());
    sync();
    window.addEventListener(FAVS_EVENT, sync);
    return () => window.removeEventListener(FAVS_EVENT, sync);
  }, []);

  return (
    <div className={styles.strip}>
      <span className={styles.pill}>
        <span className={styles.live} aria-hidden />
        <b>LIVE</b> · {total} free games
      </span>
      <span className={styles.pill}>
        <Icon name="lightning" weight="fill" size={14} color="var(--yellow)" />
        No downloads
      </span>
      <span className={styles.pill}>
        <Icon name="flame" weight="fill" size={14} color="var(--pink)" />
        {trending} trending now
      </span>
      <span className={styles.pill}>
        <Icon name="heart" weight="fill" size={14} color="var(--pink)" />
        {saved} saved
      </span>
    </div>
  );
}
