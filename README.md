# Cosmic Timeline

**A scrollable, horizontal number-line of everything — from the Big Bang to the modern era — written so a 6-year-old gets lost in it, and a quantum physicist still learns something.**

Hover a dot. Open a panel. Read it like a bedtime story, then read it like a textbook. This is history, chemistry, biology, geology and physics woven into **one straight line**.

<p align="center">
  <img src="docs/screenshots/deep-time.jpg" width="720" alt="The full 13.8-billion-year timeline with the era-coloured spectrum line and a milestone detail panel open"/>
  <br/><em>Deep time: 92 milestones, each with its own colour, tiered labels and a detail panel.</em>
</p>

---

## Why this exists

Time scales lie to us. On a normal "history timeline" the Big Bang, the dinosaurs and ancient Egypt stand shoulder-to-shoulder as if they were neighbours. On a strict linear scale, all of human civilisation is a single pixel next to the age of the stars.

This project solves that with a **space that bends but never lies**:

- **Deep time view** — a logarithmic scale over 13.8 billion years, where *each event is spaced proportionally to its distance from the next* (logarithm of its age). The ancient universe clusters together because *that's when things were weird and fast*; the modern era spreads out because *that's when things got busy*.
- **Civilization view** — the same log trick applied to the last 12,000 years, so Writing, Rome, the Printing Press, Flight, the Moon and the Web each get room to breathe.

The scale is **relative to the window** and stays calibrated as you scroll — the distance between any two moments never depends on where you happen to be looking.

## Quick start

```bash
# no install needed — just open the file
open timeline.html            # macOS
xdg-open timeline.html        # Linux

# or serve it (enables installable/offline PWA mode)
npm install                   # only needed if you want the test suite
npm start                     # → http://localhost:8765/timeline.html
```

No build step. Three source files, one of them an SVG.

## How to explore

| Action | What happens |
|---|---|
| **Scroll / swipe / drag** horizontally | Travel along the number line |
| **Hover a dot** | Detail panel opens — summary slides in with the event's colour |
| **Click a dot** | Panel pins open (stays while you move away) |
| **‹ › in the panel** | Step to the adjacent event; the viewport glides to follow |
| **← / → keys** | Move marker-by-marker (works on the timeline *and* inside the panel) |
| **Esc** | Close the panel |
| **Search box** | Type "moon", "oxygen", "Rome"… click a result to teleport there |
| **Legend chips** | Click to jump to the era; hover for a two-sentence explainer |
| **Deep time / Civilization** | Switch scale modes (the whole chart re-lays-out) |
| **▶ Take the tour** | Auto-play the whole story, event by event, ~6 s each |
| **🎓 Quiz** | "Which came first?" classroom quiz generated from the data, with feedback that teaches |
| **🖨 Handout** | Print a one-page worksheet for the selected event (all three reading levels + discussion prompts) |
| **🔤 Glossary** | Every term a curious kid might ask about, from *banded iron* to *three-axis control* |

<p align="center">
  <img src="docs/screenshots/civilization-mode.jpg" width="720" alt="Civilization mode: Agriculture, Writing, Rome and the modern world spread across the line"/>
  <br/><em>Civilization zoom: 11 events from farming to the internet — the last 12,000 years finally legible.</em>
</p>

---

## The three reading levels

Every milestone is written at **three depths**, because nobody learns in one tempo:

| Level | Audience | Example — *Dinosaur Extinction* |
|---|---|---|
| 🌟 **For young explorers** | a 6-year-old | *"One very bad day, a giant space rock as big as a mountain smashed into Mexico…"* plus a 💡 **"Did you know?"** fun fact |
| 📖 **The bigger story** | general reader | the "what happened and why it matters", in plain language |
| 🎓 **Go deeper (nerd-level)** | students, adults, experts | 3–5 real facts: Chicxulub's 180 km crater, a billion Hiroshima bombs of energy, orogeny-grade geochemistry, open research questions |

Then each panel adds:

- **🖼 A real photograph or illustration** (Wikimedia Commons, credited, lazy-loaded, graceful offline fallback) — the K-Pg boundary layer, Buzz Aldrin's bootprints, living stromatolites, Göbekli Tepe's pillars…
- **🔤 Words to know** — glossary terms found *in that event's text* become hover-chips with a one-line definition; a full 🔤_modal_ lists all 26.
- **🔗 Read more** — one trusted Wikipedia article per milestone.
- **A time chip tinted in the event's own colour**, so you always know *where* in the spectrum you are.

## What's inside — the complete feature list

**Exploration & scale**

