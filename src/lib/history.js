import { byId } from "./games.js";

/* Play history, kept in this browser.
   The games run on Slypee's own site, so we can't see inside them — we record the Play tap,
   then when the player comes back we count the time they were away as play time. */
const HISTORY_KEY = "slypee.history";   // { [gameId]: { count, last, secs, rating } }
const SESSION_KEY = "slypee.session";   // { id, start } while a game is open
const MAX_SESSION = 3 * 60 * 60;        // longer than 3h away = left the game open, don't count it
const MIN_SESSION = 5;

const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
const write = (key, val) => { try { val == null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(val)); } catch (_) {} };

export const loadHistory = () => read(HISTORY_KEY, {});

export function startPlay(id) {
  const history = loadHistory();
  const e = history[id] || { count: 0, secs: 0 };
  const next = { ...history, [id]: { ...e, count: e.count + 1, last: Date.now() } };
  write(HISTORY_KEY, next);
  write(SESSION_KEY, { id, start: Date.now() });
  return next;
}

/* Call when our page is shown again; returns { history, returned: { id, secs } | null } */
export function finishPlay() {
  const history = loadHistory();
  const s = read(SESSION_KEY, null);
  if (!s || !byId(s.id)) { write(SESSION_KEY, null); return { history, returned: null }; }
  write(SESSION_KEY, null);
  const secs = Math.round((Date.now() - s.start) / 1000);
  if (secs < MIN_SESSION) return { history, returned: null };
  const counted = secs <= MAX_SESSION ? secs : 0;
  const e = history[s.id] || { count: 1, secs: 0, last: s.start };
  const next = { ...history, [s.id]: { ...e, secs: (e.secs || 0) + counted } };
  write(HISTORY_KEY, next);
  return { history: next, returned: counted ? { id: s.id, secs: counted } : null };
}

export function rate(id, stars) {
  const history = loadHistory();
  const next = { ...history, [id]: { ...(history[id] || { count: 0, secs: 0 }), rating: stars } };
  write(HISTORY_KEY, next);
  return next;
}

export const recent = history => Object.entries(history)
  .filter(([id, e]) => byId(id) && e.last)
  .sort((a, b) => b[1].last - a[1].last)
  .map(([id, e]) => ({ g: byId(id), ...e }));

export function stats(history) {
  const list = recent(history);
  const secs = list.reduce((t, e) => t + (e.secs || 0), 0);
  const byCat = {};
  for (const e of list) for (const c of e.g.c) byCat[c] = (byCat[c] || 0) + e.count;
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  return { games: list.length, plays: list.reduce((t, e) => t + e.count, 0), secs, topGenre: top ? top[0] : null };
}

export function ago(ts, t) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return t("time.now");
  if (m < 60) return t("time.min", { n: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t("time.h", { n: h });
  const d = Math.floor(h / 24);
  return d === 1 ? t("time.yesterday") : t("time.days", { n: d });
}

export function dur(secs, t) {
  if (!secs) return t("dur.min", { n: 0 });
  const m = Math.round(secs / 60);
  if (m < 1) return t("dur.lt1");
  if (m < 60) return t("dur.min", { n: m });
  return t("dur.hm", { h: Math.floor(m / 60), m: m % 60 });
}
