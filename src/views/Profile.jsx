import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "../lib/reveal.jsx";
import CodeBoxes from "../components/CodeBoxes.jsx";
import { mask } from "../lib/phone.js";
import { AVATARS, AVATAR_BY_ID, BellIcon, ClockIcon, CrownIcon, DocIcon, FaqIcon, KeyIcon, LockIcon, PencilIcon, StopIcon, SupportIcon } from "../components/icons.jsx";
import { stats, dur } from "../lib/history.js";
import { REMIND_DAYS, TRIAL_DAYS, daysToRenewal, fromPrice, hoursLeft, loadPrefs, money, onDate, planOf, setPref, statusKey } from "../lib/subscription.js";
import { Title, useI18n, useT } from "../i18n/index.jsx";

const DEMO_CODE = "1234";

const COUNTRIES = [
  ["PK", "🇵🇰", "Pakistan", "+92", "300 1234567"],
  ["ID", "🇮🇩", "Indonesia", "+62", "812 3456 7890"],
  ["IN", "🇮🇳", "India", "+91", "98765 43210"],
  ["BD", "🇧🇩", "Bangladesh", "+880", "1712 345678"],
  ["MY", "🇲🇾", "Malaysia", "+60", "12 345 6789"],
  ["SG", "🇸🇬", "Singapore", "+65", "8123 4567"],
  ["PH", "🇵🇭", "Philippines", "+63", "917 123 4567"],
  ["TH", "🇹🇭", "Thailand", "+66", "81 234 5678"],
  ["VN", "🇻🇳", "Vietnam", "+84", "91 234 56 78"],
  ["SA", "🇸🇦", "Saudi Arabia", "+966", "50 123 4567"],
  ["AE", "🇦🇪", "UAE", "+971", "50 123 4567"],
  ["TR", "🇹🇷", "Türkiye", "+90", "532 123 45 67"],
  ["EG", "🇪🇬", "Egypt", "+20", "100 123 4567"],
  ["NG", "🇳🇬", "Nigeria", "+234", "802 123 4567"],
  ["KE", "🇰🇪", "Kenya", "+254", "712 345678"],
  ["GB", "🇬🇧", "United Kingdom", "+44", "7400 123456"],
  ["US", "🇺🇸", "United States", "+1", "201 555 0123"]
].map(([id, flag, name, dial, example]) => ({ id, flag, name, dial, example }));

const RESEND_AFTER = 30;
// any digits (spaces/dashes allowed while typing); a leading trunk 0 is dropped when sending
const cleanNumber = v => v.replace(/[^\d\s-]/g, "").slice(0, 18);

