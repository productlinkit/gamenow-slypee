# GameNow x Slypee — Play Portal

Mobile-first redesign of the Slypee gaming portal homepage (jazz.slypee.pk), built with React + Vite.

- `src/App.jsx` — view switching (hash-based: `#home`, `#html5`, `#library`, `#profile`, `#plans`), toast, image warm-up
- `src/views/` — Home, HTML5, Library, Profile, Plans (the offer, the subscribe pop-up and the plan status)
- `src/components/` — header, nav tabs, trending carousel, category browser, game card, icons
- `src/lib/subscription.js` — plans, the hand-over to Jazz and the mirror of what Jazz returns
- `public/subscribe.html` — Slypee's own subscription page (its own URL, portal theme), where the number and package are taken
- `src/data/games.json` — game catalogue
- `src/index.css` — all styles
- `public/assets/` — backgrounds, logo, trending banners, game thumbnails
- `public/phone.html` — side-by-side phone/tablet preview (open `/phone.html` on the dev server)

Subscribing happens off the portal: **Subscribe** → pop-up with the available method
(*Subscribe through Jazz*) → `/subscribe.html` → back to `#plans` with the result. That page
is separate from the app, carries the portal's theme, accepts any number (demo) and is where
packages and prices live — the portal itself quotes none, and only mirrors whether a
subscription is running. A visitor who arrived through a campaign has their own `ref`/`var`/
`camp` in the portal URL; those are captured on arrival and forwarded. Set `USE_JAZZ_LP = true`
in `src/lib/subscription.js` to hand over to Jazz's real page instead (it needs a live Jazz
data connection). Before go-live, fill the status from Jazz's subscription API (`checkStatus`)
rather than from return parameters.

```
npm install
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # serve the build
```
