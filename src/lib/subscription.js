import { GAMES } from "./games.js";

/* Slypee Games is a Jazz value-added service, and the subscribing is Jazz's job — this portal
   never takes a payment and never asks for a PIN.

     organic visit → [Subscribe] → pop-up with the available method ("Subscribe through Jazz")
     → Jazz landing page (Jazz confirms, bills and sends its own SMS) → back to the portal.

   All this module keeps is a mirror of what Jazz decided, plus the handover: the landing-page
   URL we send the player to, and the result we read when they come back.

   ⚠ The mirror is filled from the return parameters because this is a demo. In production read
   the status from Jazz's subscription API instead (see verifyReturn) — anyone can type
   ?sub=success into the address bar. */

export const SERVICE = { name: "Slypee Games", shortcode: "9825", unsub: "UNSUB", status: "STATUS" };

/* Where Subscribe sends people.

   The subscription page is its own page on its own address (public/subscribe.html). Leave
   SUBSCRIBE_ORIGIN empty and it is served from this host; set it to the separate subdomain
   once DNS points there — e.g. "https://subscribe.slypee.pk" — and nothing else changes,
   because the page talks back to the portal by postMessage and the origin below is the only
   one the portal will listen to.

   Jazz's own page (below) needs a live Jazz data connection, so it can't be walked through
   anywhere else; switch to it with USE_JAZZ_LP when that's wanted. Either way ref / var / camp
   are Jazz's attribution parameters, and the defaults are the organic entry — someone who
   found the portal on their own. A visitor who arrived through a campaign carries their own
   values in the portal's URL; those are captured on arrival and passed straight through. */
export const JAZZ = {
  url: "https://services.jazz.com.pk/signin/Slypee",
  params: { ref: "15", var: "1", camp: "Slypee_Default" }
};
/* The landing page the Subscribe button opens. Ours is the working one; point this at the
   operator's landing page (a temporary "https://lp.example.com" stands for it in the brief)
   or set USE_JAZZ_LP for Jazz's own sign-in, and nothing else has to change. */
export const SUBSCRIBE_ORIGIN = "";                  // "" = same host; else "https://subscribe.…"
export const SUBSCRIBE_PAGE = "/subscribe.html";
/* true → hand over to Jazz's own page instead of ours (needs a live Jazz connection) */
export const USE_JAZZ_LP = false;

export const TRIAL_DAYS = 1;
const DAY = 864e5;

/* No package list lives here on purpose. Jazz's page is where packages and prices are shown
   and chosen, so the portal states none of them — a price copied into this repo would only
   go stale. What the portal knows is whether a subscription is running. */

/* What a plan unlocks, counted from the real catalogue */
export const COUNTS = {
  all: GAMES.length,
  h5: GAMES.filter(g => g.t === "h5").length,
  app: GAMES.filter(g => g.t === "app").length
};

export const onDate = (ts, lang = "en") => {
  try { return new Intl.DateTimeFormat(lang, { day: "numeric", month: "short" }).format(ts); }
  catch (_) { return new Date(ts).toDateString(); }
};
export const onDateTime = (ts, lang = "en") => {
  try { return new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(ts); }
  catch (_) { return new Date(ts).toLocaleString(); }
};

/* ---------- The mirror ----------
   { status: "active" | "stopped", plan, trial, since, renews, txn }
     active   — Jazz says the subscription is running; it renews on its own
     stopped  — stopped at Jazz; playable until `renews`, then it's gone */
const SUB_KEY = "slypee.sub";
const PENDING_KEY = "slypee.subpending";   // set while the player is over on the Jazz page

const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
const write = (key, val) => { try { val == null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(val)); } catch (_) {} };

/* Jazz renews on its own, so a date that has passed on an active subscription has simply
   rolled on. (The real portal would refresh this from the status API.) */
function settle(sub) {
  if (!sub) return null;
  if (!sub.renews || sub.renews > Date.now()) return sub;
  /* the date Jazz gave us has passed: a running subscription has renewed on its own, we
     just don't know the new date — a stopped one has run out. */
  return sub.status === "active"
    ? { ...sub, trial: false, renews: 0 }
    : { ...sub, status: "ended" };
}

