# GameNow x Slypee — Play Portal

Mobile-first redesign of the Slypee gaming portal homepage (jazz.slypee.pk).

- `index.html` — built page, open directly or serve the folder
- `assets/` — backgrounds, logo, trending banners, game thumbnails
- `_dev/` — sources: `index.template.html`, `style.css`, `games.json`

Run locally:

```
python3 -m http.server 8080
```

After editing `_dev/style.css` or `_dev/index.template.html`, rebuild with `python3 _dev/build.py`.
