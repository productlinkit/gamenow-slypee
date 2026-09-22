import { Reveal } from "../lib/reveal.jsx";
import { CrownIcon } from "./icons.jsx";
import { TRIAL_DAYS, fromPrice, money } from "../lib/subscription.js";
import { useI18n } from "../i18n/index.jsx";

/* The offer where most visitors actually are: the home page. Same door as everywhere else —
   it opens the subscribe pop-up, which hands over to Jazz. Hidden once they're subscribed. */
export default function SubscribeBanner({ onSubscribe, go }) {
  const { t, lang } = useI18n();
  return (
    <Reveal className="sub-band" i={1}>
      <span className="sb-ico" aria-hidden="true"><CrownIcon /></span>
      <span className="txt">
        <b>{t("home.subTitle")}</b>
        <small>{t("home.subText", { n: TRIAL_DAYS, price: money(fromPrice(), lang) })}</small>
      </span>
      <span className="sb-actions">
        <button type="button" className="chip" onClick={() => go("plans")}>{t("profile.getPlan")}</button>
        <button type="button" className="btn-play" onClick={onSubscribe}>{t("plans.subscribe")}</button>
      </span>
    </Reveal>
  );
}
