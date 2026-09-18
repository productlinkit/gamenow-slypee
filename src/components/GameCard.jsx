import { fmt, short, detailHref } from "../lib/games.js";
import { PlayIcon } from "./icons.jsx";
import { Reveal } from "../lib/reveal.jsx";

export default function GameCard({ g, rank = 0, eager = false, i = 0 }) {
  return (
    <Reveal as="article" className="gcard" i={i % 4}>
      <a className="thumb" href={detailHref(g)} aria-label={g.n}>
        <img src={g.img} alt="" width="256" height="256" loading={eager ? "eager" : "lazy"} decoding="async" />
        {rank ? <span className="rk">{rank}</span> : null}
      </a>
      <div className="gbody">
        <h3 className="gname"><a href={detailHref(g)}>{g.n}</a></h3>
        <div className="gmeta">
          <span className="star">★ {g.r.toFixed(1)}</span>
          <span className="short">{short(g.p)} plays</span>
          <span className="full">{fmt(g.p)} plays</span>
        </div>
        <a className="btn-play" href={detailHref(g)}><PlayIcon />Play Now</a>
      </div>
    </Reveal>
  );
}
