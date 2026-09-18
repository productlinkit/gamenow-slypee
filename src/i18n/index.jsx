import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "./locales/en.js";

/* Supported languages. `flag` is the country shown in the picker (ISO code, drawn from flagcdn).
    `font` is a Google Font loaded on demand for scripts our display fonts don't cover. */
export const LANGS = [
  { code: "en", flag: "gb", name: "English", en: "English" },
  { code: "ar", flag: "sa", name: "العربية", en: "Arabic", dir: "rtl", font: "Baloo Bhaijaan 2" },
  { code: "ur", flag: "pk", name: "اردو", en: "Urdu", dir: "rtl", font: "Baloo Bhaijaan 2" },
  { code: "fa", flag: "ir", name: "فارسی", en: "Persian", dir: "rtl", font: "Baloo Bhaijaan 2" },
  { code: "my", flag: "mm", name: "မြန်မာ", en: "Myanmar (Burmese)", font: "Noto Sans Myanmar" },
  { code: "fil", flag: "ph", name: "Filipino", en: "Filipino", alias: ["tl"] },
  { code: "id", flag: "id", name: "Bahasa Indonesia", en: "Indonesian" },
  { code: "ms", flag: "my", name: "Bahasa Melayu", en: "Malay" },
  { code: "hi", flag: "in", name: "हिन्दी", en: "Hindi" },
  { code: "bn", flag: "bd", name: "বাংলা", en: "Bengali", font: "Baloo Da 2" },
  { code: "th", flag: "th", name: "ไทย", en: "Thai", font: "Noto Sans Thai" },
  { code: "vi", flag: "vn", name: "Tiếng Việt", en: "Vietnamese" },
  { code: "zh", flag: "cn", name: "简体中文", en: "Chinese (Simplified)", font: "Noto Sans SC" },
  { code: "ja", flag: "jp", name: "日本語", en: "Japanese", font: "Noto Sans JP" },
  { code: "ko", flag: "kr", name: "한국어", en: "Korean", font: "Noto Sans KR" },
  { code: "es", flag: "es", name: "Español", en: "Spanish" },
  { code: "pt", flag: "br", name: "Português", en: "Portuguese" },
  { code: "fr", flag: "fr", name: "Français", en: "French" },
  { code: "de", flag: "de", name: "Deutsch", en: "German" },
  { code: "ru", flag: "ru", name: "Русский", en: "Russian", font: "Nunito" },
  { code: "tr", flag: "tr", name: "Türkçe", en: "Turkish" },
  { code: "sw", flag: "ke", name: "Kiswahili", en: "Swahili" }
];
const BY_CODE = new Map(LANGS.map(l => [l.code, l]));
const LANG_KEY = "slypee.lang";
const loaders = import.meta.glob(["./locales/*.js", "!./locales/en.js"]);

export function detectLang() {
  try { const saved = localStorage.getItem(LANG_KEY); if (BY_CODE.has(saved)) return saved; } catch (_) {}
  for (const tag of navigator.languages || [navigator.language || "en"]) {
    const base = tag.toLowerCase().split("-")[0];
    const hit = LANGS.find(l => l.code === base || l.alias?.includes(base));
    if (hit) return hit.code;
  }
  return "en";
}

export async function loadDict(code) {
  if (code === "en") return en;
  const load = loaders[`./locales/${code}.js`];
  return load ? (await load()).default : en;
}

function applyDocument(lang) {
  const html = document.documentElement;
  html.lang = lang.code;
  html.dir = lang.dir || "ltr";
  if (lang.font) {
    const id = "font-" + lang.code;
    if (!document.getElementById(id)) {
      const link = Object.assign(document.createElement("link"), {
        id, rel: "stylesheet",
        href: `https://fonts.googleapis.com/css2?family=${lang.font.replace(/ /g, "+")}:wght@400;700;800&display=swap`
      });
      document.head.append(link);
    }
    html.style.setProperty("--script", `"${lang.font}"`);
  } else html.style.removeProperty("--script");
}

const I18n = createContext(null);

export function I18nProvider({ initialLang, initialDict, children }) {
  const [state, setState] = useState({ lang: initialLang, dict: initialDict });

  useEffect(() => { applyDocument(BY_CODE.get(state.lang)); }, [state.lang]);

  const setLang = useCallback(async code => {
    const dict = await loadDict(code);
    setState({ lang: code, dict });
    try { localStorage.setItem(LANG_KEY, code); } catch (_) {}
  }, []);

  const t = useCallback((key, vars) => {
    let s = state.dict[key] ?? en[key] ?? key;
    if (vars) for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
    return s;
  }, [state.dict]);

  const value = useMemo(() => ({ lang: state.lang, info: BY_CODE.get(state.lang), setLang, t }), [state.lang, setLang, t]);
  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}

export const useI18n = () => useContext(I18n);
export const useT = () => useContext(I18n).t;

/* Section titles: "Trending|Games" → Trending <span class="hot">Games</span> */
export function Title({ k }) {
  const [a, b] = useT()(k).split("|");
  return b === undefined ? a : <>{a} <span className="hot">{b}</span></>;
}
