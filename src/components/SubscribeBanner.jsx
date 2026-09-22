import { Reveal } from "../lib/reveal.jsx";
import { BellIcon, CrownIcon } from "./icons.jsx";
import { TRIAL_DAYS, daysToRenewal, onDate, renewalSoon } from "../lib/subscription.js";
import { useI18n } from "../i18n/index.jsx";

/* One band, two jobs. No subscription → the offer, opening the same pop-up as everywhere
   else. Subscribed and renewing in the next few days → the reminder the settings toggle
   switches on, so nobody is surprised by a charge. Otherwise nothing. */
export default function SubscribeBanner({ sub, subscribed, onSubscribe, go }) {
  const { t, lang } = useI18n();

  if (subscribed) {
    if (!renewalSoon(sub)) return null;
    const days = daysToRenewal(sub);
    return (
      <Reveal className="sub-band renewing" i={1}>
        <span className="sb-ico" aria-hidden="true"><BellIcon /></span>
        <span className="txt">
          <b>{days <= 0 ? t("renew.today") : t("renew.soon", { n: days })}</b>
          <small>{t("renew.text", { date: onDate(sub.renews, lang) })}</small>
        </span>
        <span className="sb-actions">
          <button type="button" className="chip" onClick={() => go("plans")}>{t("profile.managePlan")}</button>
        </span>
      </Reveal>
    );
  }

  return (
    <Reveal className="sub-band" i={1}>
      <span className="sb-ico" aria-hidden="true"><CrownIcon /></span>
      <span className="txt">
        <b>{t("home.subTitle")}</b>
        <small>{t("home.subText", { n: TRIAL_DAYS })}</small>
      </span>
      <span className="sb-actions">
        <button type="button" className="chip" onClick={() => go("plans")}>{t("home.subMore")}</button>
        <button type="button" className="btn-play" onClick={onSubscribe}>{t("plans.subscribe")}</button>
      </span>
    </Reveal>
  );
}
