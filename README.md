# GameNow x Slypee — Play Portal

Mobile-first redesign of the Slypee gaming portal homepage (jazz.slypee.pk), built with React + Vite.

- `src/App.jsx` — view switching (hash-based: `#home`, `#html5`, `#library`, `#profile`, `#plans`), toast, image warm-up
- `src/views/` — Home, HTML5, Library, Profile, Plans (the offer, the subscribe pop-up and the plan status)
- `src/components/` — header, nav tabs, trending carousel, category browser, game card, icons
- `src/lib/subscription.js` — plans, the hand-over to Jazz and the mirror of what Jazz returns
- `subscribe-page/` — the subscription page, its own React + Vite app ready for its own host (`npm run sync:subscribe` builds it into `public/subscribe/` so the dev server serves it too)
- `src/data/games.json` — game catalogue
- `src/index.css` — all styles
- `public/assets/` — backgrounds, logo, trending banners, game thumbnails
- `public/phone.html` — side-by-side phone/tablet preview (open `/phone.html` on the dev server)

Subscribing happens off the portal: **Subscribe** → pop-up with the available method
(*Subscribe through Jazz*) → the subscription page, opened in its own window → it posts the
result back and closes, landing the player on `#home`, subscribed and signed in. That page
lives in `subscribe-page/`, deploys anywhere, and `SUBSCRIBE_ORIGIN` in
`src/lib/subscription.js` points the portal at it — see `subscribe-page/README.md`.

The portal itself quotes no price and holds no packages: it mirrors whether a subscription is
running. A visitor who arrived through a campaign has their own `ref`/`var`/`camp` in the URL;
those are captured on arrival and forwarded. While this is a prototype the subscription and
the session are not remembered between page loads (`REMEMBER`), so every refresh starts the
flow over; `?reset` clears saved games and history too. Before go-live, fill the status from
the operator's subscription API (`checkStatus`) rather than from return parameters.

```
npm install
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # serve the build
```
