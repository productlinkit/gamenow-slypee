# GameNow x Slypee — Play Portal

Mobile-first redesign of the Slypee gaming portal homepage (jazz.slypee.pk), built with React + Vite.

- `src/App.jsx` — view switching (hash-based: `#home`, `#html5`, `#library`, `#profile`, `#plans`), toast, image warm-up
- `src/views/` — Home, HTML5, Library, Profile, Plans (the offer, the subscribe pop-up and the plan status)
- `src/components/` — header, nav tabs, trending carousel, category browser, game card, icons
- `src/lib/subscription.js` — plans, the hand-over to Jazz and the mirror of what Jazz returns
- `public/jazz-subscribe.html` — stand-in for Jazz's own subscription page, so the round trip is clickable
- `src/data/games.json` — game catalogue
- `src/index.css` — all styles
- `public/assets/` — backgrounds, logo, trending banners, game thumbnails
- `public/phone.html` — side-by-side phone/tablet preview (open `/phone.html` on the dev server)

Subscribing is Jazz's, not the portal's: **Subscribe** → pop-up with the available method
(*Subscribe through Jazz*) → `services.jazz.com.pk/signin/Slypee?ref=15&var=1&camp=Slypee_Default`
→ back to `#plans`. A visitor who arrived through a campaign has their own `ref`/`var`/`camp`
in the portal URL; those are captured on arrival and forwarded instead of the defaults.
Jazz's page chooses the package, so the portal only lists prices. Before go-live, fill the
status from Jazz's subscription API (`checkStatus` in `src/lib/subscription.js`) rather than
from return parameters. Set `USE_DEMO_LP = true` there to use the offline stand-in
(`public/jazz-subscribe.html`) when demoing without Jazz.

```
npm install
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # serve the build
```
