import { launchProps, detailHref } from "../lib/games.js";
import { recent, ago, dur } from "../lib/history.js";
import { Reveal } from "../lib/reveal.jsx";
import { NAV, PlayIcon } from "../components/icons.jsx";
import GameCard from "../components/GameCard.jsx";
import { Title, useT } from "../i18n/index.jsx";

const LIB_ICON = NAV.find(n => n.id === "library").icon;

/* Games this browser has played, newest first */
function Played({ list }) {
  const t = useT();
  return (
    <Reveal className="card-panel cont" i={1}>
      {list.map(e => (
        <div key={e.g.u} className="crow">
          <a href={detailHref(e.g)}><img src={e.g.img} alt="" width="54" height="54" loading="lazy" /></a>
          <div className="txt">
            <h3 dir="auto"><a href={detailHref(e.g)}>{e.g.n}</a></h3>
            <small>{t("home.played", { n: e.count })}{e.secs ? ` · ${dur(e.secs, t)}` : ""} · {ago(e.last, t)}</small>
          </div>
          <a className="btn-play" {...launchProps(e.g)}><PlayIcon />{t(e.g.play ? "common.play" : "common.open")}</a>
        </div>
      ))}
    </Reveal>
  );
}

export default function Library({ active, user, go, saved, history }) {
  const t = useT();
  const played = recent(history);

  if (!user) {
    return (
      <div className="view" hidden={!active}>
        {played.length > 0 && (
          <section>
            <Reveal className="head"><h2 className="title"><Title k="title.recent" /></h2></Reveal>
            <Played list={played} />
          </section>
        )}
        <section className="centered">
          {!played.length && <Reveal className="head"><h2 className="title"><Title k="title.library" /></h2></Reveal>}
          <Reveal className="card-panel empty-state narrow" i={1}>
            <span className="gi">{LIB_ICON}</span>
            <h2>{t(played.length ? "lib.keepTitle" : "lib.emptyTitle")}</h2>
            <p>{t(played.length ? "lib.keepText" : "lib.emptyText")}</p>
            <button type="button" className="btn-play" onClick={() => go("profile")}>{t("common.login")}</button>
            {!played.length && <button type="button" className="link-btn" onClick={() => go("home")}>{t("lib.browse")}</button>}
          </Reveal>
        </section>
      </div>
    );
  }

  return (
    <div className="view" hidden={!active}>
      <div className="two">
        <section>
          <Reveal className="head"><h2 className="title"><Title k="title.recent" /></h2></Reveal>
          {played.length
            ? <Played list={played} />
            : <Reveal as="p" className="card-panel saved-empty" i={1}>{t("lib.recentEmpty")}</Reveal>}
        </section>
        <section>
          <Reveal className="head"><h2 className="title"><Title k="title.saved" /></h2></Reveal>
          {saved.length
            ? <div className="grid">{saved.map((g, k) => <GameCard key={g.u} g={g} i={k} />)}</div>
            : <Reveal as="p" className="card-panel saved-empty" i={1}>{t("lib.savedEmpty")}</Reveal>}
        </section>
      </div>
    </div>
  );
}
