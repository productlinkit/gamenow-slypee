import { useState } from "react";
import { Reveal } from "../lib/reveal.jsx";
import { ClockIcon, CrownIcon, LockIcon, SimIcon } from "../components/icons.jsx";
import {
  COUNTS, PLANS, SERVICE, TRIAL_DAYS, active, hoursLeft, jazzUrl, knownPlan, markPending,
  money, onDate, onDateTime, perMonth, savingPct, statusKey
} from "../lib/subscription.js";
import { Title, useI18n, useT } from "../i18n/index.jsx";

/* What the service costs. Jazz's page is where a package is actually chosen and confirmed,
   so this is a price list, not a picker — nothing here is passed along. */
function PlanTable() {
  const { t, lang } = useI18n();
  return (
    <ul className="plan-list prices">
      {PLANS.map(p => {
        const save = savingPct(p);
        return (
          <li key={p.id} className={"plan" + (p.best ? " on" : "")}>
            {p.best && <span className="plan-badge">{t("plan.best")}</span>}
            <span className="plan-main">
              <b>{t(`plan.${p.id}`)}</b>
              <small>
                {t(`plan.every.${p.id}`)}
                {save > 0 && <i className="plan-save">{t("plan.save", { n: save })}</i>}
              </small>
            </span>
            <span className="plan-cost">
              <b>{money(p.price, lang)}</b>
              <small>{t("plan.perMonth", { price: money(perMonth(p), lang, 2) })}</small>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

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
      <p className="hint">{t("plans.fine", { to: SERVICE.shortcode })}</p>
    </Reveal>
  );
}

const Row = ({ k, children }) => {
  const t = useT();
  return <div className="sum-row"><dt>{t(k)}</dt><dd>{children}</dd></div>;
};

export default function Plans({ sub, result, intent, onSubscribe, onStatus, clearResult, clearIntent, go, back }) {
  const { t, lang } = useI18n();
  const has = active(sub);

  return (
    <div className="view plans">
      <button type="button" className="back-link flip" onClick={back}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>{t("common.back")}
      </button>

      <section className={has && !result ? undefined : "center-col"}>
        <Reveal className="head"><h2 className="title"><Title k={has ? "title.plans" : "title.subscribe"} /></h2></Reveal>

        {result === "success" && (
          <Reveal as="section" className="card-panel sub narrow done" i={1}>
            <span className="done-ico"><CrownIcon /></span>
            <h2>{t("done.title")}</h2>
            <p>{sub?.renews
              ? t(sub.trial ? "done.trial" : "done.text", { plan: t(`plan.${knownPlan(sub)?.id || PLANS[0].id}`), date: onDate(sub.renews, lang), n: TRIAL_DAYS })
              : t("done.plain", { name: SERVICE.name })}</p>
            <ul className="perks">
              <li>{t("done.p1", { n: COUNTS.all })}</li>
              {sub?.renews && <li>{t("done.p2", { date: onDate(sub.renews, lang) })}</li>}
              <li>{t("done.p3", { word: SERVICE.unsub, to: SERVICE.shortcode })}</li>
            </ul>
            <div className="edit-actions">
              <button type="button" className="chip" onClick={clearResult}>{t("done.manage")}</button>
              <button type="button" className="btn-play" onClick={() => go("home")}>{t("done.play")}</button>
            </div>
          </Reveal>
        )}

        {/* back from Jazz with nothing to go on — the normal case when Jazz appends no result */}
        {result === "unknown" && (
          <Reveal as="section" className="card-panel sub narrow done" i={1}>
            <span className="done-ico waiting"><ClockIcon /></span>
            <h2>{t("back.unknownTitle")}</h2>
            <p>{t("back.unknownText", { name: SERVICE.name, word: SERVICE.status, to: SERVICE.shortcode })}</p>
            <div className="edit-actions">
              <button type="button" className="chip" onClick={() => onSubscribe()}>{t("back.again")}</button>
              <button type="button" className="btn-play" onClick={onStatus}>{t("back.check")}</button>
            </div>
            <p className="hint">{t("back.apiNote")}</p>
          </Reveal>
        )}

        {(result === "cancelled" || result === "failed") && (
          <Reveal as="section" className="card-panel sub narrow done" i={1}>
            <span className="done-ico low"><LockIcon /></span>
            <h2>{t(`back.${result}Title`)}</h2>
            <p>{t(`back.${result}Text`, { name: SERVICE.name })}</p>
            <div className="edit-actions">
              <button type="button" className="chip" onClick={() => go("help")}>{t("info.help")}</button>
              <button type="button" className="btn-play" onClick={() => { clearResult(); onSubscribe(); }}>{t("back.again")}</button>
            </div>
            <p className="hint">{t("back.note", { word: SERVICE.unsub, to: SERVICE.shortcode })}</p>
          </Reveal>
        )}

        {has && !result && <Mirror sub={sub} go={go} intent={intent} clearIntent={clearIntent} />}

        {/* the offer, and the one button that starts it */}
        {!has && !result && (
          <div className="two tight">
            <Reveal as="section" className="card-panel sub" i={1}>
              <h2>{t("plans.pick")}</h2>
              <p>{t("plans.sub")}</p>
              <PlanTable />
              <button className="btn-play login-btn subscribe-btn" type="button" onClick={() => onSubscribe()}>
                <CrownIcon />{t("plans.subscribe")}
              </button>
              <p className="hint plan-hint">{t("plans.handover", { name: SERVICE.name })}</p>
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
  const plan = knownPlan(sub);
  const status = statusKey(sub);

  const toJazz = action => { markPending(action); location.assign(jazzUrl(action)); };

  return (
    <div className="two tight">
      <Reveal as="section" className="card-panel sub plan-state" i={1}>
        <div className="who">
          <div className="avatar" style={{ background: status === "stopped" ? "var(--paper-2)" : "var(--sun)" }}><CrownIcon /></div>
          <div className="grow">
            <h2>{plan ? t(`plan.${plan.id}`) : SERVICE.name}</h2>
            <p>{plan ? `${money(plan.price, lang)} · ${t(`plan.every.${plan.id}`)}` : t("manage.atJazz")}</p>
          </div>
          <span className={"status-pill " + status}>{t(`manage.status.${status}`)}</span>
        </div>

        <dl className="sum">
          {status === "trial" && sub.renews > 0 && (
            <Row k="manage.trialEnds">{onDateTime(sub.renews, lang)} · {t("manage.hoursLeft", { n: hoursLeft(sub) })}</Row>
          )}
          {sub.renews > 0 && (
            <Row k={status === "stopped" ? "manage.playUntil" : status === "trial" ? "manage.firstCharge" : "manage.nextCharge"}>
              {status === "stopped" || !plan ? onDate(sub.renews, lang) : `${money(plan.price, lang)} · ${onDate(sub.renews, lang)}`}
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
        <p className="hint">{t("manage.demoNote")}</p>
        <p className="hint"><button type="button" className="link-btn" onClick={() => go("faq")}>{t("info.faq")}</button></p>
      </Reveal>
    </div>
  );
}
