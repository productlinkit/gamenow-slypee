import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronIcon } from "./icons.jsx";
import { useT } from "../i18n/index.jsx";

/* Horizontal card row with prev/next arrows (desktop) and ←/→ keys. Works in LTR and RTL. */
export default function ScrollRow({ className, children }) {
  const t = useT();
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const pos = Math.abs(el.scrollLeft); // negative in RTL
    setEdge({ start: pos < 4, end: pos + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    addEventListener("resize", measure);
    return () => { el.removeEventListener("scroll", measure); removeEventListener("resize", measure); };
  }, [measure, children]);

  // step = "forward"/"back" in reading order
  const move = step => {
    const el = ref.current;
    const rtl = getComputedStyle(el).direction === "rtl";
    const amount = el.clientWidth * 0.8 * (step === "forward" ? 1 : -1) * (rtl ? -1 : 1);
    el.scrollBy({ left: amount, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const onKey = e => {
    const rtl = getComputedStyle(ref.current).direction === "rtl";
    if (e.key === "ArrowRight") { e.preventDefault(); move(rtl ? "back" : "forward"); }
    if (e.key === "ArrowLeft") { e.preventDefault(); move(rtl ? "forward" : "back"); }
  };

  return (
    <div className="scroll-row">
      <button type="button" className="nav-arrow prev" aria-label={t("common.prev")} disabled={edge.start} onClick={() => move("back")}><ChevronIcon dir="prev" /></button>
      <div className={className} ref={ref} tabIndex={0} onKeyDown={onKey}>{children}</div>
      <button type="button" className="nav-arrow next" aria-label={t("common.next")} disabled={edge.end} onClick={() => move("forward")}><ChevronIcon dir="next" /></button>
    </div>
  );
}
