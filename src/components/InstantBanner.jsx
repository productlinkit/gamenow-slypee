import { Reveal } from "../lib/reveal.jsx";
import { useT } from "../i18n/index.jsx";
import { BoltIcon } from "./icons.jsx";

/* "No install" promise for HTML5 games */
export default function InstantBanner() {
  const t = useT();
  return (
    <Reveal className="instant" i={1}>
      <span className="bolt" aria-hidden="true"><BoltIcon /></span>
      <span className="txt"><b>{t("instant.title")}</b><small>{t("instant.text")}</small></span>
      <span className="tags" aria-hidden="true">
        <span>{t("instant.tag1")}</span><span>{t("instant.tag2")}</span><span>{t("instant.tag3")}</span>
      </span>
    </Reveal>
  );
}
