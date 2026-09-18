import { useEffect, useState } from "react";
import { fmt, short, similar, playProps, detailHref } from "../lib/games.js";
import { ago, dur } from "../lib/history.js";
import { Reveal } from "../lib/reveal.jsx";
import { PlayIcon } from "../components/icons.jsx";
import GameCard from "../components/GameCard.jsx";

const ABOUT = {
  Arcade: "Quick rounds, simple controls and plenty of action — easy to pick up, hard to put down.",
  Puzzle: "Train your brain with satisfying levels that get trickier the further you go.",
  Sports: "Jump into the match, time your moves and chase the top score.",
  Card: "Classic table fun with friendly rules — perfect for a quick break.",
  Strategy: "Plan your moves, build your forces and outsmart every opponent."
};

const HeartIcon = ({ on }) => (
  <svg viewBox="0 0 24 24" fill={on ? "#DB2417" : "none"} stroke={on ? "#DB2417" : "currentColor"} strokeWidth="2.3" strokeLinejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" /></svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="17.5" cy="5.5" r="2.5" /><circle cx="6.5" cy="12" r="2.5" /><circle cx="17.5" cy="18.5" r="2.5" /><path d="m8.7 10.8 6.6-4M8.7 13.2l6.6 4" /></svg>
);

const CONFETTI = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  const d = 90 + (i % 4) * 35;
  return {
    "--c": ["#FACC3E", "#DB2417", "#fff", "#7CC4F2"][i % 4],
    "--tx": `${Math.round(Math.cos(a) * d * 1.6)}px`,
    "--ty": `${Math.round(Math.sin(a) * d)}px`,
    "--r": `${(i % 2 ? 1 : -1) * (180 + i * 40)}deg`,
    "--delay": `${(i % 5) * 40}ms`
  };
});

/* Shown when the player comes back from the game */
function WelcomeBack({ g, secs, next, rating = 0, onRate, onClose }) {
  const [stars, setStars] = useState(rating);
  return (
    <Reveal as="section" className="welcome" aria-live="polite">
      <span className="confetti" aria-hidden="true">{CONFETTI.map((s, i) => <i key={i} style={s} />)}</span>
      <button type="button" className="welcome-x" aria-label="Dismiss" onClick={onClose}>✕</button>
      <div className="welcome-top">
        <span className="welcome-ico">🎉</span>
        <div>
          <b>Welcome back!</b>
          <small>You played <strong>{g.n}</strong> for {dur(secs)}</small>
        </div>
      </div>
      <div className="welcome-rate">
        <span>How was it?</span>
        <div className="rate" role="radiogroup" aria-label="Rate this game">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className={n <= stars ? "on" : ""} onClick={() => { setStars(n); onRate(g, n); }}>★</button>
          ))}
        </div>
      </div>
      {next && (
        <a className="welcome-next" href={detailHref(next)}>
          <img src={next.img} alt="" width="40" height="40" />
          <span><small>Up next</small><b>{next.n}</b></span>
          <span className="btn-play">Try it</span>
        </a>
      )}
    </Reveal>
  );
}

export default function GameDetail({ g, back, saved, toggleSave, notify, played, returned, dismissReturn, onRate }) {
  const [imgReady, setImgReady] = useState(false);
  useEffect(() => { setImgReady(false); }, [g]);
  const h5 = g.t === "h5";
  const cat = g.c[0];
  const more = similar(g);

  const share = async () => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title: g.n, text: `Play ${g.n} on Slypee`, url });
      else { await navigator.clipboard.writeText(url); notify("Link copied"); }
    } catch (_) { /* share sheet dismissed */ }
  };

  return (
    <div className="view detail">
      <button type="button" className="back-link" onClick={back}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>Back
      </button>

      {returned > 0 && <WelcomeBack g={g} secs={returned} next={more[0]} rating={played?.rating} onRate={onRate} onClose={dismissReturn} />}

      <Reveal as="article" className="dcard">
        <div className="dmedia">
          {g.b ? (
            <img className={"dbanner" + (imgReady ? " ready" : "")} src={g.b} alt="" width="900" height="263" onLoad={() => setImgReady(true)} />
          ) : (
            <>
              <img className="dblur" src={g.img} alt="" aria-hidden="true" />
              <img className={"dhero" + (imgReady ? " ready" : "")} src={g.img} alt="" width="256" height="256" onLoad={() => setImgReady(true)} />
            </>
          )}
          {h5 && <span className="dtag">⚡ Instant play</span>}
        </div>

        <div className="dinfo">
          <div className="dhead">
            {g.b && <img className="dico" src={g.img} alt="" width="72" height="72" />}
            <div className="dtitle">
              <h1>{g.n}</h1>
              <div className="dchips">
                {g.c.map(c => <span key={c} className="dchip">{c}</span>)}
                <span className={"dchip " + (h5 ? "h5" : "app")}>{h5 ? "HTML5" : "Game"}</span>
              </div>
            </div>
          </div>

          <dl className="dstats">
            <div><dt>Rating</dt><dd><span className="star">★</span> {g.r.toFixed(1)}</dd></div>
            <div><dt>Plays</dt><dd title={fmt(g.p)}>{short(g.p)}</dd></div>
            <div><dt>Genre</dt><dd>{cat}</dd></div>
            <div><dt>Type</dt><dd>{h5 ? "Browser" : "App"}</dd></div>
          </dl>

          <div className="dactions">
            <a className="btn-play dplay" {...playProps(g)}><PlayIcon />{h5 ? (played?.count ? "Play again" : "Play Now") : "Download"}</a>
            <button type="button" className={"dicon" + (saved ? " on" : "")} aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save game"} onClick={() => toggleSave(g)}><HeartIcon on={saved} /></button>
            <button type="button" className="dicon" aria-label="Share game" onClick={share}><ShareIcon /></button>
          </div>
          {played?.count > 0 && (
            <p className="dplayed">
              <span>🎮 You played this {played.count}×</span>
              {played.secs > 0 && <span>⏱ {dur(played.secs)}</span>}
              <span>🕑 {ago(played.last)}</span>
              {played.rating > 0 && <span>{"★".repeat(played.rating)}</span>}
            </p>
          )}
          <p className="dnote">{h5 ? "Starts the game right away — no install needed." : "Download on Slypee — needs a Jazz Slypee subscription."}</p>
        </div>
      </Reveal>

      <div className="two">
        <Reveal as="section" className="card-panel dabout" i={1}>
          <h2>About this game</h2>
          <p><b>{g.n}</b> is {/^[aeiou]/i.test(cat) ? "an" : "a"} {cat.toLowerCase()} game. {ABOUT[cat] || ""}</p>
        </Reveal>
        <Reveal as="section" className="card-panel dabout" i={2}>
          <h2>How to play</h2>
          <ol className="steps">
            <li><span>Tap <b>{h5 ? "Play Now" : "Download"}</b></span></li>
            <li><span>{h5 ? "The game starts right in your browser" : "Log in on Slypee with your Jazz number and install the game"}</span></li>
            <li><span>Follow the on-screen tips and have fun!</span></li>
          </ol>
        </Reveal>
      </div>

      {more.length > 0 && (
        <section>
          <Reveal className="head"><h2 className="title">More like <span className="hot">this</span></h2></Reveal>
          <div className="grid">{more.map((m, k) => <GameCard key={m.u} g={m} i={k} />)}</div>
        </section>
      )}
    </div>
  );
}
