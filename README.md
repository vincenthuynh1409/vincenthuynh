# Cybersecurity Portfolio — Vincent Huynh (template)

A dark, terminal-inspired personal portfolio for security professionals (pentesters, SOC analysts,
security researchers). Pure HTML/CSS/JS — no build step, no framework, deploys straight to GitHub Pages.

## 1. Customize your content

Everything lives in `index.html`. Search-and-replace these placeholders:

| Placeholder | Where | Replace with |
|---|---|---|
| `Vincent Huynh` / `V.HUYNH` | Title, header, footer | Your name |
| `your.email@example.com` | Contact section | Your email |
| `github.com/yourusername` | Header resume link is separate; contact + all project cards | Your GitHub |
| `linkedin.com/in/yourusername` | Contact section | Your LinkedIn |
| `twitter.com/yourusername` | Contact section | Your X/Twitter (or delete the link) |
| Hero stats (`4+`, `30+`, `12`) | `.hero-meta` | Your real numbers |
| About paragraphs & `whoami.log` panel | `#about` | Your background |
| Education entries | `#education` | Your real schools, degrees, and dates |
| Timeline entries | `#experience` | Your real roles (add/remove `<li class="timeline-item">` blocks) |
| Project cards | `#projects` | Your real projects — update `href`, title, description, tags |
| Award / certification cards | `#awards` | Your real certs and awards (add/remove `.cert-card` blocks) |
| `assets/Vincent_Huynh_Resume.pdf` | Header "Resume" button | Drop your resume PDF into `assets/` with a matching filename, or remove the button |

In `js/script.js`, update `START_DATE` to when your security career actually started (it powers the
small "uptime" counter in the About panel) — or delete that row from `index.html` if you'd rather skip it.

## 2. Update your contact links

The Contact section is a simple set of direct links (no form) — email, GitHub, Devpost, TryHackMe,
Discord. Edit the `href` and visible text for each `.contact-card` in `index.html` if any of your
handles or URLs change.

## 3. Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `yourusername.github.io` for a root-domain site, or any
   name for a project site).
2. Push this folder's contents to the repo:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   select branch `main` and folder `/ (root)`, then **Save**.
4. Your site goes live at `https://yourusername.github.io/your-repo/`
   (or `https://yourusername.github.io/` if the repo is named `yourusername.github.io`).

## 4. Structure

```
index.html        All page content and structure
css/style.css      Full design system (colors, type, layout, responsive rules)
js/script.js       Hero letter animation, scroll progress, scrollspy nav, card spotlight, reveal, clock
assets/            Drop your resume PDF / og-image / favicon overrides here
```

## 5. Notes

- Colors, fonts, and spacing are all driven by CSS custom properties at the top of `css/style.css`
  (`:root { --bg, --accent, --teal, ... }`) — change the palette in one place.
- Respects `prefers-reduced-motion` (disables the typing/reveal animations for users who've asked for that).
- No external JS dependencies — only Google Fonts are loaded remotely.
- Mobile nav collapses under 920px; layout is responsive down to ~360px.
