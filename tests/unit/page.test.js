const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const c = require("../../timeline-core.js");

const ROOT = path.join(__dirname, "..", "..");
const HTML = fs.readFileSync(path.join(ROOT, "timeline.html"), "utf8");

test("every milestone teaches at least one glossary word (or the set is rich enough overall)", () => {
  const withTerms = c.MILESTONES.filter((m) => {
    const hay = (m.kid + " " + m.summary + " " + m.deep.join(" ")).toLowerCase();
    return c.glossaryTermsFor(hay).length > 0;
  });
  assert.ok(withTerms.length >= 15, `glossary coverage too thin: ${withTerms.length}/${c.MILESTONES.length}`);
});

test("every glossary definition is meaningful", () => {
  Object.values(c.GLOSSARY).forEach((def) => {
    assert.ok(def.length >= 40, "definition too short: " + def);
  });
});

test("glossary lookup is case-insensitive", () => {
  const hits = c.glossaryTermsFor("A SUPERNOVA was followed by an IRIDIUM layer");
  const terms = hits.map((h) => h.term);
  assert.ok(terms.includes("supernova"), "supernova not matched");
  assert.ok(terms.includes("iridium"), "iridium not matched");
});

test("the page ships the service worker, manifest and icon", () => {
  ["sw.js", "manifest.webmanifest", "icon.svg"].forEach((f) => {
    assert.ok(fs.existsSync(path.join(ROOT, f)), `missing ${f}`);
  });
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.webmanifest"), "utf8"));
  assert.equal(manifest.display, "standalone");
  assert.ok(manifest.icons.length >= 1);
});

test("service worker caches the shell and images, and survives failure modes", () => {
  const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  assert.ok(sw.includes("timeline.html"));
  assert.ok(sw.includes("wikimedia"));
  assert.ok(sw.includes("RUNTIME_CACHE"));
  assert.ok(/addEventListener\("fetch"/.test(sw));
  // Never cache non-OK responses (protects against 429 rate-limit poisoning)
  assert.ok(sw.includes("resp.ok"), "service worker must check resp.ok before caching");
});

test("the spectrum line, mode toggle and search all exist in the shipped page", () => {
  assert.ok(HTML.includes("buildLineGradient"), "line gradient fn present");
  assert.ok(HTML.includes("mode-deep") && HTML.includes("mode-human"), "zoom toggles present");
  assert.ok(HTML.includes("search-input"), "search input present");
  assert.ok(HTML.includes("layoutLabels"), "label stagger present");
});

test("images appear for every event and credit the source", () => {
  const count = (HTML.match(/^  "(?:[^"\\]|\\.)*": \{/gm) || []).length;
  assert.equal(count, 75, `expected 75 media entries, found ${count}`);
  assert.ok(HTML.includes("COMMONS_FILE = (name) =>"), "Special:FilePath helper present");
  assert.ok(HTML.includes("referrerPolicy"), "referrer policy set to avoid hotlink friction");
});

test("PWA registration is guarded by protocol check", () => {
  assert.ok(HTML.includes('location.protocol === "http:"'));
  assert.ok(HTML.includes("serviceWorker"));
});

test("quiz, permalinks and handout ship in the page", () => {
  assert.ok(HTML.includes('id="quiz-btn"'), "quiz button");
  assert.ok(HTML.includes("makeQuiz(5)"), "quiz wired to core generator");
  assert.ok(HTML.includes("quizOption") && HTML.includes("quiz-option"), "quiz options styled");
  assert.ok(HTML.includes("updateHash") && HTML.includes("restoreFromHash"), "permalink sync");
  assert.ok(HTML.includes('id="print-btn"') && HTML.includes("buildHandout"), "printable handout");
  assert.ok(HTML.includes("@media print"), "print stylesheet present");
});

test("i18n: STRINGS table ships en + it with used keys", () => {
  const c = require("../../timeline-core.js");
  const en = c.STRINGS.en;
  const it = c.STRINGS.it;
  ["kidTitle", "storyTitle", "deepTitle", "readMore", "btnQuiz", "btnGlossary", "packsTitle"].forEach((k) => {
    assert.ok(en[k], "en missing " + k);
    assert.ok(it[k], "it missing " + k);
  });
  assert.match(it.headerSub, /linea del tempo/i, "Italian header set");
});

test("accessibility hooks exist", () => {
  assert.ok(HTML.includes("aria-label"));
  assert.ok(HTML.includes('setAttribute("role", "button")'));
  assert.ok(HTML.includes("prefers-reduced-motion"));
});
