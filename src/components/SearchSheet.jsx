import { useEffect, useMemo, useRef, useState } from "react";
import { GAMES, fmt, short, detailHref } from "../lib/games.js";
import { searchGames, highlight } from "../lib/search.js";
import { CAT_ICONS, FlameIcon, PlayIcon, SearchIcon } from "./icons.jsx";
import { useT } from "../i18n/index.jsx";

const POPULAR = ["Zombie", "Racing", "Puzzle", "Ludo", "Shooter", "Football", "Cooking", "Idle"];
const CATS = ["Arcade", "Sports", "Card", "Strategy", "Puzzle"];
const TRENDING = [...GAMES].sort((a, b) => b.p - a.p).slice(0, 5);
const FILTERS = [["all", "search.all"], ["app", "search.games"], ["h5", null]];

/* Recent searches: per-viewer convenience, safe if storage is blocked */
const RECENT_KEY = "slypee.recent";
const loadRecent = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch (_) { return []; } };
const saveRecent = list => { try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch (_) {} };

function Row({ g, q, i, onPick }) {
  const t = useT();
  return (
    <li className="srow" style={{ "--i": Math.min(i, 12) }}>
      <a className="srow-main" href={detailHref(g)} onClick={onPick}>
        <img src={g.img} alt="" width="52" height="52" loading="lazy" />
        <span className="txt">
          <b dir="auto">{highlight(g.n, q).map(([s, m], k) => m ? <mark key={k}>{s}</mark> : s)}</b>
          <small>
            <span className="star">★ {g.r.toFixed(1)}</span>
            <span>{t(`cat.${g.c[0]}`)}</span>
            <span className="plays" title={fmt(g.p)}>{t("common.plays", { n: short(g.p) })}</span>
            {g.t === "h5" && <span className="badge">HTML5</span>}
          </small>
        </span>
      </a>
      <a className="btn-play" href={detailHref(g)} onClick={onPick}><PlayIcon />{t("common.play")}</a>
    </li>
  );
}

export default function SearchSheet({ initialType = "all", onClose }) {
  const t = useT();
  const [q, setQ] = useState("");
  const [type, setType] = useState(initialType);
  const [recent, setRecent] = useState(loadRecent);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const all = useMemo(() => searchGames(q), [q]);
  const counts = useMemo(() => ({ all: all.length, app: all.filter(g => g.t === "app").length, h5: all.filter(g => g.t === "h5").length }), [all]);
  const hits = type === "all" ? all : all.filter(g => g.t === type);
  const term = q.trim();

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { bodyRef.current?.scrollTo(0, 0); }, [q, type]);
  // lock page scroll behind the sheet
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => { html.style.overflow = prev; };
  }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);

  const remember = text => {
    const v = text.trim();
    if (!v) return;
    const next = [v, ...recent.filter(r => r.toLowerCase() !== v.toLowerCase())].slice(0, 6);
    setRecent(next); saveRecent(next);
  };
  const forget = text => { const next = recent.filter(r => r !== text); setRecent(next); saveRecent(next); };
  const clearRecent = () => { setRecent([]); saveRecent([]); };
  const run = text => { setQ(text); remember(text); inputRef.current?.focus(); };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={t("search.label")}>
        <div className="sheet-bar">
          <button type="button" className="icon-btn flip" aria-label={t("search.close")} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <form className="search" role="search" onSubmit={e => { e.preventDefault(); remember(q); inputRef.current?.blur(); }}>
            <SearchIcon />
            <input
              ref={inputRef} type="search" enterKeyHint="search" autoComplete="off" spellCheck="false"
              placeholder={t("search.placeholder", { n: GAMES.length })} aria-label={t("search.label")}
              value={q} onChange={e => setQ(e.target.value)}
            />
            {q && <button type="button" className="clear-btn" aria-label={t("search.clearLabel")} onClick={() => { setQ(""); inputRef.current?.focus(); }}>✕</button>}
          </form>
        </div>

        <div className="sheet-body" ref={bodyRef}>
          {!term ? (
            <>
              {recent.length > 0 && (
                <section className="sheet-sec">
                  <h3>{t("search.recent")} <button type="button" className="link-btn" onClick={clearRecent}>{t("search.clear")}</button></h3>
                  <ul className="recent">
                    {recent.map(r => (
                      <li key={r}>
                        <button type="button" className="recent-go" onClick={() => run(r)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>{r}
                        </button>
                        <button type="button" className="recent-x" aria-label={t("search.remove", { q: r })} onClick={() => forget(r)}>✕</button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section className="sheet-sec">
                <h3>{t("search.popular")}</h3>
                <div className="chips">{POPULAR.map(p => <button key={p} type="button" className="chip" onClick={() => run(p)}><FlameIcon />{p}</button>)}</div>
              </section>
              <section className="sheet-sec">
                <h3>{t("search.browse")}</h3>
                <div className="chips">{CATS.map(c => <button key={c} type="button" className="chip" onClick={() => run(c)}>{CAT_ICONS[c]}{t(`cat.${c}`)}</button>)}</div>
              </section>
              <section className="sheet-sec">
                <h3>{t("search.trending")}</h3>
                <ul className="slist">{TRENDING.map((g, i) => <Row key={g.u} g={g} q="" i={i} onPick={() => {}} />)}</ul>
              </section>
            </>
          ) : (
            <>
              <div className="filters" role="group" aria-label={t("search.filter")}>
                {FILTERS.map(([id, label]) => (
                  <button key={id} type="button" className="chip filter" aria-pressed={type === id} onClick={() => setType(id)}>
                    {label ? t(label) : "HTML5"} <span className="count">{counts[id]}</span>
                  </button>
                ))}
              </div>
              {hits.length ? (
                <section className="sheet-sec">
                  <p className="sheet-count" aria-live="polite">{t("search.count", { n: hits.length, q: term })}</p>
                  <ul className="slist">{hits.map((g, i) => <Row key={g.u} g={g} q={term} i={i} onPick={() => remember(q)} />)}</ul>
                </section>
              ) : (
                <section className="sheet-sec no-hits" aria-live="polite">
                  <span className="gi"><SearchIcon /></span>
                  <h3>{type !== "all" && all.length ? t("search.noneIn", { q: term, type: type === "h5" ? "HTML5" : t("search.games") }) : t("search.none", { q: term })}</h3>
                  {type !== "all" && all.length
                    ? <button type="button" className="btn-play" onClick={() => setType("all")}>{t("search.showAll", { n: all.length })}</button>
                    : <><p>{t("search.tryThese")}</p><div className="chips">{POPULAR.slice(0, 5).map(p => <button key={p} type="button" className="chip" onClick={() => run(p)}>{p}</button>)}</div></>}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