export function loadSub() {
  const stored = read(SUB_KEY, null);
  const settled = settle(stored);
  if (JSON.stringify(settled) !== JSON.stringify(stored)) write(SUB_KEY, settled);
  return settled;
}

export const active = sub => !!sub && sub.status !== "ended" && (!sub.renews || sub.renews > Date.now());
export const statusKey = sub => (active(sub) ? (sub.trial ? "trial" : sub.status) : sub ? "ended" : "none");
export const hoursLeft = sub => Math.ceil(Math.max(0, sub.renews - Date.now()) / 36e5);
export const clearSub = () => { write(SUB_KEY, null); write(PENDING_KEY, null); write(CAMP_KEY, null); write(PREFS_KEY, null); };

/* ---------- Handover to Jazz ---------- */
const CAMP_KEY = "slypee.camp";   // how this visitor reached the portal, kept for attribution

/* Call once on arrival: a campaign's parameters are remembered so they still reach Jazz
   after the visitor has clicked around the portal first. */
export function captureCampaign(search = "") {
  const q = new URLSearchParams(search);
  const found = {};
  for (const k of Object.keys(JAZZ.params)) { const v = q.get(k); if (v) found[k] = v; }
  if (Object.keys(found).length) write(CAMP_KEY, found);
  return campaign();
}
export const campaign = () => ({ ...JAZZ.params, ...(read(CAMP_KEY, null) || {}) });
export const isOrganic = () => !read(CAMP_KEY, null);

/* Where the subscription page sends the player back to: the home page, ready to play —
   this is a VAS sign-up, not a shop checkout, so there's nothing to review afterwards.
   (Jazz's own page returns them to the URL configured on their side.) */
export const returnUrl = () => {
  try { return location.origin + location.pathname + "#home"; } catch (_) { return "#home"; }
};

export function jazzUrl(action = "subscribe") {
  const params = campaign();
  if (USE_JAZZ_LP) {
    const url = new URL(JAZZ.url);                      // Jazz's page sets its own return
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return url.toString();
  }
  const q = new URLSearchParams({ ...params, action, mode: "window", return_url: returnUrl() });
  return `${SUBSCRIBE_ORIGIN}${SUBSCRIBE_PAGE}?${q}`;
}

/* The one origin the portal accepts a subscription result from */
export const subscribeOrigin = () => {
  if (!SUBSCRIBE_ORIGIN) { try { return location.origin; } catch (_) { return ""; } }
  try { return new URL(SUBSCRIBE_ORIGIN).origin; } catch (_) { return SUBSCRIBE_ORIGIN; }
};

/* Open the subscription page in its own window, so the portal stays where it is and can
   pick the result up the moment it lands. Returns the window, or null if the browser blocked
   it — in which case the caller navigates instead and the page comes back by redirect. */
export function openSubscribeWindow(action = "subscribe") {
  const url = jazzUrl(action);
  try {
    const w = window.open(url, "slypee-subscribe", "popup=yes,width=480,height=780,noopener=no");
    if (w) { w.focus?.(); return w; }
  } catch (_) { /* blocked */ }
  location.assign(url);
  return null;
}

/* A result posted back by that window. Anything that isn't ours is ignored. */
export function readMessage(origin, data) {
  if (origin !== subscribeOrigin()) return null;
  if (!data || typeof data !== "object" || data.source !== "slypee-subscribe") return null;
  const state = String(data.sub || "");
  if (!["success", "cancelled", "failed"].includes(state)) return null;
  return {
    state,
    trial: data.trial === "1" || data.trial === true,
    renews: Number(data.renews) || 0,
    txn: typeof data.txn === "string" ? data.txn.slice(0, 32) : "",
    msisdn: typeof data.msisdn === "string" ? data.msisdn.slice(0, 20) : "",
    action: data.action === "unsub" ? "unsub" : "subscribe"
  };
}

/* Remember that we sent them out, so a return without a result still makes sense */
export function markPending(action = "subscribe") {
  const pending = { action, ts: Date.now() };
  write(PENDING_KEY, pending);
  return pending;
}
export const loadPending = () => read(PENDING_KEY, null);
export const clearPending = () => write(PENDING_KEY, null);

/* ---------- Coming back from Jazz ---------- */
/* Jazz's own page decides what, if anything, it appends to the return URL, so read the
   usual spellings and normalise them. Returns null when this is an ordinary page load —
   which is also what a successful return looks like if Jazz appends nothing at all. */
