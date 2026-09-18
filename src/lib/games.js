import GAMES from "../data/games.json";

export { GAMES };
export const fmt = n => n.toLocaleString("en-US");
export const short = n => n >= 1000 ? (n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, "") + "K" : String(n);

export const byType = t => GAMES.filter(g => g.t === t);
export const topChart = t => [...byType(t)].sort((a, b) => b.p - a.p).slice(0, 12);
export const listFor = (t, cat) => cat === "Top Chart" ? topChart(t) : byType(t).filter(g => g.c.includes(cat));
export const pick = names => names.map(n => GAMES.find(g => g.n === n)).filter(Boolean);

/* Detail pages live at #game/<id>, the id being the last part of the Slypee link */
export const gameId = g => g.u.split("/").pop();
export const detailHref = g => `#game/${gameId(g)}`;
const BY_ID = new Map(GAMES.map(g => [gameId(g), g]));
export const byId = id => BY_ID.get(id);
export const similar = (g, n = 8) => {
  const same = GAMES.filter(x => x !== g && x.t === g.t && x.c.some(c => g.c.includes(c)));
  return same.sort((a, b) => b.p - a.p).slice(0, n);
};

/* HTML5 games open straight into the game; app games only have their Slypee download page */
export const playUrl = g => g.play || g.u;

/* Props for a Play link; HTML5 plays are tracked (see lib/history.js) */
export const playProps = g => ({ href: playUrl(g), "data-play": g.play ? gameId(g) : undefined });
/* Where "Resume" goes: straight into HTML5 games, to our detail page for app games */
export const launchProps = g => g.play ? playProps(g) : { href: detailHref(g) };
