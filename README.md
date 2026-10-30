# Divyapriyadharshini S — Personal Portfolio

> "I turn raw data into clear insights and help train reliable AI models."

A hand-built, recruiter-friendly portfolio for **Divyapriyadharshini S** — AI
Tutor, Data Analyst and ML Data Associate in Bengaluru, India. Targeted at
hiring managers for Data Analyst, Business Intelligence, Data Science, GenAI,
Python Developer and Power BI Developer roles.

No framework, no build step, no `node_modules`. Open `index.html` and it works.

---

## Quick start

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000
```

A local server is required (not `file://`) because the site uses ES modules.

---

## Editing content — one file only

**Everything** on the site comes from [`assets/js/data.js`](assets/js/data.js):
name, tagline, badge roles, stat cards, every job, every project, skills,
publications, certificates, contact details, image paths and alt text.

| To change… | Edit in `data.js` |
| --- | --- |
| Hero name, title, tagline, buttons | `hero` |
| "Open to work" role chips | `hero.badge.roles` |
| About paragraphs, stat cards, languages | `about` |
| Jobs in the timeline | `experience` (newest first) |
| Project cards + filters | `projects`, `projectFilters` |
| Power BI gallery (lightbox) | `dashboardGallery.items` |
| Skill groups | `skills` |
| Papers | `publications`, `publicationsNote` |
| Degrees and certificates | `education`, `certificates` |
| Email / phone / links | `contactDetails`, `socials` |
| SEO title, description, OG image | `meta` |

Adding a project is just appending an object to the `projects` array. Set
`category` to one of `projectFilters` and the filter button picks it up
automatically.

---

## Images

All images live in [`assets/images/`](assets/images/) and are currently
generated neutral placeholders **at the exact final pixel size**, so the layout
is already final. To use a real photo: save it with the **same file name and
aspect ratio** and drop it in — no code changes needed.

See [`assets/images/README.md`](assets/images/README.md) for the full size
table. Regenerate placeholders with:

```bash
python3 tools/make_placeholders.py           # fills in missing files only
python3 tools/make_placeholders.py --force   # overwrite everything
```

Every image has: descriptive alt text (in `data.js`), explicit `width`/`height`
so nothing shifts while loading, `loading="lazy"` below the fold, and
`srcset` where a `@2x` retina file is provided. If a file is ever missing, JS
substitutes an inline SVG placeholder at the right ratio rather than showing a
broken-image icon.

---

## Resume

[`resume.pdf`](resume.pdf) is a real, typeset two-page A4 PDF generated from the
same content as the site, so the "Download Resume" button works out of the box.

```bash
python3 tools/make_resume_pdf.py --force   # regenerate
```

To use her own designed resume instead, just replace `resume.pdf`. The script
refuses to overwrite an existing file unless you pass `--force`.

---

## Contact form

Works in two modes, chosen in `data.js` → `contact.formEndpoint`:

- **`null` (default)** — validates in-browser, then opens the visitor's mail
  client pre-filled to `divyapriyadharshinisathish@gmail.com` and shows an
  in-page success state. Zero setup, works on a static host.
