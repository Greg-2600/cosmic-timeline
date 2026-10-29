# Cosmic Timeline — Roadmap v2

**Where we are (v1.0):** 76 milestones across 10 era tracks (Deep Time log-scale, Civilization zoom, superpowers "Powers" track, Biblical track), three reading levels per event, images with credits, glossary chips + modal, quiz mode, guided tour, printable handouts, shareable permalinks (#event + #mode), wheel zoom, era legend with explainers, search, era colour spectrum and context wash, installable/offline PWA, 50 unit tests + 17-check Selenium suite, README.

This document is the plan for **v1.1 (ship it as a public product)** and **v1.2 (classroom/editorial depth)**. Each block lists the goal, the concrete work items, and how we'll know it's done.

---

## v1.1 — "Make it a real site" (public release)

### 1. Deploy & available everywhere
**Goal:** anyone can open a URL and use/install it — not just localhost.
- [x] ~~Serve~~ (already a single-page static file set)
- [ ] Publish to **GitHub Pages** (repo `cosmic-timeline`, GitHub Actions workflow: run unit + Selenium on push, deploy `main` to Pages)
- [ ] Netlify/Cloudflare Pages as backup with branch previews for PRs
- [ ] Custom domain + HTTPS (PWA install requires it)
- [ ] Update `start_url`/`scope`/manifest icons for the live domain; verify offline install on Android/iOS from production
- [ ] Social meta tags (Open Graph/Twitter card) + a nicer favicon set (192/512 PNG rendered off the SVG for services that don't take SVG)
- [ ] Sitemap/no-robots tweaks + a public GitHub README with the deployed link banner

### 2. Compliance, credits and privacy
**Goal:** safe to share with schools.
- [ ] Central **IMAGE CREDITS page**: generated automatically from `EVENT_MEDIA` (title → caption + Commons source URL) rather than inline-only captions; link it from the footer/README
- [ ] License audit pass: prefer CC-BY/CC-BY-SA/PD images for every event (flag any commercial-nc ones)
- [ ] Privacy: no cookies, no analytics → add a tiny "no cookies, no tracking" statement; optional opt-in anonymous counter (self-hosted, no fingerprinting)
- [ ] Accessibility audit via Lighthouse ≥ 95: fix any contrast, focus-order or heading issues; add `aria-live` announcements for panel opens in screen readers

### 3. Performance polish
**Goal:** load < 1 MB, feel instant.
- [ ] Preload only the *visible* event images (dropped from 320px REST thumbs to on-demand full loads already — audit each event's image size; convert any > 2 MB originals to ~700 px thumbs with a build script and document them as pre-generated sizes)
- [ ] Split inline `<script>` into `timeline.js` (keeps one `timeline.html` for the file:// double-click use case via a tiny loader fallback… or accept two-file reality; choose one)
- [ ] `content-visibility: auto` on the track for cheap rendering; lazy legend/tooltip
- [ ] Lighthouse perf budget in CI (fail the build if we regress)

---

## v1.2 — "Classroom & editorial depth"

### 4. Era-themed teacher packs (print)
**Goal:** a teacher can print a ready worksheet for *an era*, not one event.
- Build a **Print Pack builder UI**: pick era (and/or era + event count) → generate a multi-page worksheet mixing the era's events: timeline strip to fill in, kid-level story, 3 discussion questions per event, glossary crosswords/quiz, an essay prompt
- Generate it from the existing data (no new content needed) using the print stylesheet; expose **"Download as PDF"** via the browser's print-to-PDF
- Deliverable: Era Print Pack menu in the `Glossary/Quiz/Handout` bar; unit test the pack data assembly; Selenium checks the menu + preview content

### 5. Curriculum mapping
**Goal:** each event knows which standard topic it teaches, so teachers can find it.
- Add `curriculum: ["biology", "geology", "ancient-history", …]` tags per milestone (data-only change; core validation enforces the tag list)
- New **filter chips** row: click "Chemistry" → timeline dims non-matching events
- Search also matches tags

### 6. Shareable & embeddable
- Deep-linkable **embeds**: an iframe/`<script>` snippet with `?event=<slug>&mode=<mode>&era=<era>` rendering a mini timeline (light DOM)
- Pick-and-share button in the panel that copies a short link (permalink already supports the state; we just add a "Copy" UI + clipboard API)
- OG image generation: a serverless function (or build-time script) renders a panel screenshot per event for social sharing

### 7. Quiz v2 (teacher mode)
- Question types added: **timeline order** (drag 4 events into order), **era matching** ("which era does this belong to?"), **image quiz** (name the event from its picture)
- **Teacher mode**: choose eras included, difficulty (2 vs 4 options), question count, and export a CSV of the class's scores (no server: local storage per browser, with a reset button)
- Core quiz generator gains `quiz(options)` with deterministic seed — full unit coverage

### 8. New content tracks (data-only, cheap)
- [ ] More **World Powers** events: Ottomans (1453), Mughals, Portuguese/Spanish colonial empires, Dutch VOC (1602), Qing, Meiji Japan, post-1991 multi-polar (China's rise, EU)
- [ ] **Biblical track additions**: Daniel & Babylonian court, Esther & Purim, Paul's missionary journeys, the Dead Sea Scrolls (1947), the Council of Nicaea (325 CE)
- [ ] **Science & technology events** worth adding: the printing of Mercator's atlas, Darwin's *Origin* (1859), the discovery of DNA's structure we already have; Marie Curie (1903), the Pill (1960), Apollo–Soyuz (1975), the Human genome we have; mRNA vaccines (2020)
- [ ] **Mesoamerican/African/Asian civilisations** to balance the Western tilt: Olmec (1200 BCE), Axum, Ghana/Mali empires, Great Zimbabwe, Ming treasure voyages (1405)

Each is data + media + tests — the pipeline exists.

---

## v1.3 — "Made for every reader"

### 9. i18n
- Centralise every user-facing string into `timeline-core.js` `STRINGS[locale]`
- Add `?lang=` + a language switch: English first, then the version that makes sense for deployment (Dutch, German, Spanish…) — the data stays English initially; UI strings are translatable cheaply, content later
- MILESTONES: split `kid/fun/summary` per locale as a slug-map (optional `translations`); fall back to English

### 10. Audio narration (kid tier)
- Web Speech API (`speechSynthesis`) reads the "🌟 For young explorers" text panel-by-panel — no server, works offline
- ▶️ Play / ⏸ pause button inside the panel + the guided tour gets a narrated mode (speech + auto-advance)
- Respect `prefers-reduced-motion` and stop on panel close

### 11. Story-reading mode (for shared screens)
- Full-screen, large-type view of one event at a time (kids' tier first, generous readable layout, next/prev)
- Great for reading at bedtime, on a projector, or from the back of a classroom

### 12. Ahead (parked)
- Client-side **search by meaning** (small local embeddings? or just better keyword match)
- Comment-free **riddle mode** puzzles from the glossary ("I iron-rusted the ocean before I filled the sky — who am I?")
- Mobile app wrapping (Capacitor) if we want App-store presence; the PWA may be enough
- Multi-timeline switcher: swap the dataset (archaeology of one country, the history of computing, a family story)
- CI: GitHub Actions matrix for the Selenium suite + Lighthouse budget + a public "Recently added" page from git history

---

## Definition of done — what we check before shipping each item
1. **Data/`timeline-core.js` change** → unit tests updated & green; ordering/content invariants hold; `LEARN_MORE`/media/legend chips all updated in the same commit
2. **UI change** → Selenium test added or updated; no console errors; keyboard path still works; `prefers-reduced-motion` respected
3. **Every new milestone** → kid/fun/summary/deep + LEARN_MORE + EVENT_MEDIA + image verified by a browser `Image()` load test + link check script
4. **New feature** → README updated; accessibility hooks (`aria`, focus) present; offline behaviour verified after hard reload

## Recommended next three PRs (in order)
1. **Deploy to GitHub Pages with CI** (makes every other item shippable publicly) — ~1 session
2. **Era-themed teacher packs + Print/Download** (v1.2 flagship: no-new-data, high classroom value) — ~1 session
3. **Curriculum tags + filter chips** (data + small UI; quick win) — ~half session
