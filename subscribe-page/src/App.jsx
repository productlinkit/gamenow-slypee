import { useRef, useState } from "react";
import { CHARGE, COUNTRIES, DAY, TRIAL_DAYS, money, onDate, txnId } from "./config.js";
import { action, campaign, finish } from "./handoff.js";
import slypeeLogo from "./assets/slypee-logo.png";
import gamenowLogo from "./assets/gamenow-logo.png";

/* Managing an existing subscription comes through this page too, and for a VAS there is
   only one thing to manage: whether it keeps running. So "manage" and "unsub" land on the
   same screen — see what you're paying and stop it here. */
const START = action === "unsub" || action === "manage" ? "manage" : "phone";

export default function App() {
  const [step, setStep] = useState(START);   // phone → confirm → done, or manage; closing after either
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const numberRef = useRef(null);
  const digits = number.replace(/\D/g, "");

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* window.close() is ignored in a few browsers — say so rather than sit there */
  const handBack = params => {
    if (finish(params)) setTimeout(() => setStep("closing"), 400);
  };

  const toConfirm = () => {
    if (digits.length < 4) {                       // any number will do, it just can't be empty
      setError("Enter a number — any digits are fine on this demo page.");
      numberRef.current?.focus();
      return;
    }
    setStep("confirm");
    scrollUp();
  };

  const confirm = () => {
    setStep("done");
    scrollUp();
    setTimeout(() => handBack({
      sub: "success", action, trial: "1",
      renews: String(Date.now() + TRIAL_DAYS * DAY),
      msisdn: country.dial + " " + digits,
      txn: txnId()
    }), 1600);
  };

  const cancel = () => handBack({ sub: "cancelled", action });

  return (
    <>
      <div className="world" aria-hidden="true" />

      <header className="top">
        <div className="top-in">
          <span className="brand"><img src={slypeeLogo} alt="Slypee" width="310" height="130" /></span>
          <span className="partner"><small>with</small><img src={gamenowLogo} alt="GameNow" width="547" height="65" /></span>
        </div>
      </header>

      <main>
        <h1 className="title">Subscribe to <span className="hot">Slypee</span></h1>

        {step === "phone" && (
          <PhoneStep
            country={country} number={number} error={error} inputRef={numberRef}
            onCountry={id => { setCountry(COUNTRIES.find(c => c.id === id) || COUNTRIES[0]); setError(""); }}
            onNumber={v => { setNumber(v.replace(/[^\d\s-]/g, "").slice(0, 18)); setError(""); }}
            onFill={() => { setNumber(country.example); setError(""); }}
            onContinue={toConfirm}
            onCancel={cancel}
          />
        )}

        {step === "confirm" && (
          <ConfirmStep
            country={country} digits={digits} agreed={agreed}
            onAgree={setAgreed} onConfirm={confirm} onBack={() => setStep("phone")}
          />
        )}

        {step === "done" && (
          <DoneCard title="You're subscribed!" text="Your free day has started. Taking you back to Slypee…" busy />
        )}

        {step === "manage" && (
          <DoneCard
            title="Your Slypee Games subscription"
            text={money(CHARGE.amount) + " per " + CHARGE.per + ", taken from your balance. Stop it here whenever you like — you keep playing until the period you paid for ends."}
          >
            <Summary rows={[
              ["Service", "Slypee Games"],
              ["Charge", money(CHARGE.amount) + " per " + CHARGE.per + ", incl. tax"],
              ["Taken from", "Your mobile balance"],
              ["Stopping", "Here, or UNSUB to 9825"]
            ]} />
            <button type="button" className="btn" onClick={() => handBack({ sub: "success", action: "unsub", txn: txnId() })}>Stop the subscription</button>
            <button type="button" className="link" onClick={cancel}>Keep it running</button>
          </DoneCard>
        )}

        {step === "closing" && (
          <DoneCard title="All done" text="You can close this window and carry on playing." />
        )}

        <p className="legal">
          Prices include tax. Demo page — no real subscription is created.{campaign && "  ·  " + campaign}
        </p>
      </main>
    </>
  );
}