- **A URL** — paste a [Formspree](https://formspree.io), Getform or Netlify
  Forms endpoint and the form POSTs JSON directly, no mail client involved.

Validation covers name length, email shape and a 10-character message minimum,
with per-field inline errors, `aria-invalid`, `role="alert"` announcements and a
honeypot field for bots.

---

## Deploying

The site is plain static files — any host works.

**GitHub Pages**
```bash
git init && git add -A && git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/DIVYAPRIYADHARSHINI-GIT/portfolio.git
git push -u origin main
# Settings → Pages → Source: main / root
```
`.nojekyll` is included so the `assets/` folder is served correctly.

**Vercel** — `vercel` (or import the repo). [`vercel.json`](vercel.json) sets
caching and security headers.

**Netlify** — drag the folder into Netlify Drop, or connect the repo.
[`netlify.toml`](netlify.toml) sets publish dir and headers.

### Live deployment

| | |
| --- | --- |
| Production URL | <https://portfolio-divya-6411.vercel.app> |
| GitHub repo | <https://github.com/DIVYAPRIYADHARSHINI-GIT/portfolio> |
| Vercel project | `divya-6411/portfolio` |

Every push to `main` auto-deploys to production.

### Changing the domain later

If a custom domain is attached, update the absolute URLs in these **five**
places (they must be absolute — Open Graph ignores relative image paths):

1. `assets/js/data.js` → `meta.url` and `meta.ogImage.src`
2. `index.html` → `<link rel="canonical">`
3. `index.html` → `og:url`
4. `index.html` → `og:image`, `og:image:secure_url`, `twitter:image`
5. `sitemap.xml` `<loc>` and `robots.txt` `Sitemap:`

Then commit and push; Vercel redeploys automatically.

### How the deep-link rewrite works

`vercel.json` rewrites `/(.*)` → `/index.html`. Vercel resolves **static files
first** and only applies rewrites when nothing matched on disk, so
`resume.pdf`, `/assets/**`, `sitemap.xml` and `robots.txt` are still served as
real files with their correct MIME types — verified in the deploy checks. The
rewrite only catches routes that do not exist, so refreshing or opening a deep
link never 404s.

---

## Testing

A headless-Chrome smoke suite drives the real site over the DevTools protocol —
no npm dependencies:

```bash
python3 -m http.server 8731 &      # serve from this folder
node tools/check_site.mjs
```

**62 checks, all passing.** It verifies that every section rendered from
`data.js` (8 nav links, 5 timeline entries, 4 projects, 4 gallery tiles, 7 skill
groups, 3 publications, 7 certificates), that there is no lorem ipsum, that all
26 images resolve with alt text and explicit dimensions, accessibility basics
(one `h1`, four landmarks, skip link, labelled inputs, no unlabelled buttons),
SEO/OG/JSON-LD tags, the theme toggle (including persistence), all four project
filters, the lightbox (open, next, Escape, focus restore), form validation in
both the invalid and valid paths, back-to-top, `resume.pdf` being served, and no
horizontal overflow or console errors at 390 / 820 / 1440 px.

It also writes screenshots to [`docs/screenshots/`](docs/screenshots/).

---

## Project structure

```
portfolio-divyapriyadharshini/
├── index.html              # semantic shell + SEO/OG/JSON-LD meta
├── resume.pdf              # generated, downloadable
├── assets/
│   ├── css/styles.css      # design tokens, light/dark, all layout
│   ├── js/
│   │   ├── data.js         # ← ALL CONTENT LIVES HERE
│   │   ├── icons.js        # inline SVG icon set
│   │   └── app.js          # renderers + behaviour
│   └── images/             # all imagery + size guide README
├── tools/
│   ├── make_placeholders.py  # generate placeholder imagery
│   ├── make_resume_pdf.py    # generate resume.pdf
│   └── check_site.mjs        # headless-Chrome test suite
├── docs/screenshots/       # generated by the test suite
├── site.webmanifest, robots.txt, sitemap.xml
└── vercel.json, netlify.toml, .nojekyll
```

---

## Design notes

- **Accent**: deep teal `#0b7268` (light) / `#4ad6c4` (dark), paired with an
  indigo `#4338ca` for gradients. Both accents were picked to pass WCAG AA
  against their own surfaces, so the same palette works in either theme.
- **Type**: Plus Jakarta Sans for display, Inter for body, JetBrains Mono for
  kickers, dates and stat numbers — so metrics read as data, not decoration.
- **Dark mode** respects `prefers-color-scheme` on first visit, remembers the
  manual choice in `localStorage`, and is applied before first paint so there
  is no flash of the wrong theme.
- **Motion** is subtle: staggered `IntersectionObserver` section reveals, hover
  lift on cards, hover zoom on screenshots. All of it collapses to nothing
  under `prefers-reduced-motion: reduce`.
- **Accessibility**: semantic landmarks, one `h1`, skip link, visible focus
  rings, `aria-pressed` on toggles, `aria-current`-style active nav state, a
  focus-trapped lightbox dialog that restores focus on close, and alt text on
  every single image.
- **Performance**: no framework, no fonts blocking render, lazy loading below
  the fold, explicit image dimensions to prevent layout shift, and a scroll
  handler throttled with `requestAnimationFrame`.

---

© Divyapriyadharshini S. Built with HTML, CSS and vanilla JavaScript.
