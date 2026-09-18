import { useEffect, useMemo, useRef, useState } from "react";
import { GAMES, fmt, detailHref } from "../lib/games.js";
import { PlayIcon } from "./icons.jsx";
import { Reveal } from "../lib/reveal.jsx";

export default function Trending({ active }) {
  const items = useMemo(() => GAMES.filter(g => g.b).sort((a, b) => b.p - a.p), []);
  const [idx, setIdx] = useState(0);
  const trackRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const pickRef = useRef(() => {});

  useEffect(() => {
    const track = trackRef.current;
    const cards = [...track.children];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0, timer = null, resumeT = null, raf = 0;

    function go(n) {
      i = (n + cards.length) % cards.length;
      const c = cards[i];
      const centered = getComputedStyle(c).scrollSnapAlign.includes("center");
      const left = centered ? c.offsetLeft - (track.clientWidth - c.clientWidth) / 2 : c.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft);
      track.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
      setIdx(i);
    }
    const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    function tick() {
      if (document.hidden || !activeRef.current) return;
      go(atEnd() || i >= cards.length - 1 ? 0 : i + 1);
    }
    function start() { if (!reduce && !timer) timer = setInterval(tick, 2600); }
    function stop() { clearInterval(timer); timer = null; }
    function hold() { stop(); clearTimeout(resumeT); resumeT = setTimeout(start, 4000); }
    pickRef.current = n => { go(n); hold(); };

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = track.scrollLeft + track.clientWidth / 2;
        const startSnap = getComputedStyle(cards[0]).scrollSnapAlign.includes("start");
        const pad = parseFloat(getComputedStyle(track).paddingLeft);
        let best = 0, bd = Infinity;
        cards.forEach((c, k) => {
          const d = startSnap ? Math.abs(c.offsetLeft - pad - track.scrollLeft) : Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
          if (d < bd) { bd = d; best = k; }
        });
        i = best; setIdx(best);
      });
    }

    const holdEvents = ["pointerdown", "touchstart", "wheel", "focusin"];
    track.addEventListener("scroll", onScroll, { passive: true });
    holdEvents.forEach(ev => track.addEventListener(ev, hold, { passive: true }));
    track.addEventListener("mouseenter", stop);
    track.addEventListener("mouseleave", hold);
    start();
    return () => {
      stop(); clearTimeout(resumeT); cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
      holdEvents.forEach(ev => track.removeEventListener(ev, hold));
      track.removeEventListener("mouseenter", stop);
      track.removeEventListener("mouseleave", hold);
    };
  }, [items]);

  return (
    <section id="trending" aria-roledescription="carousel" aria-label="Trending games">
      <Reveal className="head">
        <h2 className="title">Trending <span className="hot">Games</span></h2>
        <span className="live"><i></i>Hot now</span>
      </Reveal>
      <Reveal i={1}>
      <div className="track" ref={trackRef}>
        {items.map((g, i) => (
          <article key={g.u} className={"tcard" + (i === idx ? " on" : "")} aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
            <a className="banner" href={detailHref(g)} tabIndex={-1}>
              <img src={g.b} alt="" width="900" height="263" {...(i ? { loading: "lazy" } : { fetchPriority: "high" })} />
              <span className="rank">#{i + 1}</span>
            </a>
            <div className="tinfo">
              <img className="ico" src={g.img} alt="" width="46" height="46" />
              <div className="txt">
                <h3>{g.n}</h3>
                <p><span className="star">★ {g.r.toFixed(1)}</span><span>{g.c[0]}</span><span>{fmt(g.p)} plays</span></p>
              </div>
              <a className="btn-play" href={detailHref(g)}><PlayIcon />Play Now</a>
            </div>
          </article>
        ))}
      </div>
      <div className="dots" role="group" aria-label="Choose slide">
        {items.map((g, k) => (
          <button key={g.u} type="button" aria-label={`Show ${g.n}`} aria-current={k === idx} onClick={() => pickRef.current(k)} />
        ))}
      </div>
      </Reveal>
    </section>
  );
}