/* 1. the number the subscription runs on */
function PhoneStep({ country, number, error, inputRef, onCountry, onNumber, onFill, onContinue, onCancel }) {
  return (
    <section className="card">
      <div className="steps"><i className="on" /><i /></div>
      <h2>Your mobile number</h2>
      <p className="lede">The subscription runs on this number, and the charge comes off its balance.</p>
      <label className="field" htmlFor="msisdn">Mobile number</label>
      {/* country + number, drawn as one field (same as the portal's login) */}
      <div className="phone-field" dir="ltr">
        <label className="cc">
          <span className="flag">{country.flag}</span>
          <span className="dial">{country.dial}</span>
          <svg className="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <select aria-label="Country code" value={country.id} onChange={e => onCountry(e.target.value)}>
            {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name} ({c.dial})</option>)}
          </select>
        </label>
        <input
          id="msisdn" ref={inputRef} type="tel" inputMode="tel" autoComplete="tel-national"
          placeholder={country.example} value={number} onChange={e => onNumber(e.target.value)}
        />
      </div>
      <div className="demo-hint">
        <span>Demo page — any number works, nothing is sent or charged.</span>
        <button type="button" className="chip" onClick={onFill}>Fill a number</button>
      </div>
      {error && <p className="err">{error}</p>}
      <button type="button" className="btn" onClick={onContinue}>Continue</button>
      <button type="button" className="link" onClick={onCancel}>Cancel and go back</button>
    </section>
  );
}

/* 2. what it costs, spelled out before the button, and the confirmation */
function ConfirmStep({ country, digits, agreed, onAgree, onConfirm, onBack }) {
  const firstCharge = Date.now() + TRIAL_DAYS * DAY;
  return (
    <section className="card">
      <div className="steps"><i className="on" /><i className="on" /></div>
      <h2>Confirm your subscription</h2>
      <p className="lede">This is exactly what you're agreeing to. Nothing is charged until you confirm.</p>
      <Summary rows={[
        ["Service", "Slypee Games"],
        ["Number", country.dial + " " + digits],
        ["Charge", money(CHARGE.amount) + " per " + CHARGE.per + ", incl. tax"],
        ["Taken from", "Your mobile balance"],
        ["Free trial", TRIAL_DAYS + " day, free"],
        ["First charge", money(CHARGE.amount) + " on " + onDate(firstCharge)],
        ["Stopping", "UNSUB to 9825, any time"]
      ]} />
      <label className="consent">
        <input type="checkbox" checked={agreed} onChange={e => onAgree(e.target.checked)} />
        <span>
          I agree that {money(CHARGE.amount)} is taken from my balance {CHARGE.every}, after the free day, until I stop the subscription.
        </span>
      </label>
      <button type="button" className="btn" disabled={!agreed} onClick={onConfirm}>Subscribe</button>
      <button type="button" className="link" onClick={onBack}>Change number</button>
    </section>
  );
}

/* 3. short hand-off back to the portal; also the frame for the stop screen */
function DoneCard({ title, text, busy, children }) {
  return (
    <section className="card done-card">
      <div className="done-ico">
        <svg viewBox="0 0 36 36" fill="none" stroke="#221A16" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5.5 4L18 7l7.5 9L31 12l-2.5 16h-21z" fill="#FACC3E" /><path className="dim" d="M12.5 22.5h11" strokeWidth="2.2" /><circle cx="18" cy="19" r="1.6" fill="#DB2417" strokeWidth="1.6" />
        </svg>
      </div>
      <h2>{title}</h2>
      <p className="lede">{text}</p>
      {busy && <div className="bar"><i /></div>}
      {children}
    </section>
  );
}

function Summary({ rows }) {
  return (
    <dl className="sum">
      {rows.map(([k, v]) => <div className="row" key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}
