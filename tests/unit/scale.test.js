const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../../timeline-core.js");

const DEEP_MAX = core.MAX_YEARS;
const HUMAN_MAX = core.HUMAN_MAX;
const M = core.MILESTONES;
const frac = (ya, max) => core.fracFor(ya, max);

test("Deep-time scale pins the extremes", () => {
  assert.equal(frac(DEEP_MAX), 0, "Big Bang must sit at the far left");
  assert.equal(frac(0), 1, "Present must sit at the far right");
  assert.equal(core.fracFor(0, HUMAN_MAX), 1, "Present at far right in civilization view");
});

test("Deep-time scale is monotonically increasing for every visible event", () => {
  const fracs = M.map((m) => frac(m.yearsAgo));
  fracs.forEach((f) => assert.ok(f !== null && f >= 0 && f <= 1, "frac out of range"));
  for (let i = 1; i < fracs.length; i++) {
    assert.ok(fracs[i] > fracs[i - 1], `frac not increasing at #${i} (${M[i].title})`);
  }
});

test("Civilization view excludes pre-agriculture events and the Biblical/Powers tracks outright", () => {
  M.forEach((m) => {
    const expected = m.yearsAgo <= HUMAN_MAX && m.era !== "Biblical" && m.era !== "World Powers";
    assert.equal(core.visibleInCivilization(m), expected, m.title + " visibility");
  });
  const included = M.filter((m) => core.visibleInCivilization(m));
  assert.equal(included.length, 24, "should be exactly 24 civilization events");
});

test("Civilization view is monotonically increasing and well spread", () => {
  const base = M.filter((m) => core.visibleInCivilization(m)).map((m) => frac(m.yearsAgo, HUMAN_MAX));
  for (let i = 1; i < base.length; i++) assert.ok(base[i] > base[i - 1]);
  // the middle event of the view should fall near the middle of the line
  const mid = Math.floor(base.length / 2);
  assert.ok(Math.abs(base[mid] - 0.5) < 0.25, `timeline centre off: ${base[mid]}`);
});

test("earlier events are far from each other; recent ones still readable", () => {
  // Big Bang → first stars gap should be visually tiny (log compresses old time)
  const bb = M[0], stars = M[1];
  assert.ok(frac(stars.yearsAgo) - frac(bb.yearsAgo) < 0.005, "old events stay clustered");
  // Internet → Modern gap should be large so the modern era is readable
  const internet = M.find((m) => m.title.includes("Internet"));
  const gap = frac(0) - frac(internet.yearsAgo);
  assert.ok(gap > 0.15, `recent era too compressed: ${gap}`);
});

test("xPosition stays stable and equivalent to fracFor in deep view", () => {
  M.forEach((m) => {
    assert.ok(Math.abs(core.xPosition(m.yearsAgo) - frac(m.yearsAgo)) < 1e-12);
  });
});

test("fracFor rejects events beyond the view window instead of wrapping", () => {
  assert.equal(frac(13_800_000_001), null);
});
