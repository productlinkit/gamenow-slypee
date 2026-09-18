# GameNow x Slypee — Play Portal

Mobile-first redesign of the Slypee gaming portal homepage (jazz.slypee.pk), built with React + Vite.

- `src/App.jsx` — view switching (hash-based: `#home`, `#html5`, `#library`, `#profile`), toast, image warm-up
- `src/views/` — Home, HTML5, Library, Profile
- `src/components/` — header, nav tabs, trending carousel, category browser, game card, icons
- `src/data/games.json` — game catalogue
- `src/index.css` — all styles
- `public/assets/` — backgrounds, logo, trending banners, game thumbnails
- `public/phone.html` — side-by-side phone/tablet preview (open `/phone.html` on the dev server)

```
npm install
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # serve the build
```
