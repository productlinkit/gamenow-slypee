import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { I18nProvider, detectLang, loadDict } from "./i18n/index.jsx";
import "./index.css";

/* ?reset — start over as a first-time visitor: no login, no subscription, no history.
   Handy for demos, and it runs before React so the app simply boots up empty.
   The language choice survives, since re-picking it every time only gets in the way. */
try {
  if (new URLSearchParams(location.search).has("reset")) {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("slypee.") && key !== "slypee.lang") localStorage.removeItem(key);
    }
    history.replaceState(null, "", location.pathname + "#home");
  }
} catch (_) { /* storage blocked — nothing to clear */ }

// load the viewer's language before the first paint so there's no flash of English
const lang = detectLang();
loadDict(lang).then(dict => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <I18nProvider initialLang={lang} initialDict={dict}>
        <App />
      </I18nProvider>
    </StrictMode>
  );
});
