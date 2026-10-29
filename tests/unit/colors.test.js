const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../../timeline-core.js");

const M = core.MILESTONES;

test("every event gets its own color string", () => {
  const seen = new Set();
  M.forEach((_, i) => {
    const c = core.eventColor(i);
    assert.match(c, /^hsl\(\d+ \d+% \d+%\)$/, `bad color ${c}`);
    seen.add(c);
  });
  assert.equal(seen.size, M.length, "colors must all differ");
});

test("color alpha variants keep the same hue and stay inside [0,1]", () => {
  const c0 = core.eventColor(5);
  const a0 = core.eventColorAlpha(5, 0.16);
  assert.ok(a0.startsWith(c0.replace(")", "")), `alpha must not shift hue: ${c0} vs ${a0}`);
  assert.match(a0, / \/ 0\.16\)$/);
  assert.doesNotMatch(core.eventColorAlpha(5, 1.4), /NaN/);
});

test("event shades stay inside a consistent perceptual triangle", () => {
  core.EVENT_COLORS.forEach((c) => {
    assert.ok(c.s > 0 && c.s < 100, `saturation out of range: ${JSON.stringify(c)}`);
    assert.ok(c.l > 0 && c.l < 100, `lightness out of range: ${JSON.stringify(c)}`);
    assert.ok(c.h >= 0 && c.h < 360, `hue out of range: ${JSON.stringify(c)}`);
  });
});

test("family relationships: same-era colors differ slightly, cross-era differ a lot", () => {
  const hueOf = (title) => {
    const i = core.MILESTONES.findIndex((m) => m.title === title);
    return core.EVENT_COLORS[i].h;
  };
  // two civilisation events (Writing, Pyramid) should be close in hue
  const civA = hueOf("Writing Invented"), civB = hueOf("Great Pyramid of Giza");
  assert.ok(Math.abs(civA - civB) <= 30, `same-family hues drifted apart: ${civA} vs ${civB}`);
  // cosmic origins (violet family) vs solar system (orange family) must be far apart
  const cosmic = hueOf("The Big Bang"), solar = hueOf("Earth Forms");
  const dist = Math.abs(cosmic - solar);
  assert.ok(Math.min(dist, 360 - dist) > 100, `cross-family hues too close: ${cosmic} vs ${solar}`);
});

test("eraColor falls back to accent for unknown era", () => {
  assert.equal(core.eraColor("Bogus era"), "#38bdf8");
  assert.equal(core.eraColor("Cosmic origins"), core.ERA_COLORS["Cosmic origins"]);
});
