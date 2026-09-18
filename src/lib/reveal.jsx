import { useEffect, useRef } from "react";

/* One shared observer: elements fade/rise in the first time they scroll into view.
   The flag lives in a data attribute so React re-renders never wipe it. */
let io = null;
function observer() {
  if (!io && typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.dataset.in = "";
        io.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
  }
  return io;
}

export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = observer();
    if (!o) { el.dataset.in = ""; return; }
    o.observe(el);
    return () => o.unobserve(el);
  }, []);
  return ref;
}

/* `i` staggers siblings (e.g. cards in the same row) */
export function Reveal({ as: Tag = "div", className = "", i, style, ...rest }) {
  const ref = useReveal();
  return <Tag ref={ref} className={`reveal ${className}`.trim()} style={i != null ? { ...style, "--i": i } : style} {...rest} />;
}
