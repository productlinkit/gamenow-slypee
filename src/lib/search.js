import { GAMES } from "./games.js";

const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

// allow one typo (insert/delete/substitute) for words of 4+ letters
function near(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

const INDEX = GAMES.map(g => {
  const name = norm(g.n);
  return {
    g, name,
    compact: name.replace(/ /g, ""),
    words: name.split(" "),
    cats: g.c.map(norm),
    kind: g.t === "h5" ? "html5 h5 browser instant" : "game app download"
  };
});

function scoreToken(e, t) {
  if (e.name.startsWith(t)) return 40;
  if (e.words.some(w => w.startsWith(t))) return 25;
  if (e.name.includes(t) || e.compact.includes(t)) return 12;
  // categories/type need a full word or 4+ letters, so "car" doesn't pull in every Card game
  const loose = w => w === t || (t.length >= 4 && w.startsWith(t));
  if (e.cats.some(loose)) return 8;
  if (e.kind.split(" ").some(loose)) return 4;
  if (t.length >= 4 && e.words.some(w => near(w.slice(0, t.length + 1), t) || near(w, t))) return 6;
  return 0;
}

/* Every word of the query must match the name, a category or the type; best matches first, then most played */
export function searchGames(query) {
  const tokens = norm(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];
  const out = [];
  for (const e of INDEX) {
    let score = 0;
    for (const t of tokens) {
      const s = scoreToken(e, t);
      if (!s) { score = 0; break; }
      score += s;
    }
    if (score) out.push({ g: e.g, score });
  }
  return out.sort((a, b) => b.score - a.score || b.g.p - a.g.p).map(r => r.g);
}

/* Split a name into [text, isMatch] parts for highlighting */
export function highlight(name, query) {
  const lower = name.toLowerCase();
  const ranges = [];
  for (const t of query.toLowerCase().split(/\s+/).filter(Boolean)) {
    let at = lower.indexOf(t);
    while (at !== -1) { ranges.push([at, at + t.length]); at = lower.indexOf(t, at + t.length); }
  }
  if (!ranges.length) return [[name, false]];
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [ranges[0]];
  for (const r of ranges.slice(1)) {
    const last = merged[merged.length - 1];
    if (r[0] <= last[1]) last[1] = Math.max(last[1], r[1]); else merged.push(r);
  }
  const parts = [];
  let pos = 0;
  for (const [a, b] of merged) {
    if (a > pos) parts.push([name.slice(pos, a), false]);
    parts.push([name.slice(a, b), true]);
    pos = b;
  }
  if (pos < name.length) parts.push([name.slice(pos), false]);
  return parts;
}
