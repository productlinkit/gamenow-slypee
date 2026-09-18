import { useEffect, useRef, useState } from "react";
import { Reveal } from "../lib/reveal.jsx";
import { AvatarIcon } from "../components/icons.jsx";
import { stats, dur } from "../lib/history.js";

const DEMO_CODE = "1234";
// "+92 300 ••• 4567" for new numbers, still works for older plain ones
const mask = n => {
  const m = /^(\+\d+) (\d+)$/.exec(n);
  return m ? `${m[1]} ${m[2].slice(0, 3)} ••• ${m[2].slice(-4)}` : `${n.slice(0, 4)} ••• ${n.slice(-4)}`;
};

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

/* One real input (so paste and SMS autofill work) drawn as four digit boxes */
function CodeBoxes({ value, onChange, error }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div className={"otp" + (error ? " err" : "")} onClick={() => ref.current?.focus()}>
      <input
        ref={ref} id="otp" className="otp-input" type="text" inputMode="numeric" autoComplete="one-time-code"
        maxLength={4} aria-label="4-digit login code" value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
      />
      {[0, 1, 2, 3].map(i => (
        <span key={i} className={"otp-box" + (value[i] ? " filled" : "") + (i === Math.min(value.length, 3) ? " active" : "")} aria-hidden="true">
          {value[i] || ""}
        </span>
      ))}
    </div>
  );
}

function LoginCard({ login, notify }) {
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
    if (local.length < 6 || local.length > 13) return fail("Enter a valid phone number");
    setError(""); setCode(""); setStep("code"); setWait(RESEND_AFTER);
  };
  const verify = value => {
    if (value.length < 4) return fail("Enter all 4 digits");
    if (value !== DEMO_CODE) { setCode(""); return fail("That code isn't right — try again"); }
    login({ msisdn: number, country: country.id });
    notify("Welcome! You're logged in 🎉");
  };
  const onCode = v => {
    setCode(v); setError("");
    if (v.length === 4) verify(v); // log in as soon as the 4th digit lands
  };

  return (
    <Reveal as="section" className="card-panel sub narrow login" i={1}>
      <div className="steps-dots" aria-label={`Step ${step === "phone" ? 1 : 2} of 2`}>
        <i className="on" /><i className={step === "code" ? "on" : ""} />
      </div>
      {step === "phone" ? (
        <div className="login-step" key="phone">
          <h2>Log in to Slypee</h2>
          <p>Use your mobile number — no password needed.</p>
          <ul className="perks">
            <li>Save your progress across devices</li>
            <li>Continue games right where you stopped</li>
            <li>1 day of free play on every game</li>
          </ul>
          <form onSubmit={sendCode} noValidate>
            <label htmlFor="msisdn">Phone number</label>
            <div className="row" ref={shakeRef}>
              <div className={"phone-field" + (error ? " err" : "")}>
                <label className="cc" title={country.name}>
                  <span aria-hidden="true">{country.flag}</span>
                  <span className="cc-dial">{country.dial}</span>
                  <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <select aria-label="Country code" value={country.id} onChange={e => { setCountry(COUNTRIES.find(c => c.id === e.target.value)); setError(""); }}>
                    {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name} ({c.dial})</option>)}
                  </select>
                </label>
                <input
                  id="msisdn" type="tel" inputMode="tel" autoComplete="tel-national"
                  placeholder={country.example} value={msisdn}
                  onChange={e => { setMsisdn(cleanNumber(e.target.value)); setError(""); }}
                  aria-invalid={!!error} aria-describedby="login-err"
                />
              </div>
              <button className="btn-play" type="submit">Send code</button>
            </div>
          </form>
          {error && <p className="field-err" id="login-err" role="alert">{error}</p>}
        </div>
      ) : (
        <div className="login-step" key="code">
          <h2>Enter your code</h2>
          <p>We sent a 4-digit code by SMS to <b>{mask(number)}</b>.</p>
          <div className="demo-code">
            <span>🔑 Demo mode — your code is <b>{DEMO_CODE}</b></span>
            <button type="button" className="chip" onClick={() => onCode(DEMO_CODE)}>Fill in</button>
          </div>
          <form onSubmit={e => { e.preventDefault(); verify(code); }}>
            <label htmlFor="otp">Login code</label>
            <div ref={shakeRef}>
              <CodeBoxes value={code} onChange={onCode} error={!!error} />
            </div>
            {error && <p className="field-err" role="alert">{error}</p>}
            <button className="btn-play login-btn" type="submit" disabled={code.length < 4}>Log in</button>
          </form>
          <p className="hint login-links">
            {wait
              ? <span>Resend code in 0:{String(wait).padStart(2, "0")}</span>
              : <button type="button" className="link-btn" onClick={() => { sendCode(); notify("New code sent"); }}>Resend code</button>}
            <button type="button" className="link-btn" onClick={() => { setStep("phone"); setCode(""); setError(""); }}>Change number</button>
          </p>
        </div>
      )}
    </Reveal>
  );
}

function PlayerCard({ user, login, logout, notify, history }) {
  const st = stats(history);
  const freeLeft = user.freeUntil ? Math.ceil((user.freeUntil - Date.now()) / 36e5) : 0;
  return (
    <div className="two tight">
      <Reveal as="section" className="card-panel" i={1}>
        <div className="who">
          <div className="avatar"><AvatarIcon /></div>
          <div className="grow"><h2>Player</h2><p>{mask(user.msisdn)} · {st.plays} {st.plays === 1 ? "play" : "plays"}</p></div>
        </div>
        <div className="stats">
          <div><b>{st.games}</b><span>Games played</span></div>
          <div><b>{dur(st.secs)}</b><span>Play time</span></div>
          <div><b>{st.topGenre || "—"}</b><span>Top genre</span></div>
        </div>
      </Reveal>
      <Reveal as="section" className="card-panel sub" i={2}>
        <h2>Play free for 1 day</h2>
        {freeLeft > 0 ? (
          <p className="active-pass">✓ Free play active · {freeLeft}h left</p>
        ) : (
          <>
            <p>Unlock every game on Slypee for 24 hours.</p>
            <button className="btn-play" type="button" onClick={() => { login({ ...user, freeUntil: Date.now() + 864e5 }); notify("Free play unlocked for 24 hours"); }}>Get free play</button>
          </>
        )}
        <p className="hint"><button type="button" className="link-btn logout" onClick={() => { logout(); notify("You're logged out"); }}>Log out</button></p>
      </Reveal>
    </div>
  );
}

export default function Profile({ active, user, login, logout, notify, history }) {
  return (
    <div className="view" hidden={!active}>
      <section className={user ? undefined : "center-col"}>
      <Reveal className="head"><h2 className="title">{user ? <>My <span className="hot">Profile</span></> : <>Log <span className="hot">in</span></>}</h2></Reveal>
      {user ? <PlayerCard user={user} login={login} logout={logout} notify={notify} history={history} /> : <LoginCard login={login} notify={notify} />}
      </section>
    </div>
  );
}
