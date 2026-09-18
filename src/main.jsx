import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { I18nProvider, detectLang, loadDict } from "./i18n/index.jsx";
import "./index.css";

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
