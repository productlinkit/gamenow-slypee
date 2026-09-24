import { useState } from "react";
import { Reveal } from "../lib/reveal.jsx";
import { CrownIcon, SimIcon } from "../components/icons.jsx";
import { COUNTS, SERVICE, TRIAL_DAYS, active, hoursLeft, jazzUrl, markPending, onDate, onDateTime, statusKey } from "../lib/subscription.js";
import { Title, useI18n, useT } from "../i18n/index.jsx";

/* Why the plan is worth it — every line is something this service really does */
function Benefits() {
  const t = useT();
  return (
    <Reveal as="section" className="card-panel sub" i={2}>
      <h2>{t("plans.benefitsTitle")}</h2>
      <ul className="perks">
        <li>{t("plans.b1", { n: COUNTS.all })}</li>
        <li>{t("plans.b2", { h5: COUNTS.h5, app: COUNTS.app })}</li>
        <li>{t("plans.b3")}</li>
        <li>{t("plans.b4")}</li>
        <li>{t("plans.b5")}</li>
        <li>{t("plans.b6")}</li>
        <li>{t("plans.b7", { word: SERVICE.unsub, to: SERVICE.shortcode })}</li>
      </ul>
      <p className="hint fine-print">{t("plans.fine", { to: SERVICE.shortcode })}</p>
    </Reveal>
  );
}

const Row = ({ k, children }) => {
  const t = useT();
  return <div className="sum-row"><dt>{t(k)}</dt><dd>{children}</dd></div>;
};

export default function Plans({ sub, intent, onSubscribe, clearIntent, go, back }) {
  const { t, lang } = useI18n();
  const has = active(sub);

  return (
    <div className="view plans">
      <button type="button" className="back-link flip" onClick={back}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>{t("common.back")}
      </button>

      <section className={has ? undefined : "center-col"}>
        <Reveal className="head"><h2 className="title"><Title k={has ? "title.plans" : "title.subscribe"} /></h2></Reveal>

        {has && <Mirror sub={sub} go={go} intent={intent} clearIntent={clearIntent} />}

        {/* the offer, and the one button that starts it */}
        {!has && (
          <div className="two tight">
            <Reveal as="section" className="card-panel sub offer" i={1}>
              <span className="offer-ico"><CrownIcon /></span>
              <h2>{t("plans.pick")}</h2>
              <p>{t("plans.sub", { name: SERVICE.name })}</p>
              <button className="btn-play login-btn subscribe-btn" type="button" onClick={() => onSubscribe()}>
                <CrownIcon />{t("plans.subscribe")}
              </button>
              <p className="hint fine-print">{t("plans.handover", { name: SERVICE.name })}</p>
            </Reveal>
            <Benefits />
          </div>
        )}
      </section>
    </div>
  );
}

/* Everything here is Jazz's to change — the portal shows what it knows and hands back over */
function Mirror({ sub, go, intent, clearIntent }) {
  const { t, lang } = useI18n();
  // arriving from Settings → "Stop my subscription" opens straight on the confirm step
  const [asking, setAsking] = useState(intent === "cancel");
  const status = statusKey(sub);

  const toJazz = action => { markPending(action); location.assign(jazzUrl(action)); };

  return (
    <div className="two tight">
      <Reveal as="section" className="card-panel sub plan-state" i={1}>
        <div className="who">
          <div className="avatar" style={{ background: status === "stopped" ? "var(--paper-2)" : "var(--sun)" }}><CrownIcon /></div>
          <div className="grow">
            <h2>{SERVICE.name}</h2>
            <p>{t("manage.atJazz")}</p>
          </div>
          <span className={"status-pill " + status}>{t(`manage.status.${status}`)}</span>
        </div>

        <dl className="sum">
          {status === "trial" && sub.renews > 0 && (
            <Row k="manage.trialEnds">{onDateTime(sub.renews, lang)} · {t("manage.hoursLeft", { n: hoursLeft(sub) })}</Row>
          )}
          {sub.renews > 0 && (
            <Row k={status === "stopped" ? "manage.playUntil" : status === "trial" ? "manage.firstCharge" : "manage.nextCharge"}>
              {onDate(sub.renews, lang)}
            </Row>
          )}
          <Row k="manage.managedBy"><span className="with-ico"><SimIcon />{t("manage.jazz")}</span></Row>
          {sub.txn && <Row k="manage.ref"><bdi>{sub.txn}</bdi></Row>}
        </dl>

        {!sub.renews && <p className="plan-queued">{t("manage.noDates", { word: SERVICE.status, to: SERVICE.shortcode })}</p>}
        {status === "stopped" && <p className="plan-warn">{t(sub.renews ? "manage.stoppedNote" : "manage.stoppedPlain", { date: onDate(sub.renews, lang) })}</p>}

        {asking ? (
          <div className="cancel-box">
            <b>{t("cancel.title")}</b>
            <p>{t("cancel.text")}</p>
            <ul className="perks small">
              <li>{sub.renews ? t("cancel.keep", { date: onDate(sub.renews, lang) }) : t("cancel.keepPlain")}</li>
              <li>{t("cancel.noCharge")}</li>
              <li>{t("cancel.sms", { word: SERVICE.unsub, to: SERVICE.shortcode })}</li>
            </ul>
            <div className="edit-actions">
              <button type="button" className="chip" onClick={() => { setAsking(false); clearIntent?.(); }}>{t("cancel.back")}</button>
              <button type="button" className="btn-play danger" onClick={() => toJazz("unsub")}>{t("cancel.confirm")}</button>
            </div>
          </div>
        ) : status !== "stopped" && (
          <div className="edit-actions">
            <button type="button" className="chip" onClick={() => toJazz("manage")}>{t("manage.onJazz")}</button>
            <button type="button" className="link-btn cancel-link" onClick={() => setAsking(true)}>{t("manage.cancel")}</button>
          </div>
        )}
      </Reveal>

      <Reveal as="section" className="card-panel sub" i={2}>
        <h2>{t("manage.whereTitle")}</h2>
        <ul className="perks">
          <li>{t("manage.where1", { to: SERVICE.shortcode })}</li>
          <li>{t("manage.where2", { word: SERVICE.unsub, to: SERVICE.shortcode })}</li>
          <li>{t("manage.where3", { word: SERVICE.status, to: SERVICE.shortcode })}</li>
        </ul>
        <p className="hint fine-print">{t("manage.demoNote")}</p>
        <p className="hint fine-print"><button type="button" className="link-btn" onClick={() => go("faq")}>{t("info.faq")}</button></p>
      </Reveal>
    </div>
  );
}
