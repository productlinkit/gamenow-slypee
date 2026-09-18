import { Reveal } from "../lib/reveal.jsx";

/* "No install" promise for HTML5 games */
export default function InstantBanner({ title = "Tap & play instantly", text = "No install, no download — games open right in your browser." }) {
  return (
    <Reveal className="instant" i={1}>
      <span className="bolt" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="#DB2417" stroke="#221A16" strokeWidth="2" strokeLinejoin="round"><path d="M13.5 2 4.5 13.5h6.5l-1.5 8.5 9-11.5h-6.5z" /></svg>
      </span>
      <span className="txt"><b>{title}</b><small>{text}</small></span>
      <span className="tags" aria-hidden="true">
        <span>No install</span><span>Any device</span><span>Instant</span>
      </span>
    </Reveal>
  );
}
