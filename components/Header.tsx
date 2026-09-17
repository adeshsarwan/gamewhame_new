"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "./BrandMarks";
import SearchBox from "./SearchBox";
import IconButton from "./IconButton";
import CategoryPill from "./CategoryPill";
import Icon from "./Icon";
import { favoriteCount, FAVS_EVENT } from "@/lib/favorites";
import { CATEGORIES } from "@/lib/categories";
import { OPEN_SEARCH_EVENT } from "./MobileBottomNav";
import styles from "./Header.module.css";

/** Header — sticky brand + search + favorites/profile. Hosts the mobile search
 *  overlay and the mobile menu drawer. */
export default function Header() {
  const [favCount, setFavCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sync = () => setFavCount(favoriteCount());
    sync();
    window.addEventListener(FAVS_EVENT, sync);
    return () => window.removeEventListener(FAVS_EVENT, sync);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }
    const openSearch = () => setSearchOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, openSearch);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, openSearch);
    };
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} aria-label="GameWhame home">
            <LogoMark size={38} />
            <span className={styles.word}>
              <b>
                Game<i>Whame</i>
              </b>
              <small>GAMEWHAME.COM</small>
            </span>
          </Link>

          <div className={styles.search}>
            <SearchBox variant="desktop" placeholder="Search 50+ free games…" />
          </div>

          <div className={styles.actions}>
            <span className={styles.mobileOnly}>
              <IconButton icon="search" label="Search games" variant="header" onClick={() => setSearchOpen(true)} />
            </span>
            <IconButton icon="heart" label="Favorites" href="/favorites" variant="header" badge={favCount} />
            <Link href="/favorites" className={styles.profile} aria-label="Guest profile">
              <Icon name="user" size={19} />
              <span className={styles.profileLabel}>Guest</span>
            </Link>
            <span className={styles.mobileOnly}>
              <IconButton icon="menu" label="Menu" variant="header" onClick={() => setMenuOpen(true)} />
            </span>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      <div className={`${styles.overlay} ${searchOpen ? styles.overlayOpen : ""}`} role="dialog" aria-label="Search" aria-hidden={!searchOpen}>
        <div className={styles.overlayTop}>
          <SearchBox variant="mobile" autoFocus={searchOpen} showKbdHint={false} onNavigate={() => setSearchOpen(false)} />
          <IconButton icon="close" label="Close search" onClick={() => setSearchOpen(false)} />
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div className={`${styles.scrim} ${menuOpen ? styles.scrimOpen : ""}`} onClick={() => setMenuOpen(false)} aria-hidden />
      <aside className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`} aria-label="Categories menu" aria-hidden={!menuOpen}>
        <div className={styles.drawerHead}>
          <span className={styles.drawerTitle}>Browse</span>
          <IconButton icon="close" label="Close menu" onClick={() => setMenuOpen(false)} />
        </div>
        <div className={styles.drawerPills} onClick={() => setMenuOpen(false)}>
          <CategoryPill label="All Games" href="/" icon="grid" />
          {CATEGORIES.map((c) => (
            <CategoryPill key={c.slug} label={c.label} href={`/games/${c.slug}`} color={c.colorVar} />
          ))}
        </div>
      </aside>
    </>
  );
}
