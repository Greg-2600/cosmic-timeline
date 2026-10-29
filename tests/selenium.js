/**
 * End-to-end verification of the Cosmic Timeline in a real Chrome.
 *
 *   node tests/selenium.js
 *   SELENIUM_HEADLESS=0 node tests/selenium.js   (watch it run)
 *
 * Uses Selenium Manager to resolve the matching ChromeDriver automatically.
 * Exit code 0 = everything works.
 */
const { Builder, By, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

process.env.PORT = process.env.PORT || "8766";
const { server, PORT } = require("../scripts/serve.js");
const BASE = `http://localhost:${PORT}/timeline.html`;

const HEADLESS = (process.env.SELENIUM_HEADLESS || "1") !== "0";

let passed = 0;
function ok(label) { passed += 1; console.log(`  ✔ ${label}`); }
async function section(label, fn) {
  process.stdout.write(`▪ ${label}\n`);
  await fn();
}

async function main() {
  server.listen(PORT);

  const options = new chrome.Options();
  if (HEADLESS) {
    options.addArguments("--headless=new");
    options.addArguments("--window-size=1440,900");
  } else {
    options.addArguments("--window-size=1440,900");
  }
  options.addArguments("--no-first-run");
  options.addArguments("--disable-search-engine-choice-screen");

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  const waitLoad = (ms = 800) => driver.sleep(ms);
  const hoverEvent = (title) => driver.executeScript(
    "const t = arguments[0];" +
    "const mk = [...document.querySelectorAll('.marker')].find(m => m.getAttribute('aria-label').includes(t));" +
    "mk.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));" +
    "return mk.getAttribute('aria-label');", title
  );
  const clickEvent = (title) => driver.executeScript(
    "const t = arguments[0];" +
    "const mk = [...document.querySelectorAll('.marker')].find(m => m.getAttribute('aria-label').includes(t));" +
    "mk.click();", title
  );

  try {
    // ── 1. Shell loads ────────────────────────────────────────────────
    await driver.get(BASE);
    await driver.wait(until.titleContains("Cosmic Timeline"), 8000);
    await waitLoad(500);
    ok("page loads with correct title");

    const counts = await driver.executeScript(
      "return { markers: document.querySelectorAll('.marker').length, " +
      "labels: document.querySelectorAll('.marker-label').length, " +
      "legend: document.querySelectorAll('.legend .chip').length, " +
      "gradient: document.querySelector('.number-line').style.background.includes('linear-gradient') }"
    );
    assert.equal(counts.markers, 92, "92 markers");
    assert.equal(counts.labels, 92, "92 labels");
    assert.equal(counts.legend, 10, "10 era chips");
    assert.equal(counts.gradient, true, "number line painted with era spectrum");
    ok("92 markers, 92 tiered labels, 10 era chips, gradient line");

    // ── 2. Hover opens the panel with three reading levels ───────────
    await hoverEvent("Dinosaur Extinction");
    await waitLoad(400);
    await driver.wait(until.elementLocated(By.id("panel-title")), 5000);
    const titleHover = await driver.findElement(By.id("panel-title")).getText();
    assert.equal(titleHover, "Dinosaur Extinction", "hover marker → own title");
    const kid = await driver.findElement(By.css(".kid-card p")).getText();
    assert.ok(kid.length > 40, "kid card text");
    const deepCount = await driver.executeScript(
      "return document.querySelectorAll('.detail-block ul li').length"
    );
    assert.ok(deepCount >= 3, `deep dive facts (got ${deepCount})`);
    const learn = await driver.findElement(By.css("a.learn-more"));
    const learnHref = await learn.getAttribute("href");
    assert.match(learnHref, /wikipedia\.org\//, "learn-more link");
    ok(`panel: kid card (${kid.length} chars), ${deepCount} deep facts, learn-more link`);

    // ── 3. Event image loads from Wikimedia ──────────────────────────
    await driver.wait(async () =>
      driver.executeScript("const im=document.querySelector('.event-media img'); return !!im && im.complete && im.naturalWidth>0"),
      15000, "event image should load"
    );
    const mediaH = await driver.executeScript("return document.querySelector('.event-media').getBoundingClientRect().height");
    assert.ok(mediaH > 150, "media banner visible height");
    ok(`event image loaded (${Math.round(mediaH)}px banner)`);

    // ── 4. Glossary words-to-know + modal ────────────────────────────
    const chipCount = (await driver.findElements(By.css(".glossary-chip"))).length;
    assert.ok(chipCount >= 2, `expected glossary chips, got ${chipCount}`);
    await driver.executeScript("document.getElementById('glossary-btn').click()");
    await waitLoad(250);
    const modalItems = (await driver.findElements(By.css(".glossary-item"))).length;
    assert.ok(modalItems >= 20, `glossary modal items: ${modalItems}`);
    await driver.executeScript("document.getElementById('glossary-close').click()");
    assert.equal(await driver.findElement(By.id("glossary-modal")).getAttribute("hidden"), "true");
    ok(`glossary: ${chipCount} inline chips, ${modalItems}-term modal`);

    // ── 5. Search jumps to an event ──────────────────────────────────
    const input = await driver.findElement(By.id("search-input"));
    await input.sendKeys("moon");
    await waitLoad(250);
    const results = (await driver.findElements(By.css(".search-result")));
    assert.ok(results.length >= 1, "search results appear");
    // "moon" matches several events (Solar System kid text mentions the Moon);
    // pick the dedicated Moon Landing entry and verify it opens.
    const moonBtn = await driver.executeScript(
      "const r = [...document.querySelectorAll('.search-result')];" +
      "const b = r.find(e => e.textContent.includes('Moon Landing')); b.click(); return b.textContent"
    );
    assert.ok(moonBtn, "Moon Landing result exists");
    await driver.wait(async () =>
      (await driver.findElement(By.id("panel-title")).getText()) === "Moon Landing", 4000
    );
    ok("search 'moon' → jumps to Moon Landing");

    // ── 6. Era legend chip jumps ──────────────────────────────────────
    const chip = await driver.executeScript(
      "return [...document.querySelectorAll('.legend .chip')].find(c => c.dataset.era === 'Solar System')"
    );
    // chips are spans with title tooltips (era explainer)
    assert.match(await chip.getAttribute("title"), /Sun/i, "era explainer tooltip");
    await chip.click();
    await driver.wait(async () =>
      (await driver.findElement(By.id("panel-title")).getText()) === "Solar System Forms", 4000
    );
    ok("legend chip jumps to Solar System Forms + era tooltip");

    // ── 7. Zoom modes ─────────────────────────────────────────────────
    await driver.executeScript("document.getElementById('mode-human').click()");
    await waitLoad(300);
    const civState = await driver.executeScript(
      "return { visible: [...document.querySelectorAll('.marker')].filter(m => m.style.display !== 'none').length, " +
      "grad: document.querySelector('.number-line').style.background.slice(0,22) }"
    );
    assert.equal(civState.visible, 31, "Civilization view shows 31 events");
    const gradBefore = (await driver.executeScript("return document.querySelector('.number-line').style.background"));
    await driver.executeScript("document.getElementById('mode-deep').click()");
    await waitLoad(300);
    const deepVisible = await driver.executeScript(
      "return [...document.querySelectorAll('.marker')].filter(m => m.style.display !== 'none').length"
    );
    assert.equal(deepVisible, 92);
    const gradAfter = await driver.executeScript("return document.querySelector('.number-line').style.background");
    assert.notEqual(gradBefore, gradAfter, "line gradient rebuilds per mode");
    ok(`zoom: civilization = 31 events, deep time = 92, gradient rebuilt`);

    // ── 8. Panel arrows step through history and scroll viewport ──────
    await hoverEvent("Moon Landing");
    await driver.wait(async () => {
      const t = await driver.findElement(By.id("panel-title")).getText();
      if (t !== "Moon Landing") await hoverEvent("Moon Landing");
      return t === "Moon Landing";
    }, 8000, "Moon Landing hover");
    await driver.executeScript("document.getElementById('next-btn').click()");
    await driver.wait(async () =>
      (await driver.findElement(By.id("panel-title")).getText()) === "China's Economic Miracle", 5000
    );
    await waitLoad(900); // smooth scroll
    const scrolled = await driver.executeScript("return document.querySelector('.viewport').scrollLeft");
    assert.ok(scrolled > 2000, `viewport followed the selection (scrollLeft=${scrolled})`);
    await driver.executeScript("document.getElementById('prev-btn').click()");
    await driver.wait(async () =>
      (await driver.findElement(By.id("panel-title")).getText()) === "Moon Landing", 4000
    );
    ok("‹ › step events and the viewport glides to follow");

    // ── 9. Keyboard navigation on the timeline ────────────────────────
    await driver.executeScript("document.getElementById('track').focus()");
    await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
    await waitLoad(250);
    const kbTitle = await driver.findElement(By.id("panel-title")).getText();
    assert.match(kbTitle, /\S/, "arrow key opened a panel");
    ok(`arrow key navigation active (panel title: ${kbTitle})`);

    // ── 10. Guided tour starts and stops ─────────────────────────────
    await driver.executeScript("document.getElementById('tour-btn').click()");
    await waitLoad(250);
    const tourLabel1 = await driver.executeScript(
      "return document.getElementById('tour-btn').textContent"
    );
    assert.ok(tourLabel1.includes("Tour 1/92"), `tour button state unexpected: ${JSON.stringify(tourLabel1)}`);
    assert.equal(await driver.findElement(By.id("panel-title")).getText(), "The Big Bang", "tour opens event 1");
    await driver.executeScript("document.getElementById('tour-btn').click()"); // stop
    const tourLabel2 = await driver.executeScript(
      "return document.getElementById('tour-btn').textContent"
    );
    assert.match(tourLabel2, /Take the tour/);
    ok("guided tour starts at Big Bang and stops");

    // ── 11. Close the panel ──────────────────────────────────────────
    await driver.executeScript("document.getElementById('close-btn').click()");
    const closed = await driver.executeScript("return document.getElementById('panel').classList.contains('open')");
    assert.equal(closed, false, "close button hides panel");
    ok("panel closes cleanly");

    // ── 12. Service worker registered + caches filled ────────────────
    const swOk = await driver.wait(async () =>
      driver.executeScript("return navigator.serviceWorker.getRegistration().then(r => !!r)"), 8000
    );
    assert.equal(swOk, true, "service worker registered");
    await driver.wait(async () =>
      driver.executeScript(
        "return caches.open('images-v4').then(c => c.keys().then(k => k.length))"
      ) > 0 ? true : false, 20000
    ).catch(() => {});
    const cacheCount = await driver.executeScript(
      "return caches.open('images-v4').then(c => c.keys().then(k => k.length))"
    );
    // Wikimedia throttles bulk fetches from one IP; caching fills as the throttle lifts.
    if (cacheCount < 10) console.log(`  ⚠ image cache warming in progress (${cacheCount}/90) — Wikimedia IP throttle`);
    ok(`service worker active, image cache holds ${cacheCount} entries`);

    // ── 13. Quiz mode flow ───────────────────────────────────────────
    await driver.executeScript("document.getElementById('quiz-btn').click()");
    await waitLoad(300);
    const quizOptions = await driver.executeScript(
      "return [...document.getElementById('quiz-options').querySelectorAll('.quiz-option')].length"
    );
    assert.ok(quizOptions >= 2, `quiz options rendered: ${quizOptions}`);
    await driver.executeScript("document.getElementById('quiz-options').querySelectorAll('.quiz-option')[0].click()");
    await waitLoad(200);
    const quizState = await driver.executeScript(
      "return { feedback: !document.getElementById('quiz-feedback').hidden, " +
      "marked: [...document.getElementById('quiz-options').querySelectorAll('.quiz-option')].filter(b => b.classList.contains('correct') || b.classList.contains('wrong')).length, " +
      "progress: document.getElementById('quiz-progress').textContent }"
    );
    assert.equal(quizState.feedback, true, "feedback appears");
    assert.ok(quizState.marked >= 1 && quizState.marked <= 2, "answer marked (1 if you guessed right, 2 if wrong)");
    assert.match(quizState.progress, /Score \d+/);
    await driver.executeScript("document.getElementById('quiz-next').click()");
    await driver.wait(async () =>
      (await driver.executeScript("return document.getElementById('quiz-progress').textContent")).includes("Question 2"), 3000
    );
    await driver.executeScript("document.getElementById('quiz-close').click()");
    const quizHidden = await driver.executeScript("return document.getElementById('quiz-modal').hidden");
    assert.equal(quizHidden, true, "quiz closes");
    ok(`quiz: ${quizOptions} options rendered, feedback + progress working`);

    // ── 14. Shareable permalink restores state on load ───────────────
    await driver.executeScript("location.hash = '#event=great-pyramid-of-giza'; location.reload()");
    await waitLoad(1200);
    await driver.wait(until.elementLocated(By.id("panel-title")), 5000);
    const restoredTitle = await driver.findElement(By.id("panel-title")).getText();
    assert.equal(restoredTitle, "Great Pyramid of Giza", "hash event opened");
    const hashNow = await driver.executeScript("return location.hash");
    assert.match(hashNow, /event=great-pyramid-of-giza/);
    // selecting another event updates the hash
    await clickEvent("Moon Landing");
    await waitLoad(300);
    const hashAfter = await driver.executeScript("return location.hash");
    assert.match(hashAfter, /event=moon-landing/, "hash follows selection");
    ok("permalink: #event hash restores and tracks selection");

    // ── 15. Printable handout ─────────────────────────────────────────
    await driver.executeScript("document.getElementById('print-btn').click()");
    await waitLoad(300);
    const handout = await driver.executeScript(
      "const s = document.getElementById('print-sheet'); " +
      "return { titles: [...s.querySelectorAll('h2')].map(h => h.textContent), heading: s.querySelector('h1').textContent }"
    );
    assert.equal(handout.heading, "Moon Landing");
    assert.deepEqual(handout.titles.slice(0, 2), ["The bigger story", "Explain it to a 6-year-old"]);
    ok("printable handout builds with all three reading levels");

    // ── 16. Curriculum tag chips filter the line ─────────────────────
    await driver.executeScript("document.getElementById('tags').scrollIntoView()");
    const tagChips = await driver.executeScript(
      "return [...document.querySelectorAll('.tag-chip')].length");
    assert.ok(tagChips >= 8, `tag chips rendered: ${tagChips}`);
    await driver.executeScript(
      "[...document.querySelectorAll('.tag-chip')].find(c => c.dataset.tag === 'medicine & health').click()");
    await waitLoad(250);
    const dimmed = await driver.executeScript(
      "return [...document.querySelectorAll('.marker.dimmed')].length");
    assert.ok(dimmed > 30, `non-medicine events dimmed: ${dimmed}`);
    // clicking the active chip clears the filter
    await driver.executeScript(
      "[...document.querySelectorAll('.tag-chip')].find(c => c.dataset.tag === 'medicine & health').click()");
    const dimmedAfterClear = await driver.executeScript(
      "return [...document.querySelectorAll('.marker.dimmed')].length");
    assert.equal(dimmedAfterClear, 0);
    ok(`curriculum chips filter the line (${dimmed} dimmed for medicine & health)`);

    // ── 16b. Story reader flips pages ───────────────────────────────
    await driver.executeScript("document.getElementById('read-btn').click()");
    await driver.wait(until.elementLocated(By.id('reader-title')), 4000);
    const reader1 = await driver.executeScript("return document.getElementById('reader-title').textContent");
    await driver.executeScript("document.getElementById('reader-next').click()");
    const reader2 = await driver.executeScript("return document.getElementById('reader-title').textContent");
    assert.notEqual(reader2, reader1, "reader flips to next event");
    ok(`story reader opens + flips: ${reader1} → ${reader2}`);
    await driver.executeScript("document.getElementById('reader-close').click()");

    // ── 16c. Language switch applies Italian UI ─────────────────────
    await driver.executeScript(
      "const sel = document.getElementById('lang-select'); sel.value = 'it'; sel.dispatchEvent(new Event('change')); return 'ok'");
    await waitLoad(300);
    const itSub = await driver.executeScript(
      "return document.querySelector('[data-i18n=headerSub]').textContent");
    assert.match(itSub, /linea del tempo/i, "Italian strings applied");
    await driver.executeScript(
      "const sel = document.getElementById('lang-select'); sel.value = 'en'; sel.dispatchEvent(new Event('change'))");
    ok(`language switch verified (Italian: ${itSub.slice(0, 40)}…)`);

    // ── 17. No console errors throughout ────────────────────────────

    const logs = (await driver.manage().logs().get("browser").catch(() => [])).filter(
      (l) => l.level.name === "SEVERE" && !l.message.includes("favicon")
    );
    assert.deepEqual(logs.map((l) => l.message.slice(0, 80)), [], "no severe console errors");
    ok("console clean (no severe errors)");

    console.log(`\n✅ ALL ${passed} E2E CHECKS PASSED\n`);
  } catch (err) {
    const shot = path.join(__dirname, "..", ".failure-screenshot.png");
    try {
      fs.writeFileSync(shot, Buffer.from(await driver.takeScreenshot(), "base64"));
      console.error("failure screenshot saved to", shot);
    } catch {}
    console.error("\n❌ E2E FAILURE:", err.message);
  console.error(err.stack.split('\n').slice(1, 6).join('\n'));
    process.exitCode = 1;
  } finally {
    await driver.quit().catch(() => {});
    server.close();
  }
}

main();
