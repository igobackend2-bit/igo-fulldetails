# IGO Groups Website — Pending Tasks

Saved on 2026-07-15. Ask me about this anytime and I'll check it against the current state of the repo.

## Step 1 — Deploy the email backend (fixes both forms)
- [ ] Go to script.google.com, sign in as igobackend3@gmail.com
- [ ] New project → delete default code → paste in all of `contact-mailer.gs`
- [ ] Save project (name it "IGO Contact Mailer")
- [ ] Deploy → New deployment → gear icon → "Web app"
- [ ] Execute as: Me | Who has access: Anyone
- [ ] Deploy, authorize Gmail permission prompt
- [ ] Copy the Web app URL (`https://script.google.com/macros/s/.../exec`)

## Step 2 — Paste the URL into the 2 files
- [ ] `contact.html` line ~221: replace `PASTE_YOUR_APPS_SCRIPT_URL_HERE`
- [ ] `careers.html` line ~727: replace `PASTE_YOUR_APPS_SCRIPT_URL_HERE`
- [ ] Test both forms locally — confirm success message, not the red "sending failed" fallback

## Step 3 — Secure the exposed Gmail password
- [ ] Revoke the Gmail App Password hardcoded in `email-server.js` (Google Account → Security → App Passwords) — it's already committed to git
- [ ] Delete `email-server.js` and `server.js` from the repo if unused (they only work on localhost, not the live static site), or at minimum strip the hardcoded password before the next push

## Step 4 — Push and deploy
- [ ] Commit and push repo to GitHub
- [ ] Redeploy the live site
- [ ] Purge CDN/hosting cache (needed for the CSS fix and form URLs to actually take effect — this is what caused the earlier footer-gap bug)

## Step 5 — Verify on the live site
- [ ] Submit a test enquiry via the live contact page — confirm email received
- [ ] Submit a test application via the live careers page — confirm email received
- [ ] Re-check careers.html, about.html, contact.html, leadership.html, gallery.html no longer show blank space below the footer

## Optional / not blocking
- [ ] Add JobPosting schema (JSON-LD) to careers.html for Google Jobs / AI search visibility

---
### Background context (for reference)
- Root cause of the footer blank-space bug: the LIVE site was serving an older `assets/css/style.css` (37,288 chars) missing the `.whatsapp-float { position: fixed }` rule and other newer sections that ARE present in the local repo's copy (41,472 chars, 983 lines). Local file already validated clean (balanced braces, no conflicting overrides). Deploying local as-is should fix it — just needs a cache purge after deploy.
- Affected pages by the gap bug (as last checked): about.html, contact.html, leadership.html, gallery.html, careers.html.
