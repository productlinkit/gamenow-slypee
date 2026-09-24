import { INFO, UPDATED } from "../content/info.js";
import { Reveal } from "../lib/reveal.jsx";
import { startFresh } from "../lib/subscription.js";
import { useI18n } from "../i18n/index.jsx";

export default function InfoPage({ id, back, go, notify, onClearData }) {
  const { t, lang, info } = useI18n();
  const page = INFO[id];

  const clearData = () => {
    startFresh({ wipeAll: true });
    onClearData();
    notify(t("info.cleared"));
  };

  return (
    <div className="view info">
      <button type="button" className="back-link flip" onClick={back}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>{t("common.back")}
      </button>

      <Reveal as="article" className="card-panel info-card" lang="en" dir="ltr">
        <h1>{page.title}</h1>
        <p className="info-meta" lang={lang} dir={info.dir || "ltr"}>{t("info.updated", { date: "\u2068" + UPDATED + "\u2069" })}</p>
        <p className="info-intro">{page.intro}</p>

        {page.faq && (
          <div className="faq">
            {page.faq.map(([q, a], i) => (
              <details key={q} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        )}

        {page.sections?.map(([h, items]) => (
          <section key={h} className="info-sec">
            <h2>{h}</h2>
            <ul>{items.map(x => <li key={x}>{x}</li>)}</ul>
          </section>
        ))}

        {id === "help" && <button type="button" className="btn-play info-cta" onClick={() => go("faq")}>{t("info.faq")}</button>}
        {page.clear && <button type="button" className="btn-play info-cta danger" onClick={clearData}>{t("info.clearData")}</button>}
      </Reveal>
    </div>
  );
}
