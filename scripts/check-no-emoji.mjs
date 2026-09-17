#!/usr/bin/env node
/**
 * GameWhame no-emoji gate.
 * Scans app/, components/, lib/ source for emoji literals and fails the process
 * if any are found. Enforces CLAUDE.md's hard rule: every glyph is a real SVG.
 *
 * Run: `npm run check:emoji`
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".mjs"]);

// Pictographic + dingbat + transport + supplemental-symbols ranges, plus the
// variation selector and zero-width joiner that build compound emoji.
// Deliberately excludes plain typographic arrows used in copy is NOT allowed
// either per spec, but we keep the set to true emoji to avoid false positives
// on math/pseudo-code. Section glyphs like § and bullet • are allowed.
// True pictographic emoji only. Plain arrows (U+2190–21FF) and dingbats used
// as typography are intentionally NOT included — CLAUDE.md bans emoji glyphs,
// not every non-ASCII character.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F0FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{200D}]/u;

let hits = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === ".next") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (EXTS.has(extname(name))) scan(full);
  }
}

function scan(file) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (EMOJI.test(line)) {
      hits.push(`${file}:${i + 1}  ${line.trim().slice(0, 80)}`);
    }
  });
}

for (const r of ROOTS) walk(r);

if (hits.length) {
  console.error("\x1b[31mEmoji found in source (banned by CLAUDE.md):\x1b[0m");
  for (const h of hits) console.error("  " + h);
  console.error(`\n${hits.length} emoji literal(s) found. Replace with the <Icon> component or a real SVG.`);
  process.exit(1);
}

console.log("\x1b[32mNo emoji in source. Clean.\x1b[0m");
