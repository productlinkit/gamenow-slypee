import { useEffect, useState } from "react";
import NavTabs from "./NavTabs.jsx";
import LangPicker from "./LangPicker.jsx";
import { CrownIcon } from "./icons.jsx";
import { useT } from "../i18n/index.jsx";

export default function Header({ view, go, loggedIn, subscribed, onSubscribe }) {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(scrollY > 8));
    };
    addEventListener("scroll", update, { passive: true });
    update();
    return () => { removeEventListener("scroll", update); cancelAnimationFrame(raf); };
  }, []);

  return (
    <header className={"top" + (scrolled ? " scrolled" : "")}>
      <div className="top-in">
        <a className="brand" href="#home" aria-label={t("header.home")} onClick={e => { e.preventDefault(); go("home"); }}>
          <img src="/assets/slypee-logo.png" alt="Slypee" width="310" height="130" />
        </a>
        <nav className="desk-nav" aria-label="Main"><NavTabs view={view} go={go} loggedIn={loggedIn} /></nav>
        <div className="top-actions">
          <span className="partner"><small>{t("header.with")}</small><img src="/assets/gamenow-logo.png" alt="GameNow" width="547" height="65" /></span>
          {/* the way in, wherever the player happens to be */}
          {!subscribed && (
            <button type="button" className="top-sub" onClick={onSubscribe}>
              <CrownIcon /><span>{t("plans.subscribe")}</span>
            </button>
          )}
          <LangPicker />
        </div>
      </div>
    </header>
  );
}
