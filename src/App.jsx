import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import NavTabs from "./components/NavTabs.jsx";
import Home from "./views/Home.jsx";
import Html5 from "./views/Html5.jsx";
import Library from "./views/Library.jsx";
import Profile from "./views/Profile.jsx";
import SearchSheet from "./components/SearchSheet.jsx";
import SubscribeSheet from "./components/SubscribeSheet.jsx";
import GameDetail from "./views/GameDetail.jsx";
import Petals from "./components/Petals.jsx";
import InfoPage from "./views/InfoPage.jsx";
import Plans from "./views/Plans.jsx";
import { INFO_PAGES } from "./content/info.js";
import { byId, gameId } from "./lib/games.js";
import { loadHistory, startPlay, finishPlay, rate, dur } from "./lib/history.js";
import {
  active, adoptFreeDay, applyReturn, captureCampaign, checkStatus, clearPending, clearSub,
  loadPending, loadSub, markPending, openSubscribeWindow, readMessage, readReturn
} from "./lib/subscription.js";
import { useT } from "./i18n/index.jsx";

const VIEWS = ["home", "html5", "library", "profile", "plans", ...INFO_PAGES];
/* Pages that hang off Profile, so the Profile tab stays lit while you're on them */
const UNDER_PROFILE = ["plans", ...INFO_PAGES];
// #home, #html5, #library, #profile, #plans, #faq/#help/#privacy/#terms, or #game/<id> for a game's detail page
const parseHash = () => {
  const h = location.hash.slice(1);
  if (h.startsWith("game/") && byId(h.slice(5))) return { view: "game", id: h.slice(5) };
  return { view: VIEWS.includes(h) ? h : "home" };
};

/* Prototype switch: a subscription good enough to show the header's other state */
/* Demo session & saved games: kept in this browser only */
const USER_KEY = "slypee.user";
const SAVED_KEY = "slypee.saved";
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
const store = (key, val) => { try { val == null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(val)); } catch (_) {} };