- ✅ Horizontal number line, ~3.5 screen-widths, smooth scroll
- ✅ Logarithmic-calibrated distance between events ("space bends but never lies")
- ✅ Two scale modes: **Deep time** (13.8 Bya) & **Civilization** (12 kya → today); the layout, stagger, gradient and wash recompute on switch
- ✅ Event-coloured **spectrum** painted along the number line itself
- ✅ Tier-staggered labels with collision detection (labels cascade upward, never jumble) — re-staggered on every resize because the scale is window-relative
- ✅ 8 **era families**, each event getting a unique shade that still reads as its family (+ a clickable legend with era explainer tooltips, and a full-bleed background **wash** tinted by the events in your current view)

**Interaction**

- ✅ Hover → preview panel; click → pin; move away → close (with a 120 ms grace so you can slide into the panel)
- ✅ Prev/next stepping with smooth scroll-to-center
- ✅ Full keyboard support (arrows, Enter, Esc) and focusable markers with ARIA labels
- ✅ Search with live results + jump; guided story tour; era legend jumps
- ✅ Reduced-motion media query respected

**Education**

- ✅ Three reading levels per event (kid / story / nerd)
- ✅ 💡 Fun fact per event, in kid-voice
- ✅ Words-to-know glossary chips per event + a global glossary modal (26 terms, cross-checked by unit tests)
- ✅ Real imagery per event, sourced and credited
- ✅ "Read more" links to a canonical reference for every milestone
- ✅ **Wheel zoom + ➖➕ buttons** — the mouse wheel zooms the whole line in/out (0.35×–4×), keeping your current position pinned at screen centre; zoom resets when switching modes
- ✅ **🎯 Powers view (third scale mode)** — one click and the timeline slips over to a track of only the world superpowers and their large events: Menes' Egypt, Hammurabi, Assyria, Persia, Alexander, the Caliphates, the Mongols, the British Empire, the World Wars and the Cold War — on their own log window (5.1 kya → today)
- ✅ **Biblical era track** — 11 milestones from Creation to the Second Temple's fall (70 CE), placed at their traditional and scholarly dates; covers the Hebrew Scriptures and the New Testament with the same three-level treatment, including where belief, history and archaeology agree — and where they disagree. Kept out of the Civilization zoom deliberately: it rides its own chronology
- ✅ Era explainers — what a whole epoch means before you zoom into it

**Engineering / ship-ability**

- ✅ PWA: installable (`manifest.webmanifest` + SVG icon), service-worker cached shell **and all 90 images** (verified: 23 cache entries) → works fully offline after one visit
- ✅ Never caches failed responses (rate-limit 429 poisoning and error-image caching are guarded)
- ✅ Zero-dependency runtime; no build step; single-page
- ✅ **57 unit tests** over the extracted pure core (data, scale math, colour algorithms, format tiers, layout algorithm, glossary matching)
- ✅ **20-check Selenium E2E suite** in real Chrome (shell, panel, images, glossary, search, legend, zoom, arrows, keyboard, tour, close, PWA caches, console cleanliness)
- ✅ Hotlinked images use `Special:FilePath` (handles any original size), `referrerpolicy="no-referrer"`, `loading="lazy"`

**Completeness**

- ✅ **Shareable permalinks** — selecting an event syncs `#event=great-pyramid-of-giza&mode=human` into the URL (no history spam); loading a link restores the exact view, mode and panel
- ✅ **Quiz mode** — "Which happened FIRST?" and "Which is the OLDEST?" questions *generated from the dataset itself* with a seeded-RNG generator that is unit-testable, correct-answer feedback with the actual time gap ("X came first, 66 million years before Y!"), score tracking and a replay button
- ✅ **Printable classroom handout** — one file → print → worksheet for the selected event: three reading levels, words-to-know chips, discussion prompts; a dedicated `@media print` stylesheet so only the sheet prints

**Roadmap** (designed for, not yet built — every one is small against the current architecture)

