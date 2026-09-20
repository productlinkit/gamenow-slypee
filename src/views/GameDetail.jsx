import { useEffect, useState } from "react";
import { fmt, short, similar, playProps, detailHref } from "../lib/games.js";
import { ago, dur } from "../lib/history.js";
import { Reveal } from "../lib/reveal.jsx";
import { BoltIcon, ClockIcon, PadIcon, PartyIcon, PlayIcon, TimerIcon } from "../components/icons.jsx";
import GameCard from "../components/GameCard.jsx";
import { Title, useT } from "../i18n/index.jsx";

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
  const t = useT();
  const [stars, setStars] = useState(rating);
  return (
    <Reveal as="section" className="welcome" aria-live="polite">
      <span className="confetti" aria-hidden="true">{CONFETTI.map((s, i) => <i key={i} style={s} />)}</span>
      <button type="button" className="welcome-x" aria-label={t("common.dismiss")} onClick={onClose}>✕</button>
      <div className="welcome-top">
        <span className="welcome-ico"><PartyIcon /></span>
        <div>
          <b>{t("welcome.title")}</b>
          <small>{t("welcome.text", { name: g.n, time: dur(secs, t) })}</small>
        </div>
      </div>
      <div className="welcome-rate">
        <span>{t("welcome.how")}</span>
        <div className="rate" role="radiogroup" aria-label={t("welcome.rate")}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={t("welcome.stars", { n })}
              className={n <= stars ? "on" : ""} onClick={() => { setStars(n); onRate(g, n); }}>★</button>
          ))}
        </div>
      </div>
      {next && (
        <a className="welcome-next" href={detailHref(next)}>
          <img src={next.img} alt="" width="40" height="40" />
          <span><small>{t("welcome.next")}</small><b dir="auto">{next.n}</b></span>
          <span className="btn-play">{t("welcome.try")}</span>
        </a>
      )}
    </Reveal>
  );
}

export default function GameDetail({ g, back, saved, toggleSave, notify, played, returned, dismissReturn, onRate }) {
  const t = useT();
  const [imgReady, setImgReady] = useState(false);
  useEffect(() => { setImgReady(false); }, [g]);
  const h5 = g.t === "h5";
  const cat = g.c[0];
  const more = similar(g, 12);

  const share = async () => {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title: g.n, text: t("detail.shareText", { name: g.n }), url });
      else { await navigator.clipboard.writeText(url); notify(t("toast.copied")); }
    } catch (_) { /* share sheet dismissed */ }
  };

  return (
    <div className="view detail">
      <button type="button" className="back-link flip" onClick={back}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>{t("common.back")}
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
          {h5 && <span className="dtag"><BoltIcon />{t("detail.instant")}</span>}
        </div>

        <div className="dinfo">
          <div className="dhead">
            {g.b && <img className="dico" src={g.img} alt="" width="72" height="72" />}
            <div className="dtitle">
              <h1 dir="auto">{g.n}</h1>
              <div className="dchips">
                {g.c.map(c => <span key={c} className="dchip">{t(`cat.${c}`)}</span>)}
                <span className={"dchip " + (h5 ? "h5" : "app")}>{h5 ? "HTML5" : t("detail.app")}</span>
              </div>
            </div>
          </div>

          <dl className="dstats">
            <div><dt>{t("detail.rating")}</dt><dd><span className="star">★</span> {g.r.toFixed(1)}</dd></div>
            <div><dt>{t("detail.plays")}</dt><dd title={fmt(g.p)}>{short(g.p)}</dd></div>
            <div><dt>{t("detail.genre")}</dt><dd>{t(`cat.${cat}`)}</dd></div>
            <div><dt>{t("detail.type")}</dt><dd>{t(h5 ? "detail.browser" : "detail.app")}</dd></div>
          </dl>

          <div className="dactions">
            <a className="btn-play dplay" {...playProps(g)}><PlayIcon />{t(h5 ? (played?.count ? "detail.playAgain" : "common.playNow") : "detail.download")}</a>
            <button type="button" className={"dicon" + (saved ? " on" : "")} aria-pressed={saved} aria-label={t(saved ? "detail.unsave" : "detail.save")} onClick={() => toggleSave(g)}><HeartIcon on={saved} /></button>
            <button type="button" className="dicon" aria-label={t("detail.share")} onClick={share}><ShareIcon /></button>
          </div>
          {played?.count > 0 && (
            <p className="dplayed">
              <span><PadIcon />{t("detail.youPlayed", { n: played.count })}</span>
              {played.secs > 0 && <span><TimerIcon />{dur(played.secs, t)}</span>}
              <span><ClockIcon />{ago(played.last, t)}</span>
              {played.rating > 0 && <span>{"★".repeat(played.rating)}</span>}
            </p>
          )}
          <p className="dnote">{t(h5 ? "detail.noteH5" : "detail.noteApp")}</p>
        </div>
      </Reveal>

      <div className="two">
        <Reveal as="section" className="card-panel dabout" i={1}>
          <h2>{t("detail.about")}</h2>
          <p><b>{g.n}</b> — {t(`about.${cat}`)}</p>
        </Reveal>
        <Reveal as="section" className="card-panel dabout" i={2}>
          <h2>{t("detail.how")}</h2>
          <ol className="steps">
            <li><span>{t("detail.step1", { btn: t(h5 ? "common.playNow" : "detail.download") })}</span></li>
            <li><span>{t(h5 ? "detail.step2H5" : "detail.step2App")}</span></li>
            <li><span>{t("detail.step3")}</span></li>
          </ol>
        </Reveal>
      </div>

      {more.length > 0 && (
        <section>
          <Reveal className="head"><h2 className="title"><Title k="title.more" /></h2></Reveal>
          <div className="grid">{more.map((m, k) => <GameCard key={m.u} g={m} i={k} />)}</div>
        </section>
      )}
    </div>
  );
}
