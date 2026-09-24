/* In:   ?ref=15&var=1&camp=Slypee_Default&action=subscribe|manage|unsub&mode=window&return_url=…
   Out:  postMessage to the opener, or <return_url>?sub=success&trial=1&renews=…&msisdn=…&txn=…
         <return_url>?sub=cancelled

   Demo rules: any number is accepted, no code is sent and nothing is charged. */

import { PORTAL_ORIGINS } from "./config.js";

export const query = new URLSearchParams(location.search);
export const action = query.get("action") || "subscribe";

/* Opened in its own window by the portal → hand the result straight back and close, so the
   player is returned to the tab they started in. Opened on its own (popup blocked, or the
   link shared) → fall back to redirecting to return_url.
   Returns true when the window was asked to close, so the page can say so if it doesn't. */
export function finish(params) {
  const target = portalOrigin();
  if (query.get("mode") === "window" && window.opener && !window.opener.closed && target) {
    try {
      window.opener.postMessage({ source: "slypee-subscribe", ...params }, target);
      window.close();
      return true;
    } catch (e) { /* fall through to the redirect */ }
  }
  goBack(params);
  return false;
}

/* Who asked for this. The result is posted straight back to them — it says nothing a portal
   should act on without checking with the operator, so it is answered wherever it came from. */
function portalOrigin() {
  try { return new URL(query.get("return_url") || "/", location.origin).origin; } catch (e) { return location.origin; }
}

/* Sending a browser somewhere is a different matter: only a portal we know. Anything else
   and the player stays here rather than being redirected off to a stranger. */
export const allowedReturn = raw => {
  let url;
  try { url = new URL(raw || "/", location.origin); } catch (e) { return null; }
  const allowed = [location.origin, ...PORTAL_ORIGINS];
  return allowed.includes(url.origin) ? url : null;
};

function goBack(params) {
  const url = allowedReturn(query.get("return_url")) || new URL("/", location.origin);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  location.replace(url.toString());
}

/* Jazz's attribution, shown at the bottom and passed through untouched */
export const campaign = ["ref", "var", "camp"].filter(k => query.get(k)).map(k => k + "=" + query.get(k)).join(" · ");
