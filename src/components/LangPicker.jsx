import { useEffect, useRef, useState } from "react";
import { LANGS, useI18n } from "../i18n/index.jsx";

// images rather than emoji flags, which Windows doesn't draw
const Flag = ({ cc }) => (
  <img className="flag" src={`https://flagcdn.com/w40/${cc}.png`} srcSet={`https://flagcdn.com/w80/${cc}.png 2x`} width="22" height="16" alt="" loading="lazy" />
);

export default function LangPicker() {
  const { lang, info, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
    const onDown = e => { if (!wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); removeEventListener("keydown", onKey); };
  }, [open]);

  const pick = async code => { setOpen(false); await setLang(code); };

  return (
    <div className="lang" ref={wrapRef}>
      <button type="button" className="lang-btn" aria-haspopup="listbox" aria-expanded={open} aria-label={t("header.language")} onClick={() => setOpen(o => !o)}>
        <Flag cc={info.flag} /><span>{lang.toUpperCase()}</span>
        <svg className="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <ul className="lang-menu" role="listbox" aria-label={t("lang.title")} ref={listRef}>
          {LANGS.map(l => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button type="button" className="lang-opt" onClick={() => pick(l.code)}>
                <Flag cc={l.flag} />
                <span className="lang-names"><b><bdi lang={l.code} dir={l.dir || "ltr"}>{l.name}</bdi></b><small>{l.en}</small></span>
                {l.code === lang && <span className="lang-check" aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
