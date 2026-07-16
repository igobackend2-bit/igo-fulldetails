# IGO Groups Website

Official website for **IGO Groups (India Green Organics)** — a Chennai-headquartered diversified agritech & agribusiness conglomerate operating 26 brands across agri-inputs, farm engineering, organic food retail, agri-fintech, land investment, import-export trade and precision agritech. Live at [igogroups.in](https://igogroups.in).

## Tech Stack

- Plain HTML5, CSS3, and vanilla JavaScript — no framework, no bundler, no build step
- `server.js` — a dependency-free Node.js static file server (built-in `http`/`fs` modules only), used for local dev and as the production entry point
- Google Apps Script (`contact-mailer.gs`) — intended email backend for the contact and careers application forms
- No database — all content is hand-authored static HTML

## Features

- 26 individual brand pages (`/brands/`) across Core Agri, Retail & Food, Finance & Realty, Tech & Digital, Trade & Export, Health & Wellness and Sustainability
- 18 individual department pages (`/departments/`), each with a hero photo and team photo section
- Media gallery with an "Office & Team" directory — click through to any of 15 department teams' photo sets
- Careers page with live job listings, modal job details, and an online application form
- Contact page, awards, leadership, CSR, news and testimonials sections
- SEO/AEO/GEO-ready out of the box: `robots.txt`, `sitemap.xml`, and `llms.txt` are already in place, with AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Amazonbot) explicitly allowed

## Project Structure

```
/                       26 top-level pages (index.html, about.html, brands.html, careers.html, ...)
/departments/           18 department detail pages
/brands/                26 individual brand detail pages
/assets/
  /css/style.css        Site-wide styles
  /js/main.js           Shared JS (nav, dark mode toggle, scroll-reveal animations, etc.)
  /img/, /images/       Office photos, team photos, brand logos, gallery assets
  /img/office/teams/    Photos grouped per department team (used by gallery.html + departments pages)
  /blog/                Blog post images
server.js               Static file server entry point (production entry point)
contact-mailer.gs       Google Apps Script for contact/careers form email delivery
email-server.js         Legacy local-only mail relay — not used by the live site (see Known Limitations)
robots.txt              Crawler rules (search engines + AI bots explicitly allowed)
sitemap.xml             XML sitemap
llms.txt                Company facts summary for AI/LLM discovery
PENDING-TASKS.md        Running checklist of outstanding setup/deployment tasks
```

Three pages — `project-detail.html`, `sector-detail.html`, and `service-detail.html` — are dynamic templates that read a URL query parameter to render the right content, rather than one static file per item.

## Getting Started

### Prerequisites

- Node.js 18+ (only needed to run the local static file server — no other runtime dependency)
- Any modern browser

### Install dependencies

None required — `server.js` only uses Node's built-in modules, and there is no `npm install` step.

### Configuration (before the forms will work)

The contact form (`contact.html`) and the careers "Apply Now" form (`careers.html`) both call a Google Apps Script Web App URL that is currently a placeholder:

1. Deploy `contact-mailer.gs` as a Google Apps Script Web App (steps are in the comments at the top of that file).
2. Copy the resulting `https://script.google.com/macros/s/.../exec` URL.
3. Replace `PASTE_YOUR_APPS_SCRIPT_URL_HERE` in both `contact.html` and `careers.html` with that URL.

### Run the app

```bash
node server.js
```

Then open `http://localhost:3000` (or the port shown in the console). Alternatively, most pages can simply be opened directly in a browser as static files.

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Runs `server.js` — same server used in production |
| `npm run dev` | Alias for `npm start` (no separate dev mode exists) |
| `npm test` | Placeholder only — no test suite is configured yet |

## Deployment

1. Commit and push changes to GitHub.
2. Redeploy on your hosting provider (auto-deploys on push if connected; otherwise trigger a manual deploy).
3. Purge any CDN/hosting cache if changes don't appear immediately — this has caused stale-CSS issues on this site before.

## Project Status & Known Limitations

This site is actively maintained, and most pages are complete and live. From a full site audit, current known issues are:

- **Contact & careers forms don't send email yet** — both still point at `PASTE_YOUR_APPS_SCRIPT_URL_HERE` instead of a deployed Apps Script URL. See Configuration above and `PENDING-TASKS.md`.
- **`email-server.js` is legacy and contains a hardcoded credential** — it's a local-only mail relay (listens on `localhost:3001`) that neither `contact.html` nor `careers.html` actually calls. It should be deleted or have its credential removed/rotated before this repo is made public, since the credential is already committed to git history.
- **Git remote may contain an embedded token** — double-check `git remote -v` / `.git/config` for a plaintext credential in the remote URL and switch to a credential manager or SSH key if found.
- **4 of 18 departments have no team photo**: Administration, Farm Manager Welfare, Management Operations, and Networking & Associations currently show a placeholder icon on `departments.html` because no source photo exists for them yet.
- **Office/team photography is candid, not staged** — most existing photos are unstaged phone shots of the real office. They've been cropped and color-corrected for consistency, but a proper reshoot (people facing camera, tidier desks, consistent lighting) would meaningfully improve the careers and gallery pages.
- **No automated build for new team photos** — dropping a new image into `assets/img/office/teams/<team>/` does not automatically appear on the site; the corresponding `<img>`/array entries in `gallery.html` and the relevant `departments/*.html` page must be added by hand.
- **No test suite** — `npm test` is a placeholder; there is no automated testing of any kind.
- **Large uncommitted working-tree diff** — at last check, `git status` showed most HTML/CSS/JS files as modified against the last commit (independent of any specific feature change), which usually indicates an editor reformatted files on save. Review with `git diff <file>` before committing to avoid pushing unintended whitespace/formatting churn.

## Suggested Next Steps for Whoever Picks This Up

1. Deploy `contact-mailer.gs` and wire up both forms (contact + careers) — this is the highest-impact fix, since neither form currently works.
2. Remove or rotate the hardcoded credential in `email-server.js`, and delete the file entirely if it's confirmed unused.
3. Audit the git remote/config for exposed tokens and replace with a credential manager or SSH-based auth.
4. Review and commit (or discard) the large pending working-tree diff so future diffs are meaningful again.
5. Source real photos (or schedule a reshoot) for the 4 departments still missing a team photo, and for a more polished "Life at IGO" careers section.
6. Consider a small build script or GitHub Action so dropping a new image into `assets/img/office/teams/<team>/` automatically updates `gallery.html` and the matching department page, instead of requiring manual HTML edits.
7. Add a basic automated check (even a simple link/image-existence checker) to catch broken references or truncated HTML files before they reach production — this repo has twice had pages silently truncated (missing closing tags), which a simple CI check would catch immediately.

## License

All rights reserved © IGO Groups.