export default function App() {
  const t = useT();
  // `n` bumps on every navigation so re-tapping the current tab still scrolls to top
  const [nav, setNav] = useState(() => ({ ...parseHash(), n: 0 }));
  const go = useCallback(view => setNav(p => ({ view, n: p.n + 1 })), []);
  const view = nav.view;
  const navView = UNDER_PROFILE.includes(view) ? "profile" : view; // plan & info pages live under Profile

  // coming back from a game restores where you were on the list; otherwise jump to top
  const shown = useRef(new Set());
  const scrollMemo = useRef({});
  const prevView = useRef(view);
  useLayoutEffect(() => {
    const from = prevView.current;
    prevView.current = view;
    if (view === "game") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (from === "game" && scrollMemo.current[view] != null) window.scrollTo({ top: scrollMemo.current[view], behavior: "auto" });
    else window.scrollTo({ top: 0, behavior: shown.current.has(view) ? "smooth" : "auto" });
    shown.current.add(view);
    if (view !== "home") setResult(null);        // the "back from subscribing" card belongs to home
    if (view !== "plans") setPlanIntent(null);
    try { history.replaceState(null, "", "#" + view); } catch (_) {}
  }, [nav]);

  const [user, setUser] = useState(() => load(USER_KEY, null));
  useEffect(() => { store(USER_KEY, user); }, [user]);
  const logout = useCallback(() => setUser(null), []);


  /* The Slypee plan (lib/subscription.js): a mirror of the subscription Jazz runs.
     Logging out doesn't stop it — the subscription belongs to the number, not the browser tab. */
  const [sub, setSub] = useState(loadSub);
  useEffect(() => {
    // older demo accounts kept their free day on the user as `freeUntil`
    if (!user?.freeUntil) return;
    const carried = adoptFreeDay(user.freeUntil);
    setUser(u => { const { freeUntil, ...rest } = u; return rest; });
    if (carried) setSub(carried);
  }, [user?.freeUntil]);

  const [subSheet, setSubSheet] = useState(null);   // the "how do you want to subscribe" pop-up
  const [planIntent, setPlanIntent] = useState(null);  // "cancel" → open the stop step on #plans
  const [result, setResult] = useState(null);       // what came back from the subscription page
  const openSubscribe = useCallback(() => {
    setSubSheet({});
    try { if (!history.state?.subscribe) history.pushState({ subscribe: true }, ""); } catch (_) {}
  }, []);
  const closeSubscribe = useCallback(() => {
    if (history.state?.subscribe) history.back(); else setSubSheet(null);
  }, []);

  /* Warm every thumbnail after first paint so category switches never show empty tiles */
  const [warmAll, setWarmAll] = useState(false);
  useEffect(() => {
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 600));
    const warm = () => idle(() => setWarmAll(true));
    if (document.readyState === "complete") { warm(); return; }
    addEventListener("load", warm, { once: true });
    return () => removeEventListener("load", warm);
  }, []);

  /* Scroll: background parallax + back-to-top button */
  const worldRef = useRef(null);
  const [far, setFar] = useState(false);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!reduce) worldRef.current.style.setProperty("--para", `${-Math.min(scrollY * 0.05, innerHeight * 0.04)}px`);
        setFar(scrollY > 700);
      });
    };
    addEventListener("scroll", update, { passive: true });
    update();
    return () => { removeEventListener("scroll", update); cancelAnimationFrame(raf); };
  }, []);

  /* Search sheet: opens from any page, closes with the browser/phone back button too */
  const [search, setSearch] = useState(null);
  const openSearch = useCallback((type = "all") => {
    setSearch(s => s || { type });
    try { if (!history.state?.search) history.pushState({ search: true }, ""); } catch (_) {}
  }, []);
  const closeSearch = useCallback(() => {
    if (history.state?.search) history.back(); else setSearch(null);
  }, []);
  useEffect(() => {
    const onPop = () => { setSearch(null); setSubSheet(null); };
    // "/" or Ctrl/Cmd+K opens search on desktop
    const onKey = e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) { e.preventDefault(); openSearch(); }
    };
    addEventListener("popstate", onPop);
    addEventListener("keydown", onKey);
    return () => { removeEventListener("popstate", onPop); removeEventListener("keydown", onKey); };
  }, [openSearch]);

  /* Game detail: every game link points at #game/<id>; the real Slypee link is only used by its Play button */
  const searchRef = useRef(search);
  searchRef.current = search;
  const openGame = useCallback(id => {
    try {
      // opened from the search sheet → reuse its history entry so Back returns to the page, not the sheet
      if (searchRef.current) history.replaceState({ game: true }, "", "#game/" + id);
      else history.pushState({ game: true }, "", "#game/" + id);
    } catch (_) {}
    setSearch(null);
    setNav(p => {
      if (p.view !== "game") scrollMemo.current[p.view] = scrollY;
      return { view: "game", id, from: p.view === "game" ? p.from : p.view, n: p.n + 1 };
    });
  }, []);
  const leaveGame = useCallback(() => {
    if (history.state?.game) history.back(); else go(nav.from || "home");
  }, [go, nav.from]);
  useEffect(() => {
    const onClick = e => {
      const play = e.target.closest("a[data-play]");
      if (play) { setHistory(startPlay(play.dataset.play)); return; }
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href^="#game/"]');
      if (!a) return;
      e.preventDefault();
      openGame(a.getAttribute("href").slice(6));
    };
    const onPop = () => {
      const r = parseHash();
      setNav(p => p.view === r.view && p.id === r.id ? p : { ...r, from: p.from, n: p.n + 1 });
    };
    document.addEventListener("click", onClick);
    addEventListener("popstate", onPop);
    return () => { document.removeEventListener("click", onClick); removeEventListener("popstate", onPop); };
  }, [openGame]);

  const [saved, setSaved] = useState(() => load(SAVED_KEY, []));
  useEffect(() => { store(SAVED_KEY, saved); }, [saved]);

  const [toast, setToast] = useState({ msg: "", on: false });
  const toastT = useRef(0);
  const notify = useCallback(msg => {
    setToast({ msg, on: true });
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(t => ({ ...t, on: false })), 2600);
  }, []);

  /* One place that turns a subscription result into state, however it arrived: posted back by
     the subscription window, or carried on the URL when the browser blocked that window and
     the page came home by redirect. Either way the player lands on the home page, ready to
     play — this is a VAS sign-up, not a checkout with a receipt to read. */
  const subWindow = useRef(null);
  const answered = useRef(false);
  const goHome = useCallback(() => setNav(p => (p.view === "home" ? p : { view: "home", n: p.n + 1 })), []);
  const takeResult = useCallback(back => {
    answered.current = true;
    const applied = applyReturn(back);
    if (applied && back.action === "unsub") { setSub(applied); setResult(null); notify(t("toast.stopped")); }
    else if (applied) {
      setSub(applied);
      setResult(null);
      // a confirmed subscription is a signed-in player: the number it runs on is the account
      setUser(u => u || { msisdn: applied.msisdn || "", country: "" });
      notify(t("toast.subscribed"));
    }
    else setResult(back.state === "cancelled" ? "cancelled" : back.state === "failed" ? "failed" : "unknown");
    setSubSheet(null);
    goHome();
  }, [goHome, notify, t]);

  /* Opening the subscription page: its own window, so the portal stays put and picks the
     result up the moment it lands. If the window is closed without an answer, we say so
     rather than guess. */
  const startSubscribe = useCallback((action = "subscribe") => {
    answered.current = false;
    markPending(action);
    const win = openSubscribeWindow(action);          // null → it navigated this tab instead
    setSubSheet(null);
    if (!win) return;
    subWindow.current = win;
    const watch = setInterval(() => {
      if (!win.closed) return;
      clearInterval(watch);
      if (answered.current) return;
      clearPending();
      setResult("unknown");
      goHome();
    }, 700);
  }, [goHome]);

  useEffect(() => {
    const onMessage = e => {
      const back = readMessage(e.origin, e.data);
      if (!back) return;
      takeResult(back);
      try { subWindow.current?.close(); } catch (_) {}
    };
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, [takeResult]);

  /* Arrival, and the redirect fallback. A campaign's ref/var/camp are kept on arrival so they
     still reach the subscription page later; an organic visit just uses the defaults. */
  useEffect(() => {
    const search = location.search;
    captureCampaign(search);
    const tidy = () => { try { history.replaceState(null, "", location.pathname + "#home"); } catch (_) {} };
    const back = readReturn(search);
    if (back) { takeResult(back); tidy(); return; }
    if (loadPending()) { clearPending(); setResult("unknown"); goHome(); }
  }, []);

  /* "Check again" on the return card: in production this is Jazz's status API answering */
  const refreshStatus = useCallback(async () => {
    const fresh = await checkStatus();
    if (fresh) { setSub(fresh); setResult(null); notify(t("toast.subscribed")); }
    else notify(t("toast.stillWaiting"));
  }, [t, notify]);

  /* Play tracking: a Play tap starts a session, coming back to our page ends it.
     (named playHistory so it never shadows window.history, which the routing above relies on) */
  const [playHistory, setHistory] = useState(loadHistory);
  const [returned, setReturned] = useState(null);
  useEffect(() => {
    const done = () => {
      const r = finishPlay();
      setHistory(r.history);
      if (r.returned) setReturned(r.returned);
    };
    done();
    const onShow = e => { if (e.persisted) done(); };
    addEventListener("pageshow", onShow);
    return () => removeEventListener("pageshow", onShow);
  }, []);
  // back on the game's own page → it shows a welcome-back card; anywhere else → a toast
  useEffect(() => {
    if (!returned || (view === "game" && nav.id === returned.id)) return;
    notify(t("toast.back", { name: byId(returned.id).n, time: dur(returned.secs, t) }));
    setReturned(null);
  }, [returned, view, nav.id, notify, t]);
  const onRate = useCallback((g, stars) => { setHistory(rate(gameId(g), stars)); notify(t("toast.thanks")); }, [notify, t]);

  const toggleSave = useCallback(g => {
    if (!user) return notify(t("toast.loginToSave"));
    const id = gameId(g);
    const on = saved.includes(id);
    setSaved(on ? saved.filter(x => x !== id) : [id, ...saved]);
    notify(t(on ? "toast.removed" : "toast.saved"));
  }, [user, saved, notify, t]);
  const game = view === "game" ? byId(nav.id) : null;

  return (
    <>
      <div className="world" aria-hidden="true" ref={worldRef}></div>
      <Petals />
      <Header view={navView} go={go} loggedIn={!!user} />
      <main>
        <Home
          active={view === "home"} go={go} warmAll={warmAll} user={user} openSearch={openSearch} history={playHistory}
          sub={sub} subscribed={active(sub)} onSubscribe={openSubscribe}
          result={result} onRetry={openSubscribe} onStatus={refreshStatus} clearResult={() => setResult(null)}
        />
        <Html5 active={view === "html5"} warmAll={warmAll} openSearch={openSearch} />
        <Library active={view === "library"} user={user} go={go} saved={saved.map(byId).filter(Boolean)} history={playHistory} />
        <Profile active={view === "profile"} user={user} login={setUser} logout={logout} notify={notify} history={playHistory} go={go} />
        {view === "plans" && (
          <Plans
            sub={sub} intent={planIntent} onSubscribe={openSubscribe} clearIntent={() => setPlanIntent(null)}
            go={go} back={() => { setResult(null); go("profile"); }}
          />
        )}
        {INFO_PAGES.includes(view) && (
          <InfoPage
            key={view} id={view} go={go} notify={notify} back={() => go("profile")}
            onClearData={() => { setUser(null); setSaved([]); setHistory({}); clearSub(); setSub(null); }}
          />
        )}
        {game && (
          <GameDetail
            key={nav.id} g={game} back={leaveGame} saved={saved.includes(nav.id)} toggleSave={toggleSave} notify={notify}
            played={playHistory[nav.id]} returned={returned?.id === nav.id ? returned.secs : 0} dismissReturn={() => setReturned(null)} onRate={onRate}
            onPlan={active(sub) ? null : () => openSubscribe()}
          />
        )}
      </main>
      <div className="bottom"><nav aria-label="Main"><NavTabs view={navView} go={go} loggedIn={!!user} /></nav></div>
      <button type="button" className={"to-top" + (far ? " on" : "")} aria-label={t("common.backToTop")} tabIndex={far ? 0 : -1} onClick={() => scrollTo({ top: 0, behavior: "smooth" })}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" /></svg>
      </button>
      {search && <SearchSheet initialType={search.type} onClose={closeSearch} />}
      {subSheet && <SubscribeSheet onPick={() => startSubscribe("subscribe")} onClose={closeSubscribe} />}
      <div className={"toast" + (toast.on ? " on" : "")} role="status">{toast.msg}</div>
    </>
  );
}
