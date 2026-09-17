"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "./Icon";
import { PlayTriangle } from "./BrandMarks";
import { searchGames } from "@/lib/games";
import type { Game } from "@/lib/types";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  variant?: "desktop" | "mobile";
  placeholder?: string;
  autoFocus?: boolean;
  showKbdHint?: boolean;
  /** Called after the user navigates away (e.g. to close a mobile overlay). */
  onNavigate?: () => void;
}

/**
 * SearchBox — pill input with a debounced (120ms) live fuzzy dropdown over the
 * catalog (the full /search page is another agent's surface). Enter submits to
 * /search?q=; selecting a result routes to that game's play page.
 */
export default function SearchBox({
  variant = "desktop",
  placeholder = "What are you playing today?",
  autoFocus = false,
  showKbdHint = true,
  onNavigate,
}: SearchBoxProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), 120);
    return () => window.clearTimeout(id);
  }, [value]);

  const results = useMemo<Game[]>(() => (debounced.trim() ? searchGames(debounced).slice(0, 6) : []), [debounced]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) go(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  const showDropdown = open && value.trim().length > 0;

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${styles[variant]}`}>
      <form className={styles.box} onSubmit={submit} role="search">
        <Icon name="search" size={20} color="var(--navy)" />
        <input
          className={styles.input}
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label="Search games"
          autoComplete="off"
          autoFocus={autoFocus}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        {showKbdHint && variant === "desktop" && <kbd className={styles.kbd}>Enter</kbd>}
      </form>

      {showDropdown && (
        <div className={styles.drop}>
          {results.length === 0 ? (
            <div className={styles.empty}>
              <Icon name="search" size={22} color="var(--muted-2)" />
              <span>No games match “{value}”. Try “puzzle”, “racing” or “word”.</span>
            </div>
          ) : (
            <>
              {results.map((g) => (
                <button key={g.slug} type="button" className={styles.item} onClick={() => go(`/play/${g.slug}`)}>
                  <span className={styles.thumb} style={{ background: `linear-gradient(140deg, var(--aqua), var(--navy))` }} />
                  <span className={styles.itemText}>
                    <b>{g.title}</b>
                    <small>
                      {g.category} <span aria-hidden>·</span>{" "}
                      <Icon name="star" weight="fill" size={11} color="var(--yellow)" /> {g.rating.toFixed(1)}
                    </small>
                  </span>
                  <span className={styles.itemPlay}>
                    <PlayTriangle size={13} color="var(--pink)" />
                  </span>
                </button>
              ))}
              <Link className={styles.seeAll} href={`/search?q=${encodeURIComponent(value.trim())}`} onClick={() => { setOpen(false); onNavigate?.(); }}>
                See all results
                <Icon name="caretRight" size={15} />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