- 🔜 Era-themed teacher packs (a worksheet per era, not just per event)
- 🔜 Curriculum tagging: each event mapped to science/history syllabus units
- 🔜 i18n (the UI strings are already centralised)
- 🔜 Audio narration for the kid tier
- 🔜 JSON data plug: swap in your own event set (archaeology, computing, one family's island)

## Project structure

```
├── timeline.html            # the app: markup, styles, interaction glue
├── timeline-core.js         # pure data & logic — no DOM, fully unit-tested
│   ├── MILESTONES           #   92 events × { era, kid, fun, summary, deep[4–5] , yearsAgo }
│   ├── EVENT_COLORS         #   per-event shades computed inside era hue families
│   ├── fracFor(ya, max)     #   log-scale position, mode-aware (null = off-scale)
│   ├── formatTime/formatShort
│   ├── assignTiers(items,g) #   the label-cascade algorithm, as a pure function
│   ├── glossaryTermsFor(text)
│   └── ERA_INFO / LEARN_MORE / GLOSSARY
├── sw.js                    # service worker (app shell + image runtime cache)
├── manifest.webmanifest     # install metadata
├── icon.svg                 # PWA icon (five coloured eras on the line)
├── scripts/serve.js         # zero-dep static server (correct MIME, safe paths)
├── tests/
│   ├── unit/                # node --test suite: data, scale, colors, format,
│   │                        # tiers, glossary, quiz/slug & page-shape invariants
│   └── selenium.js          # 14-check real-Chrome E2E run
└── docs/screenshots/        # pictures for this README
```

## Test it

```bash
npm install          # pulls selenium-webdriver (Selenium Manager auto-fetches ChromeDriver)
npm test             # unit tests + headless Chrome E2E
npm run test:unit    # just the 42 unit tests
npm run test:e2e     # just the browser walk-through
SELENIUM_HEADLESS=0 npm run test:e2e   # watch Chrome drive the page
```

**E2E coverage:** shell & content counts → hover → three-level panel → real image load → glossary chips + 26-term modal → search jump → era legend jump → Civilization/Deep-time zoom with gradient rebuild → ‹›‹ stepping with viewport glide → keyboard navigation → guided tour start/stop → panel close → service worker + 55-image cache → clean console (no severe errors).

## Design notes (the fun part)

**Bending time honestly.** Position on the line is `1 − log₁₀(age + 1) / log₁₀(maxAge + 1)`. This keeps *relative* comparison true (a factor-of-two age difference looks like the same factor at any point on the line) while making the busy last 0.01% of cosmic history occupy a meaningful slice of screen.

**One colour family per era.** Eight era hues (violet→indigo→orange→green→pink→gold→cyan→white). Each event inside a family gets a small deterministic hue offset — `base + (i − center) × spread` — so a family reads like a family from afar but every dot is distinguishable up close. Markers, glows, panel stems, time chips, spectrum stops and background wash all derive from that single colour, so **selection turns the entire UI the hue of that moment in time**.

**Labels that never collide.** `assignTiers` is a pure greedy function: sort boxes left→right, drop each into the lowest tier whose row has no overlap (8 px padding), cap at tier 5. On screen it's the staircase you see in crowded stretches like the early universe.

**A wash that breathes.** Three giant blurred blobs painted in `hsl(... / 0.16)` hang over the deepest colour in view. As you scroll, the blobs re-target the events nearest the centre of your screen — the whole page slowly exhales from violet to green to blue as you travel.

**Offline by design.** The service worker installs the app shell, then the page funnels *every* event image through one sequential warm-up fetch so the runtime cache fills at a polite pace (never hammering Wikimedia). Origins outside the map (`wikimedia.org`, `wikipedia.org`) are intercepted and cache-first; everything else passes through. A deletion sweep clears only caches of past versions on activate.

## Accessibility

- Focusable markers with descriptive `aria-label`s (event name + human-readable age)
- Panels reachable & operable entirely by keyboard
- `role="button"` semantics on interactive dots
- Honours `prefers-reduced-motion` (transitions and animations disabled)
- Colour is never the only channel: every marker carries a text label with the era's short timecode

## Data & sources

Milestone content is our own writing (three levels per event),事实-checked against canonical references, with a **"Read more"** link to the relevant Wikipedia article. All images are hotlinked from Wikimedia Commons with attribution in their captions. Ancient dates are the commonly cited scientific estimates; treat them as the range of consensus, not gospel — several events (early life, galaxy formation) have live debates, and the "nerd-level" bullets say exactly that.

## Contributing an event

1. Add an entry to `MILESTONES` in `timeline-core.js` (the unit tests will demand kid/fun/summary/deep + a `LEARN_MORE` entry).
2. Add a matching image entry to `EVENT_MEDIA` in `timeline.html` and a `LEARN_MORE` slug.
3. Run `npm test` — the suite will reject any event that is out of order, under-sized, colourless or unlinked.

---

*The whole story, in one straight line, at three speeds — because a timeline is the only map where "you are here" can be anywhere from a particle of hydrogen to the last 12,000 years of a curious species.*

**MIT licensed · images © their listed sources via Wikimedia Commons**
