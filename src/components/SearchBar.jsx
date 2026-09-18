import { useEffect, useState } from "react";
import { Reveal } from "../lib/reveal.jsx";
import { SearchIcon } from "./icons.jsx";
import { GAMES } from "../lib/games.js";

const TRY = ["zombie", "racing", "puzzle", "ludo", "shooter"];

/* Looks like a search field; opens the full search sheet. The hint cycles through example searches. */
export default function SearchBar({ label = `Search ${GAMES.length} games…`, onOpen }) {
  const hints = [label, ...TRY.map(t => `Try “${t}”`)];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => { if (!document.hidden) setI(n => (n + 1) % hints.length); }, 2800);
    return () => clearInterval(t);
  }, [hints.length]);

  return (
    <Reveal as="button" type="button" className="search search-btn" onClick={onOpen} aria-label={label}>
      <SearchIcon />
      <span key={i} className="hint-text">{hints[i]}</span>
      <kbd>/</kbd>
    </Reveal>
  );
}
