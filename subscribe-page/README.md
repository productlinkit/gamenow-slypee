# Slypee subscription page

The page a player is sent to when they tap **Subscribe** on the Slypee portal, and the page
that stops a subscription again. It is deliberately separate from the portal: its own folder,
its own host, its own link. Nothing here imports anything from the portal.

It is a small React + Vite app of its own, with its own `package.json`:

```
subscribe-page/
  index.html        Vite entry
  src/App.jsx       the screens: number → confirmation → hand-back, and the stop screen
  src/config.js     the charge, the free days and the countries offered
  src/handoff.js    the URL contract — reads the link, sends the result back
  src/styles.css    all styles
  src/assets/       logos and backgrounds, so it stands on its own
```

```bash
cd subscribe-page
npm install
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # serve the build
```

## Deploy

Build, then point any static host at `dist/`. Paths in the build are relative, so it runs at
any address — its own host, a subfolder, a `file://` preview.

```bash
# Vercel — vercel.json holds the build settings
vercel deploy subscribe-page --prod

# nginx / Apache — build and copy dist/ to the web root
npm run build && rsync -av dist/ user@host:/var/www/subscribe/
```

The portal's dev server serves a built copy at `/subscribe/index.html`; after changing this
page, run `npm run sync:subscribe` in the portal to refresh `public/subscribe/`.

Then tell the portal where it now lives, in `src/lib/subscription.js`:

```js
export const SUBSCRIBE_ORIGIN = "https://subscribe.slypee.pk";   // "" = same host as the portal
```

That one line also decides which origin the portal will accept a result from, so a page
served anywhere else is ignored.

## The link the portal opens

```
<this page>/?ref=15&var=1&camp=Slypee_Default&action=subscribe&mode=window&return_url=<portal>/#home
```

| Parameter | What it does |
|---|---|
| `ref`, `var`, `camp` | Jazz's attribution. The portal forwards whatever the visitor arrived with, or the organic defaults. Shown at the bottom of the page and passed through untouched. |
| `action` | `subscribe` (default) or `unsub` / `manage` — both of the latter open the stop screen. |
| `mode` | `window` means the portal opened this in its own window and is listening; see below. |
| `return_url` | Where to send the player back to. Only same-origin URLs are accepted. |

## What it sends back

Opened as a window (`mode=window`), it posts the result to the opener and closes itself:

```js
window.opener.postMessage({
  source: "slypee-subscribe",
  sub: "success" | "cancelled",
  action: "subscribe" | "unsub",
  trial: "1",
  renews: "<epoch ms>",
  msisdn: "+62 81234567890",
  txn: "SL4F2A9C"
}, "<portal origin>");
```

Opened any other way — the pop-up was blocked, or the link was shared — it redirects to
`return_url` with the same values as query parameters, and the portal reads them there.
`?status=success` is understood as well as `?sub=success`.

## The two screens

**Subscribe** — country picker and mobile number, then a confirmation stating the charge, the
free day, the first charge date and how to stop. Nothing is sent until the box is ticked.

**Stop** (`action=unsub` or `action=manage`) — states what is being charged and offers
*Stop the subscription* or *Keep it running*.

## What to change

| Change | Where |
|---|---|
| The charge | `CHARGE = { amount: 12, per: "day", … }` in `src/config.js` — the only price on the page |
| Free days | `TRIAL_DAYS` in `src/config.js` |
| Countries offered | `COUNTRIES` in `src/config.js` |
| Wording | `src/App.jsx`; the page is English only |
| Look | The `:root` tokens at the top of `src/styles.css` — they mirror the portal's |

## Before this takes real money

This is a prototype page, and it behaves like one:

- **any number is accepted** — there is no check that the number exists or belongs to whoever
  is typing, and no PIN is sent;
- **nothing is charged** — no billing system is called, and the result is made up on the spot;
- **the result is not proof.** A subscription only counts once the operator's own status API
  says so. Anyone can type `?status=success` into the portal's address bar, which is why
  `checkStatus()` in the portal is a stub waiting to be filled in.

Replace this page with the operator's real sign-in page, or put the real confirmation and
billing behind it, before it goes anywhere near a live account.