const STATES = {
  success: "success", ok: "success", subscribed: "success", active: "success", "1": "success",
  cancel: "cancelled", cancelled: "cancelled", canceled: "cancelled",
  fail: "failed", failed: "failed", error: "failed", "0": "failed"
};

export function readReturn(search = "") {
  const q = new URLSearchParams(search);
  const raw = q.get("sub") || q.get("status") || q.get("result") || q.get("subscribed");
  const state = raw ? STATES[String(raw).toLowerCase()] : null;
  if (!state) return null;
  return {
    state,
    plan: q.get("plan"),
    trial: q.get("trial") === "1",
    renews: Number(q.get("renews")) || 0,
    txn: q.get("txn") || q.get("ref_id") || "",
    msisdn: q.get("msisdn") || "",
    action: q.get("action") || "subscribe",
    reason: q.get("reason") || ""
  };
}

/* Demo stand-in for the real check. In production ask Jazz's subscription-status API about
   this number and fill the mirror from that answer — never from the query string, which
   anyone can type. Returning null here means "we don't know yet". */
export async function checkStatus() {
  return null;
}

export const verifyReturn = result => result?.state === "success";

/* Write what Jazz told us into the mirror. Jazz may not name the plan or the renewal date;
   what it didn't say stays unknown rather than being invented. */
export function applyReturn(result) {
  clearPending();
  if (!verifyReturn(result)) return null;
  if (result.action === "unsub") {
    const current = loadSub();
    if (!current) return null;
    const stopped = { ...current, status: "stopped", txn: result.txn || current.txn };
    write(SUB_KEY, stopped);
    return stopped;
  }
  const now = Date.now();
  const sub = {
    status: "active", trial: result.trial, since: now,
    renews: result.renews > now ? result.renews : 0,      // 0 = Jazz didn't say; don't pretend
    txn: result.txn, msisdn: result.msisdn || ""
  };
  write(SUB_KEY, sub);
  return sub;
}

/* A live subscription is the account. Someone who has subscribed has already proved the
   number is theirs, so the portal never asks them to log in again — not after the return,
   not after a reload. */
export const accountFor = sub => (active(sub) ? { msisdn: sub.msisdn || "", country: "", fromSub: true } : null);

/* "0812****789" — enough of the number for the subscriber to recognise their own, no more.
   Keeps the dial code when the number carries one. */
export function maskMsisdn(number) {
  if (!number) return "";
  const m = /^(\+\d+)[\s-]*(\d+)$/.exec(String(number).trim());
  if (m && m[2].length >= 6) return `${m[1]} ${m[2].slice(0, 3)}****${m[2].slice(-3)}`;
  const digits = String(number).replace(/\D/g, "");
  if (digits.length < 7) return digits;
  return `${digits.slice(0, 4)}****${digits.slice(-3)}`;
}

/* ---------- Portal-side settings ----------
   Billing itself belongs to Jazz, so the only switch that is really ours is whether the
   portal reminds the player before a renewal. Kept per browser, like the rest of the demo. */
const PREFS_KEY = "slypee.subprefs";
export const REMIND_DAYS = 3;

export const loadPrefs = () => ({ remind: true, ...(read(PREFS_KEY, null) || {}) });
export function setPref(key, value) {
  const next = { ...loadPrefs(), [key]: value };
  write(PREFS_KEY, next);
  return next;
}

/* days until the next renewal, or null when there's nothing to count down to */
export function daysToRenewal(sub) {
  if (!active(sub) || !sub.renews) return null;
  return Math.ceil((sub.renews - Date.now()) / DAY);
}
/* true when the portal should show the renewal reminder */
export function renewalSoon(sub, prefs = loadPrefs()) {
  const days = daysToRenewal(sub);
  return prefs.remind && days !== null && days <= REMIND_DAYS;
}

/* Older demo accounts kept their free day on the user as `freeUntil` — carry it over */
export function adoptFreeDay(until) {
  if (!(until > Date.now())) return null;
  const sub = { status: "active", trial: true, since: until - TRIAL_DAYS * DAY, renews: until, txn: "" };
  write(SUB_KEY, sub);
  return sub;
}
