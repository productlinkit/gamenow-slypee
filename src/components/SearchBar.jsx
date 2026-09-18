import { useEffect, useState } from "react";
import { Reveal } from "../lib/reveal.jsx";
import { SearchIcon } from "./icons.jsx";
import { GAMES } from "../lib/games.js";
import { useT } from "../i18n/index.jsx";

const TRY = ["zombie", "racing", "puzzle", "ludo", "shooter"];

/* Looks like a search field; opens the full search sheet. The hint cycles through example searches. */
export default function SearchBar({ label, onOpen }) {
  const t = useT();
  const main = label || t("search.placeholder", { n: GAMES.length });
  const hints = [main, ...TRY.map(q => t("search.try", { q }))];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => { if (!document.hidden) setI(n => (n + 1) % hints.length); }, 2800);
    return () => clearInterval(id);
  }, [hints.length]);

  return (
    <Reveal as="button" type="button" className="search search-btn" onClick={onOpen} aria-label={main}>
      <SearchIcon />
      <span key={i} className="hint-text">{hints[i]}</span>
      <kbd>/</kbd>
    </Reveal>
  );
}
