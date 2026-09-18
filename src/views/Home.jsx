import { topChart, detailHref, launchProps } from "../lib/games.js";
import { recent, ago, dur } from "../lib/history.js";
import SearchBar from "../components/SearchBar.jsx";
import InstantBanner from "../components/InstantBanner.jsx";
import { Reveal } from "../lib/reveal.jsx";
import { AvatarIcon, PlayIcon } from "../components/icons.jsx";
import GameCard from "../components/GameCard.jsx";
import Trending from "../components/Trending.jsx";
import CategoryBrowser from "../components/CategoryBrowser.jsx";

const APP_CATS = ["Top Chart", "Arcade", "Sports", "Card", "Strategy", "Puzzle"];
const H5_PREVIEW = topChart("h5").slice(0, 12);

/* Continue playing: the last game this browser played */
function Resume({ e }) {
  const { g } = e;
  return (
    <Reveal as="a" className="resume" {...launchProps(g)} i={1}>
      <img src={g.img} alt="" width="44" height="44" />
      <span className="txt">
        <small>Continue playing · {ago(e.last)}</small>
        <b>{g.n}</b>
        <span className="rmeta">Played {e.count}×{e.secs ? ` · ${dur(e.secs)}` : ""}</span>
      </span>
      <span className="btn-play"><PlayIcon />{g.play ? "Resume" : "Open"}</span>
    </Reveal>
  );
}

function RecentRow({ list }) {
  return (
    <section>
      <Reveal className="head"><h2 className="title">Recently <span className="hot">Played</span></h2></Reveal>
      <div className="rp-track">
        {list.map((e, i) => (
          <Reveal as="a" key={e.g.u} className="rp-card" href={detailHref(e.g)} i={i}>
            <img src={e.g.img} alt="" width="84" height="84" loading="lazy" />
            <b>{e.g.n}</b>
            <small>{ago(e.last)}</small>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function GuestBanner({ go }) {
  return (
    <Reveal className="guest" i={1}>
      <span className="gi"><AvatarIcon /></span>
      <span className="txt"><b>Playing as guest</b><small>Log in to save your progress and get 1 day of free play</small></span>
      <button type="button" className="btn-play" onClick={() => go("profile")}>Log in</button>
    </Reveal>
  );
}

export default function Home({ active, go, warmAll, user, openSearch, history }) {
  const played = recent(history);
  return (
    <div className="view" hidden={!active}>
      <div className="hero">
        <SearchBar onOpen={() => openSearch()} />
        {played[0] && <Resume e={played[0]} />}
        {!user && <GuestBanner go={go} />}
      </div>

      {played.length > 1 && <RecentRow list={played.slice(0, 10)} />}

      <Trending active={active} />

      <section id="appGames">
        <Reveal className="head"><h2 className="title">Games</h2></Reveal>
        <CategoryBrowser type="app" cats={APP_CATS} cap={12} warmAll={warmAll} />
      </section>

      <section id="h5Preview">
        <Reveal className="head">
          <h2 className="title">HTML5 <span className="hot">Games</span></h2>
          <button className="more" type="button" onClick={() => go("html5")}>See more</button>
        </Reveal>
        <InstantBanner />
        <div className="grid">{H5_PREVIEW.map((g, k) => <GameCard key={g.u} g={g} i={k} />)}</div>
      </section>

      <Reveal className="lockup">
        <img className="gn" src="/assets/gamenow-logo.png" alt="GameNow" width="547" height="65" /><span className="x">✕</span>
        <img src="/assets/slypee-logo.png" alt="Slypee" width="310" height="130" />
      </Reveal>
    </div>
  );
}
