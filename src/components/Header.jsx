import { useEffect, useRef, useState } from "react";
import NavTabs from "./NavTabs.jsx";
import LangPicker from "./LangPicker.jsx";
import { AvatarIcon, CrownIcon } from "./icons.jsx";
import { maskMsisdn, statusKey } from "../lib/subscription.js";
import { useT } from "../i18n/index.jsx";

/* Top right, the header has two states: an invitation to subscribe, or who is subscribed.
   Nothing in between — no email, no password, no payment ever happens in the portal. */
function Account({ sub, onLeave }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const number = maskMsisdn(sub.msisdn);

  // close on a click elsewhere or on Escape, like any small menu
  useEffect(() => {
    if (!open) return;
    const onDown = e => { if (!box.current?.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div className="acct" ref={box}>
      <button type="button" className={"acct-btn" + (open ? " on" : "")} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(o => !o)}>
        <span className="acct-ico" aria-hidden="true"><AvatarIcon /></span>
        {number && <bdi className="acct-num">{number}</bdi>}
        <svg className="acct-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div className="acct-menu" role="menu">
          <p className="acct-state">
            <i className={"dot " + statusKey(sub)} aria-hidden="true" />
            <span>
              <b>{t(`acct.state.${statusKey(sub)}`)}</b>
              {number && <small><bdi>{number}</bdi></small>}
            </span>
          </p>
          <button type="button" className="acct-leave" role="menuitem" onClick={() => { setOpen(false); onLeave(); }}>
            {t("acct.leave")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header({ view, go, loggedIn, sub, subscribed, onSubscribe, onLeave }) {
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
          {subscribed
            ? <Account sub={sub} onLeave={onLeave} />
            : <button type="button" className="top-sub" onClick={onSubscribe}><CrownIcon /><span>{t("plans.subscribe")}</span></button>}
          <LangPicker />
        </div>
      </div>
    </header>
  );
}
