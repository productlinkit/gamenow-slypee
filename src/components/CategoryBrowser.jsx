import { useEffect, useMemo, useRef, useState } from "react";
import { listFor } from "../lib/games.js";
import { CAT_ICONS } from "./icons.jsx";
import GameCard from "./GameCard.jsx";

/* Category browser: every panel is pre-rendered once, switching only toggles `hidden` → instant, no refetch, no flicker */
export default function CategoryBrowser({ type, cats, cap, warmAll }) {
  const [active, setActive] = useState(cats[0]);
  const [warm, setWarm] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set());
  const [stuck, setStuck] = useState(false);
  const barRef = useRef(null);
  const stackRef = useRef(null);
  const lists = useMemo(() => Object.fromEntries(cats.map(c => [c, listFor(type, c)])), [type, cats]);

  // tint the category bar once it sticks under the header
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const bar = barRef.current;
        const stickAt = document.querySelector(".top").offsetHeight + 1;
        setStuck(bar.offsetParent !== null && bar.getBoundingClientRect().top <= stickAt);
      });
    };
    addEventListener("scroll", update, { passive: true });
    update();
    return () => { removeEventListener("scroll", update); cancelAnimationFrame(raf); };
  }, []);

  const warmUp = cat => setWarm(w => w.has(cat) ? w : new Set(w).add(cat));

  const select = (cat, btn) => {
    setActive(cat);
    // keep the chosen tab in view horizontally, and bring the grid top under the sticky bar
    const bar = barRef.current;
    bar.scrollTo({ left: btn.offsetLeft - (bar.clientWidth - btn.offsetWidth) / 2, behavior: "smooth" });
    const stickTop = document.querySelector(".top").offsetHeight + bar.offsetHeight;
    const r = stackRef.current.getBoundingClientRect();
    if (r.top < stickTop) window.scrollTo({ top: scrollY + r.top - stickTop - 4 });
  };

  const idFor = cat => `${type}-${cat.replace(/\s/g, "")}`;

  return (
    <div className="browser">
      <div className={"cats sticky" + (stuck ? " stuck" : "")} role="tablist" ref={barRef}>
        {cats.map(cat => (
          <button
            key={cat} type="button" className="cat" id={`tab-${idFor(cat)}`}
            role="tab" aria-selected={cat === active} aria-controls={`panel-${idFor(cat)}`}
            onPointerEnter={() => warmUp(cat)} onTouchStart={() => warmUp(cat)}
            onClick={e => select(cat, e.currentTarget)}
          >
            {CAT_ICONS[cat]}<span>{cat}</span>
          </button>
        ))}
      </div>
      <div ref={stackRef}>
        {cats.map((cat, i) => {
          const list = lists[cat];
          const all = expanded.has(cat);
          const shown = all ? list : list.slice(0, cap);
          const eagerAll = warmAll || warm.has(cat);
          return (
            <div key={cat} className="panel" id={`panel-${idFor(cat)}`} role="tabpanel" aria-labelledby={`tab-${idFor(cat)}`} hidden={cat !== active}>
              <div className="grid">
                {shown.map((g, k) => (
                  <GameCard key={g.u} g={g} rank={cat === "Top Chart" ? k + 1 : 0} eager={eagerAll || (i === 0 && k < 8)} i={k} />
                ))}
              </div>
              {!all && list.length > cap && (
                <button type="button" className="more show-all" onClick={() => setExpanded(s => new Set(s).add(cat))}>
                  Show all {list.length} {cat} games
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
