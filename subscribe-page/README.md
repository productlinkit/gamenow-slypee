# Slypee subscription page

The page a player is sent to when they tap **Subscribe** on the Slypee portal, and the page
that stops a subscription again. It is deliberately separate from the portal: its own folder,
its own host, its own link. Nothing here imports anything from the portal.

```
subscribe-page/
  index.html        the whole page — markup, styles and logic in one file
  assets/           logos and backgrounds, so it stands on its own
```

## Deploy

Static files, nothing to build. Point any static host at this folder:

```bash
# Vercel
vercel deploy subscribe-page --prod

# nginx / Apache — copy the folder to the web root
rsync -av subscribe-page/ user@host:/var/www/subscribe/
```

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
| The charge | `var CHARGE = { amount: 12, per: "day", … }` — the only price on the page |
| Free days | `var TRIAL_DAYS = 1` |
| Countries offered | `var COUNTRIES = [ … ]` |
| Wording | The markup; the page is English only |
| Look | The `:root` tokens at the top — they mirror the portal's |

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
