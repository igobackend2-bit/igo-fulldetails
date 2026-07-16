# IGO Groups Website

Static marketing website for **IGO Groups**, an India-based agritech & agribusiness conglomerate (26 brands, 18 departments). Plain HTML/CSS/JS — no build step, no framework, no npm dependencies for the site itself.

## Tech stack

- **HTML5** — one file per page, hand-authored (no templating engine)
- **CSS** — single stylesheet at [assets/css/style.css](assets/css/style.css) (light + dark theme via a `.dark` class toggle)
- **JavaScript** — single vanilla script at [assets/js/main.js](assets/js/main.js): mobile nav, sticky header, dark-mode toggle, animated counters, filters, scroll-reveal, particle network background
- **Node.js** (`>=22.x`) — only used to serve the static files, not to build them

## Structure

```
.
├── index.html, about.html, brands.html, services.html, ...   # 26 top-level pages
├── brands/            # 26 individual brand pages (brands/cropcare.html, etc.)
├── departments/        # 18 individual department pages
├── assets/
│   ├── css/style.css   # single global stylesheet
│   ├── js/main.js      # single global script
│   ├── img/            # products, office, gallery, projects, services images
│   ├── images/brands/  # brand logos
│   └── blog/           # blog images
├── server.js            # static file server (used in production)
├── email-server.js       # alternate Express/Nodemailer contact-form backend (not currently wired up)
├── contact-mailer.gs     # Google Apps Script — the mailer actually used by contact.html
├── sitemap.xml, robots.txt
└── package.json
```

Detail/template pages (`project-detail.html`, `service-detail.html`, `sector-detail.html`) render content driven by a URL parameter rather than being duplicated per item.

## Running locally

No dependencies to install for the site itself:

```bash
npm start        # node server.js — serves the site at http://localhost:3000
```

`server.js` is a dependency-free static file server: it maps extensionless URLs to `.html`, serves `assets/` with long-lived caching, and falls back to `404.html` (if present) on a miss. It's the entry point Render (or any Node host) runs in production.

## Contact form

`contact.html` (and the careers "Apply Now" form) POST to a **Google Apps Script** web app deployed from [contact-mailer.gs](contact-mailer.gs), which routes messages to the right department inbox (sales, HR, support) and sends an auto-reply. Setup steps are documented at the top of that file.

`email-server.js` is an **alternate** Express + Nodemailer implementation of the same routing logic, meant to run standalone on port 3001. It is not currently referenced by any page's `fetch()` call and its dependencies (`express`, `nodemailer`, `cors`) are not listed in `package.json`. Treat it as a reference implementation rather than an active service.

> **⚠️ Security note:** [email-server.js](email-server.js) hardcodes a Gmail App Password in plain text. This file is committed to a **public** GitHub repository, so that credential is currently exposed. Revoke/rotate the App Password in the Google Account security settings and remove the hardcoded secret (load it from an environment variable instead) as soon as possible.

## Deployment

- Hosted as a static Node site (see the header comment in `server.js` — written for Render).
- `sitemap.xml` / `robots.txt` are maintained by hand and reference `https://www.igogroups.com/`.

## Content areas

- **Brands** (`brands.html` + `brands/*.html`) — 26 IGO Groups brands spanning agri operations, fintech, retail, energy, and franchising
- **Departments** (`departments.html` + `departments/*.html`) — 18 internal departments (HR, engineering, R&D, purchase, etc.)
- **Corporate pages** — about, leadership, teams, careers, awards, CSR, testimonials, FAQs, gallery, news, contact
- **"Why IGO" pages** — `why-ecosystem.html`, `why-pan-india.html`, `why-tech-farming.html`, `why-zero-middlemen.html`
