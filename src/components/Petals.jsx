/* A few petals drifting down over the background painting (hidden for reduced motion) */
const PETALS = Array.from({ length: 9 }, (_, i) => {
  const r = n => ((i * 9301 + n * 49297) % 233280) / 233280; // stable pseudo-random per petal
  return {
    "--x": `${Math.round(r(1) * 100)}%`,
    "--s": `${10 + Math.round(r(2) * 8)}px`,
    "--d": `${11 + Math.round(r(3) * 9)}s`,
    "--delay": `${-Math.round(r(4) * 18)}s`,
    "--drift": `${Math.round((r(5) - .5) * 160)}px`
  };
});

export default function Petals() {
  return <div className="petals" aria-hidden="true">{PETALS.map((s, i) => <i key={i} style={s} />)}</div>;
}
