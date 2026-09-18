import { Reveal } from "../lib/reveal.jsx";
import { useT } from "../i18n/index.jsx";

/* "No install" promise for HTML5 games */
export default function InstantBanner() {
  const t = useT();
  return (
    <Reveal className="instant" i={1}>
      <span className="bolt" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="#DB2417" stroke="#221A16" strokeWidth="2" strokeLinejoin="round"><path d="M13.5 2 4.5 13.5h6.5l-1.5 8.5 9-11.5h-6.5z" /></svg>
      </span>
      <span className="txt"><b>{t("instant.title")}</b><small>{t("instant.text")}</small></span>
      <span className="tags" aria-hidden="true">
        <span>{t("instant.tag1")}</span><span>{t("instant.tag2")}</span><span>{t("instant.tag3")}</span>
      </span>
    </Reveal>
  );
}
