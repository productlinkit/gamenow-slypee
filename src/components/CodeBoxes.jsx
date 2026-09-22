import { useEffect, useRef } from "react";
import { useT } from "../i18n/index.jsx";

/* One real input (so paste and SMS autofill work) drawn as four digit boxes.
   Used by the login step and by the subscribe confirmation. */
export default function CodeBoxes({ value, onChange, error, id = "otp", label = "login.codeAria" }) {
  const t = useT();
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div className={"otp" + (error ? " err" : "")} dir="ltr" onClick={() => ref.current?.focus()}>
      <input
        ref={ref} id={id} className="otp-input" type="text" inputMode="numeric" autoComplete="one-time-code"
        maxLength={4} aria-label={t(label)} value={value}
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