function LoginCard({ login, notify, go }) {
  const { t, lang } = useI18n();
  // country names in the viewer's language where the browser supports it
  const regionName = useMemo(() => {
    try { const dn = new Intl.DisplayNames([lang], { type: "region" }); return c => dn.of(c.id) || c.name; } catch (_) { return c => c.name; }
  }, [lang]);
  const [step, setStep] = useState("phone");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [msisdn, setMsisdn] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [wait, setWait] = useState(0);
  const shakeRef = useRef(null);
  const local = msisdn.replace(/\D/g, "").replace(/^0+/, "");
  const number = `${country.dial} ${local}`;

  useEffect(() => {
    if (!wait) return;
    const t = setTimeout(() => setWait(w => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const fail = msg => {
    setError(msg);
    shakeRef.current?.animate(
      [{ transform: "none" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(-5px)" }, { transform: "none" }],
      { duration: 400, easing: "ease-out" }
    );
  };

  const sendCode = e => {
    e?.preventDefault();
    if (local.length < 6 || local.length > 13) return fail(t("login.errPhone"));
    setError(""); setCode(""); setStep("code"); setWait(RESEND_AFTER);
  };
  const verify = value => {
    if (value.length < 4) return fail(t("login.err4"));
    if (value !== DEMO_CODE) { setCode(""); return fail(t("login.errCode")); }
    login({ msisdn: number, country: country.id });
    notify(t("toast.welcome"));
  };
  const onCode = v => {
    setCode(v); setError("");
    if (v.length === 4) verify(v); // log in as soon as the 4th digit lands
  };

  return (
    <Reveal as="section" className="card-panel sub narrow login" i={1}>
      <div className="steps-dots" aria-label={t("login.step", { n: step === "phone" ? 1 : 2 })}>
        <i className="on" /><i className={step === "code" ? "on" : ""} />
      </div>
      {step === "phone" ? (
        <div className="login-step" key="phone">
          <h2>{t("login.title")}</h2>
          <p>{t("login.sub")}</p>
          <ul className="perks">
            <li>{t("login.perk1")}</li>
            <li>{t("login.perk2")}</li>
            <li>{t("login.perk3")}</li>
          </ul>
          <form onSubmit={sendCode} noValidate>
            <label htmlFor="msisdn">{t("login.phone")}</label>
            <div className="row" ref={shakeRef}>
              <div className={"phone-field" + (error ? " err" : "")} dir="ltr">
                <label className="cc" title={regionName(country)}>
                  <span aria-hidden="true">{country.flag}</span>
                  <span className="cc-dial">{country.dial}</span>
                  <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <select aria-label={t("login.country")} value={country.id} onChange={e => { setCountry(COUNTRIES.find(c => c.id === e.target.value)); setError(""); }}>
                    {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.flag} {regionName(c)} ({c.dial})</option>)}
                  </select>
                </label>
                <input
                  id="msisdn" type="tel" inputMode="tel" autoComplete="tel-national"
                  placeholder={country.example} value={msisdn}
                  onChange={e => { setMsisdn(cleanNumber(e.target.value)); setError(""); }}
                  aria-invalid={!!error} aria-describedby="login-err"
                />
              </div>
              <button className="btn-play" type="submit">{t("login.send")}</button>
            </div>
          </form>
          {error && <p className="field-err" id="login-err" role="alert">{error}</p>}
          <Agree go={go} />
        </div>
      ) : (
        <div className="login-step" key="code">
          <h2>{t("login.codeTitle")}</h2>
          <p>{t("login.codeSent", { number: "\u2066" + mask(number) + "\u2069" })}</p>
          <div className="demo-code">
            <span className="with-ico"><KeyIcon />{t("login.demo", { code: DEMO_CODE })}</span>
            <button type="button" className="chip" onClick={() => onCode(DEMO_CODE)}>{t("login.fill")}</button>
          </div>
          <form onSubmit={e => { e.preventDefault(); verify(code); }}>
            <label htmlFor="otp">{t("login.code")}</label>
            <div ref={shakeRef}>
              <CodeBoxes value={code} onChange={onCode} error={!!error} />
            </div>
            {error && <p className="field-err" role="alert">{error}</p>}
            <button className="btn-play login-btn" type="submit" disabled={code.length < 4}>{t("login.submit")}</button>
          </form>
          <p className="hint login-links">
            {wait
              ? <span>{t("login.resendIn", { t: `0:${String(wait).padStart(2, "0")}` })}</span>
              : <button type="button" className="link-btn" onClick={() => { sendCode(); notify(t("toast.codeSent")); }}>{t("login.resend")}</button>}
            <button type="button" className="link-btn" onClick={() => { setStep("phone"); setCode(""); setError(""); }}>{t("login.change")}</button>
          </p>
        </div>
      )}
    </Reveal>
  );
}

/* Display name + avatar, kept with the rest of the demo account in this browser */
function EditProfile({ user, save, cancel }) {
  const t = useT();
  const [name, setName] = useState(user.name || "");
  const [avatar, setAvatar] = useState(user.avatar || AVATARS[0].id);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <form className="edit-profile" onSubmit={e => { e.preventDefault(); save({ name: name.trim().slice(0, 20), avatar }); }}>
      <label htmlFor="display-name">{t("profile.name")}</label>
      <input id="display-name" ref={inputRef} type="text" maxLength={20} autoComplete="nickname"
        placeholder={t("profile.player")} value={name} onChange={e => setName(e.target.value)} />

      <p className="edit-label">{t("profile.avatar")}</p>
      <div className="avatar-grid" role="radiogroup" aria-label={t("profile.avatar")}>
        {AVATARS.map(a => (
          <button key={a.id} type="button" role="radio" aria-checked={a.id === avatar} aria-label={a.id}
            className={"avatar-opt" + (a.id === avatar ? " on" : "")} style={{ background: a.bg }} onClick={() => setAvatar(a.id)}>
            {a.svg}
          </button>
        ))}
      </div>

      <div className="edit-actions">
        <button type="button" className="chip" onClick={cancel}>{t("common.cancel")}</button>
        <button type="submit" className="btn-play">{t("common.save")}</button>
      </div>
    </form>
  );
}

/* Where the plan shows up in the app: current state in one line, then through to #plans */
function PlanCard({ sub, go }) {
  const { t, lang } = useI18n();
  const status = statusKey(sub);
  const plan = planOf(sub?.plan);
  const from = money(fromPrice(), lang);
  const line = {
    trial: () => t("profile.planTrial", { n: hoursLeft(sub) }),
    active: () => t("profile.planActive", { plan: t(`plan.${plan.id}`), date: onDate(sub.renews, lang) }),
    stopped: () => t("profile.planStopped", { plan: t(`plan.${plan.id}`), date: onDate(sub.renews, lang) }),
    ended: () => t("profile.planEnded", { price: from }),
    none: () => t("profile.planNone", { n: TRIAL_DAYS, price: from })
  }[status]();
  const running = status === "trial" || status === "active" || status === "stopped";

  return (
    <Reveal as="section" className="card-panel sub" i={2}>
      <h2>{t("profile.planTitle")}</h2>
      {running
        ? <p className={"active-pass" + (status === "stopped" ? " ending" : "")}><span className="pass-ico"><CrownIcon /></span>{line}</p>
        : <p>{line}</p>}
      <button className="btn-play" type="button" onClick={() => go("plans")}>{t(running ? "profile.managePlan" : "profile.getPlan")}</button>
    </Reveal>
  );
}

function PlayerCard({ user, login, logout, notify, history, go, sub, onStop }) {
  const t = useT();
  const st = stats(history);
  const [editing, setEditing] = useState(false);
  const avatar = AVATAR_BY_ID[user.avatar] || AVATARS[0];

  const save = fields => {
    login({ ...user, ...fields });
    setEditing(false);
    notify(t("toast.profileSaved"));
  };

  return (
    <div className="two tight">
      <Reveal as="section" className="card-panel" i={1}>
        <div className="who">
          <div className="avatar" style={{ background: avatar.bg }}>{avatar.svg}</div>
          <div className="grow">
            <h2>{user.name || t("profile.player")}</h2>
            <p><bdi>{mask(user.msisdn)}</bdi> · {t("profile.plays", { n: st.plays })}</p>
          </div>
          {!editing && (
            <button type="button" className="icon-round" aria-label={t("profile.edit")} onClick={() => setEditing(true)}><PencilIcon /></button>
          )}
        </div>
        {editing && <EditProfile user={user} save={save} cancel={() => setEditing(false)} />}
        <div className="stats">
          <div><b>{st.games}</b><span>{t("profile.games")}</span></div>
          <div><b>{dur(st.secs, t)}</b><span>{t("profile.time")}</span></div>
          <div><b>{st.topGenre ? t(`cat.${st.topGenre}`) : "—"}</b><span>{t("profile.genre")}</span></div>
        </div>
      </Reveal>
      <PlanCard sub={sub} go={go} />
      <Reveal as="section" className="card-panel info-menu" i={3}>
        <SubSettings sub={sub} go={go} onStop={onStop} notify={notify} />
        <h2 className="mt">{t("info.heading")}</h2>
        <ul>
          {INFO_MENU.map(([id, icon]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={e => { e.preventDefault(); go(id); }}>
                <span className="im-ico" aria-hidden="true">{icon}</span>
                <span className="im-label">{t(`info.${id}`)}</span>
                <svg className="im-chev flip-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </li>
          ))}
        </ul>
        <p className="hint logout-row"><button type="button" className="link-btn logout" onClick={() => { logout(); notify(t("toast.loggedOut")); }}>{t("profile.logout")}</button></p>
      </Reveal>
    </div>
  );
}

/* Subscription settings, sitting under Plan & billing: what the portal can honestly offer
   next to a subscription Jazz owns — see it, be reminded before it renews, or stop it. */
function SubSettings({ sub, go, onStop, notify }) {
  const { t, lang } = useI18n();
  const [prefs, setPrefs] = useState(loadPrefs);
  const status = statusKey(sub);
  const running = status === "trial" || status === "active";
  const left = daysToRenewal(sub);

  const toggleRemind = () => {
    const next = setPref("remind", !prefs.remind);
    setPrefs(next);
    notify(t(next.remind ? "toast.remindOn" : "toast.remindOff", { n: REMIND_DAYS }));
  };

  return (
    <>
      <h2>{t("settings.subscription")}</h2>
      <ul>
        <li>
          <a href="#plans" onClick={e => { e.preventDefault(); go("plans"); }}>
            <span className="im-ico" aria-hidden="true"><CrownIcon /></span>
            <span className="im-label">{t("info.plans")}</span>
            <span className="im-value">{t(`settings.state.${status}`)}</span>
            <svg className="im-chev flip-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </li>

        {running && sub.renews > 0 && (
          <li>
            <a href="#plans" onClick={e => { e.preventDefault(); go("plans"); }}>
              <span className="im-ico" aria-hidden="true"><ClockIcon /></span>
              <span className="im-label">{t("settings.renewal")}</span>
              <span className="im-value">{onDate(sub.renews, lang)}{left != null && left <= 14 ? ` · ${t("settings.inDays", { n: Math.max(left, 0) })}` : ""}</span>
              <svg className="im-chev flip-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </li>
        )}

        {running && (
          <li>
            <label className="im-row">
              <span className="im-ico" aria-hidden="true"><BellIcon /></span>
              <span className="im-label">{t("settings.remind")}<small>{t("settings.remindNote", { n: REMIND_DAYS })}</small></span>
              <input type="checkbox" className="switch" checked={prefs.remind} onChange={toggleRemind} />
              <span className="switch-track" aria-hidden="true"><i /></span>
            </label>
          </li>
        )}

        {running && (
          <li>
            <button type="button" className="im-row danger-row" onClick={onStop}>
              <span className="im-ico" aria-hidden="true"><StopIcon /></span>
              <span className="im-label">{t("settings.stop")}<small>{t("settings.stopNote")}</small></span>
              <svg className="im-chev flip-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </li>
        )}
      </ul>
    </>
  );
}

const INFO_MENU = [["faq", <FaqIcon />], ["help", <SupportIcon />], ["privacy", <LockIcon />], ["terms", <DocIcon />]];

/* "…agree to our [Terms of Use] and [Privacy Policy]." → two links, in whatever order the language puts them */
function Agree({ go }) {
  const t = useT();
  const targets = ["terms", "privacy"];
  let n = 0;
  return (
    <p className="agree">
      {t("login.agree").split(/(\[[^\]]+\])/).map((part, k) => {
        const m = /^\[(.+)\]$/.exec(part);
        if (!m) return part;
        const id = targets[n++];
        return <a key={k} href={`#${id}`} onClick={e => { e.preventDefault(); go(id); }}>{m[1]}</a>;
      })}
    </p>
  );
}

export default function Profile({ active, user, login, logout, notify, history, go, sub, onStop }) {
  return (
    <div className="view" hidden={!active}>
      <section className={user ? undefined : "center-col"}>
      <Reveal className="head"><h2 className="title"><Title k={user ? "title.profile" : "title.login"} /></h2></Reveal>
      {user ? <PlayerCard user={user} login={login} logout={logout} notify={notify} history={history} go={go} sub={sub} onStop={onStop} /> : <LoginCard login={login} notify={notify} go={go} />}
      </section>
    </div>
  );
}
