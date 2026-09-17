"use client";

// Small client-only helper used by the search landing page (docs/02 §3.3,
// "optional: recent searches from localStorage"). Two pieces so the server
// page stays simple: `RecordSearch` writes the current query on mount and
// renders nothing; `RecentSearchChips` reads the list back and renders chips.
// Never touches localStorage during render — both start empty on the server.
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import styles from "./RecentSearches.module.css";

const KEY = "gw_recent_searches";
const MAX = 6;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function record(term: string): void {
  if (typeof window === "undefined") return;
  try {
    const cur = read().filter((t) => t.toLowerCase() !== term.toLowerCase());
    cur.unshift(term);
    window.localStorage.setItem(KEY, JSON.stringify(cur.slice(0, MAX)));
  } catch {
    /* storage blocked (private mode) — degrade silently */
  }
}

/** Records the current query into localStorage once it lands. Renders nothing. */
export function RecordSearch({ q }: { q: string }) {
  useEffect(() => {
    if (q.trim().length > 1) record(q.trim());
  }, [q]);
  return null;
}

/** Recent-search chips — hydrated client-side, absent until localStorage has entries. */
export function RecentSearchChips() {
  const [terms, setTerms] = useState<string[]>([]);

  useEffect(() => {
    setTerms(read());
  }, []);

  if (!terms.length) return null;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>
        <Icon name="clock" size={14} color="var(--muted)" />
        Recent
      </span>
      <div className={styles.chips}>
        {terms.map((t) => (
          <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className={styles.chip}>
            {t}
          </Link>
        ))}
      </div>
    </div>
  );
}
