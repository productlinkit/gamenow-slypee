import { launchProps, detailHref } from "../lib/games.js";
import { recent, ago, dur } from "../lib/history.js";
import { Reveal } from "../lib/reveal.jsx";
import { NAV, PlayIcon } from "../components/icons.jsx";
import GameCard from "../components/GameCard.jsx";

const LIB_ICON = NAV.find(n => n.id === "library").icon;

/* Games this browser has played, newest first */
function Played({ list }) {
  return (
    <Reveal className="card-panel cont" i={1}>
      {list.map(e => (
        <div key={e.g.u} className="crow">
          <a href={detailHref(e.g)}><img src={e.g.img} alt="" width="54" height="54" loading="lazy" /></a>
          <div className="txt">
            <h3><a href={detailHref(e.g)}>{e.g.n}</a></h3>
            <small>Played {e.count}×{e.secs ? ` · ${dur(e.secs)}` : ""} · {ago(e.last)}</small>
          </div>
          <a className="btn-play" {...launchProps(e.g)}><PlayIcon />{e.g.play ? "Play" : "Open"}</a>
        </div>
      ))}
    </Reveal>
  );
}

export default function Library({ active, user, go, saved, history }) {
  const played = recent(history);

  if (!user) {
    return (
      <div className="view" hidden={!active}>
        {played.length > 0 && (
          <section>
            <Reveal className="head"><h2 className="title">Recently <span className="hot">Played</span></h2></Reveal>
            <Played list={played} />
          </section>
        )}
        <section className="centered">
          {!played.length && <Reveal className="head"><h2 className="title">Your <span className="hot">Library</span></h2></Reveal>}
          <Reveal className="card-panel empty-state narrow" i={1}>
            <span className="gi">{LIB_ICON}</span>
            <h2>{played.length ? "Keep your games everywhere" : "Nothing here yet"}</h2>
            <p>{played.length
              ? "Your history is only saved on this device. Log in to save games and keep your progress."
              : "Log in to keep track of the games you play and pick up right where you left off."}</p>
            <button type="button" className="btn-play" onClick={() => go("profile")}>Log in</button>
            {!played.length && <button type="button" className="link-btn" onClick={() => go("home")}>Browse games first</button>}
          </Reveal>
        </section>
      </div>
    );
  }

  return (
    <div className="view" hidden={!active}>
      <div className="two">
        <section>
          <Reveal className="head"><h2 className="title">Recently <span className="hot">Played</span></h2></Reveal>
          {played.length
            ? <Played list={played} />
            : <Reveal as="p" className="card-panel saved-empty" i={1}>No games played yet. Open any game and tap <b>Play Now</b> — it will show up here.</Reveal>}
        </section>
        <section>
          <Reveal className="head"><h2 className="title">Saved</h2></Reveal>
          {saved.length
            ? <div className="grid">{saved.map((g, k) => <GameCard key={g.u} g={g} i={k} />)}</div>
            : <Reveal as="p" className="card-panel saved-empty" i={1}>No saved games yet. Open any game and tap <b>♥</b> to keep it here.</Reveal>}
        </section>
      </div>
    </div>
  );
}
