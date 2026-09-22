import { useEffect, useRef } from "react";
import { CrownIcon, SimIcon } from "./icons.jsx";
import { SERVICE, TRIAL_DAYS, jazzUrl, markPending } from "../lib/subscription.js";
import { useT } from "../i18n/index.jsx";

/* The pop-up an organic visitor gets after tapping Subscribe: the ways this service can be
   subscribed to. Today that's Jazz alone — one <li> per method keeps room for the next one.
   Picking Jazz hands the player to Jazz's own sign-in page, which takes the confirmation and
   the payment; they come back to the portal once it's done. */
export default function SubscribeSheet({ onClose }) {
  const t = useT();
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);
  // lock page scroll behind the pop-up
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => { html.style.overflow = prev; };
  }, []);

  const goToJazz = () => {
    markPending("subscribe");                       // so a return with no result still makes sense
    location.assign(jazzUrl("subscribe"));          // → services.jazz.com.pk/signin/Slypee
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="sub-modal-title">
        <button type="button" className="modal-x" aria-label={t("common.close")} onClick={onClose}>✕</button>
        <span className="modal-ico"><CrownIcon /></span>
        <h2 id="sub-modal-title">{t("sheet.title", { name: SERVICE.name })}</h2>
        <p className="modal-sub">{t("sheet.sub")}</p>

        <ul className="methods">
          <li>
            <button type="button" className="method" ref={ref} onClick={goToJazz}>
              <span className="method-logo" aria-hidden="true"><SimIcon /></span>
              <span className="method-txt">
                <b>{t("sheet.jazz")}</b>
                <small>{t("sheet.jazzNote")}</small>
              </span>
              <svg className="method-chev flip-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </li>
        </ul>

        <p className="modal-fine">
          {t("sheet.fine", { n: TRIAL_DAYS, word: SERVICE.unsub, to: SERVICE.shortcode })}
        </p>
        <button type="button" className="link-btn modal-cancel" onClick={onClose}>{t("common.cancel")}</button>
      </div>
    </>
  );
}
