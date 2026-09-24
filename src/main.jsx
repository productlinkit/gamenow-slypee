import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { I18nProvider, detectLang, loadDict } from "./i18n/index.jsx";
import { startFresh } from "./lib/subscription.js";
import "./index.css";

/* Nothing of the demo session survives a refresh — see startFresh in lib/subscription.js.
   This runs before React so the app simply boots up in whatever state is left. */
const wipeAll = new URLSearchParams(location.search).has("reset");
startFresh({ wipeAll });
if (wipeAll) { try { history.replaceState(null, "", location.pathname + "#home"); } catch (_) {} }

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
