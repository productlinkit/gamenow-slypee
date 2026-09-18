import { fmt, short, detailHref } from "../lib/games.js";
import { PlayIcon } from "./icons.jsx";
import { Reveal } from "../lib/reveal.jsx";
import { useT } from "../i18n/index.jsx";

export default function GameCard({ g, rank = 0, eager = false, i = 0 }) {
  const t = useT();
  return (
    <Reveal as="article" className="gcard" i={i % 4}>
      <a className="thumb" href={detailHref(g)} aria-label={g.n}>
        <img src={g.img} alt="" width="256" height="256" loading={eager ? "eager" : "lazy"} decoding="async" />
        {rank ? <span className="rk">{rank}</span> : null}
      </a>
      <div className="gbody">
        <h3 className="gname" dir="auto"><a href={detailHref(g)}>{g.n}</a></h3>
        <div className="gmeta">
          <span className="star">★ {g.r.toFixed(1)}</span>
          <span className="short">{t("common.plays", { n: short(g.p) })}</span>
          <span className="full">{t("common.plays", { n: fmt(g.p) })}</span>
        </div>
        <a className="btn-play" href={detailHref(g)}><PlayIcon />{t("common.playNow")}</a>
      </div>
    </Reveal>
  );
}
