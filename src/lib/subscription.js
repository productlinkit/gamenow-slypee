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

/* Where Subscribe sends people: Jazz's own sign-in page for Slypee.
     https://services.jazz.com.pk/signin/Slypee?ref=15&var=1&camp=Slypee_Default
   ref / var / camp are Jazz's attribution parameters, and the defaults below are the organic
   entry — someone who found the portal on their own, through no campaign. A visitor who did
   arrive through a campaign carries their own values in the portal's URL; those are captured
   on arrival and passed straight through, so Jazz attributes the subscription correctly.

   Note the page takes no plan: the package is chosen and confirmed on Jazz's side, which is
   why the portal only shows what the plans cost. */
export const JAZZ = {
  url: "https://services.jazz.com.pk/signin/Slypee",
  params: { ref: "15", var: "1", camp: "Slypee_Default" }
};
/* true → use the offline stand-in in public/ instead, for demos with no Jazz page */
export const USE_DEMO_LP = false;
export const DEMO_LP = "/jazz-subscribe.html";

export const CURRENCY = "PKR";
export const TRIAL_DAYS = 1;
const DAY = 864e5;

/* Monthly cycles and longer — the same subscription, just fewer renewals and a better rate.
   Demo prices: Slypee's own notice quoted a daily rate, so these are ours to set. `days` is
   what the renewal maths runs on; `months` is only for the label. */
export const PLANS = [
  { id: "month", months: 1, days: 30, price: 250 },
  { id: "months3", months: 3, days: 90, price: 675 },
  { id: "months6", months: 6, days: 180, price: 1200, best: true },
  { id: "year", months: 12, days: 365, price: 2100 }
];
export const PLAN_BY_ID = Object.fromEntries(PLANS.map(p => [p.id, p]));
export const planOf = id => PLAN_BY_ID[id] || PLANS[0];
export const perMonth = p => p.price / p.months;
/* how much cheaper per month than renewing every month — 0 for the monthly plan itself */
export const savingPct = p => Math.round((1 - perMonth(p) / perMonth(PLANS[0])) * 100);
/* the "from …" price: the best monthly rate on offer, which is the longest package */
export const fromPrice = () => Math.min(...PLANS.map(perMonth));

/* What a plan unlocks, counted from the real catalogue */
export const COUNTS = {
  all: GAMES.length,
  h5: GAMES.filter(g => g.t === "h5").length,
  app: GAMES.filter(g => g.t === "app").length
};

export const money = (amount, lang = "en", digits = 0) => {
  try {
    return new Intl.NumberFormat(lang, { style: "currency", currency: CURRENCY, minimumFractionDigits: 0, maximumFractionDigits: digits }).format(amount);
  } catch (_) { return `${CURRENCY} ${Math.round(amount * 100) / 100}`; }
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
  if (!sub.renews || !PLAN_BY_ID[sub.plan]) return sub;          // nothing to roll forward
  if (sub.renews > Date.now()) return sub;
  if (sub.status !== "active") return { ...sub, status: "ended" };
  const plan = planOf(sub.plan);
  const periods = Math.ceil((Date.now() - sub.renews) / (plan.days * DAY));
  return { ...sub, trial: false, renews: sub.renews + periods * plan.days * DAY };
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

/* Where the stand-in page sends players back to. Jazz's real page returns them to the URL
   configured on their side, so this is only used by the demo landing page. */
export const returnUrl = () => {
  try { return location.origin + location.pathname + "#plans"; } catch (_) { return "#plans"; }
};

export function jazzUrl(action = "subscribe") {
  const params = campaign();
  if (!USE_DEMO_LP) {
    const url = new URL(JAZZ.url);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return url.toString();
  }
  return `${DEMO_LP}?${new URLSearchParams({ ...params, action, return_url: returnUrl() })}`;
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
  const plan = PLAN_BY_ID[result.plan || ""] || null;
  if (result.action === "unsub") {
    const current = loadSub();
    if (!current) return null;
    const stopped = { ...current, status: "stopped", txn: result.txn || current.txn };
    write(SUB_KEY, stopped);
    return stopped;
  }
  const now = Date.now();
  const renews = result.renews > now ? result.renews
    : plan ? now + (result.trial ? TRIAL_DAYS : plan.days) * DAY
    : 0;                                             // 0 = Jazz didn't say; don't pretend
  const sub = { status: "active", plan: plan ? plan.id : null, trial: result.trial, since: now, renews, txn: result.txn };
  write(SUB_KEY, sub);
  return sub;
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

/* The plan Jazz named, when it named one — the mirror works without it too */
export const knownPlan = sub => (sub && PLAN_BY_ID[sub.plan]) || null;

/* Older demo accounts kept their free day on the user as `freeUntil` — carry it over */
export function adoptFreeDay(until) {
  if (!(until > Date.now())) return null;
  const sub = { status: "active", plan: PLANS[0].id, trial: true, since: until - TRIAL_DAYS * DAY, renews: until, txn: "" };
  write(SUB_KEY, sub);
  return sub;
}
