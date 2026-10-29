const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../../timeline-core.js");

const assign = (items, gap) => core.assignTiers(items, gap);

test("well-separated labels all sit on tier 0", () => {
  const items = [{ x: 0, w: 100 }, { x: 300, w: 100 }, { x: 700, w: 60 }];
  assert.deepEqual(assign(items), [0, 0, 0]);
});

test("overlapping labels cascade upward", () => {
  const items = [{ x: 0, w: 100 }, { x: 50, w: 100 }, { x: 100, w: 100 }];
  const tiers = assign(items);
  assert.notEqual(tiers[0], tiers[1], "first two must separate");
  assert.ok(new Set(tiers).size >= 2, "at least two tiers used");
});

test("clusters isolate: far-apart labels share tiers, tangled ones do not", () => {
  const items = [
    { x: 10, w: 60 }, { x: 30, w: 60 }, { x: 50, w: 60 }, // one crowd
    { x: 900, w: 60 }, // far away, should reach tier 0
  ];
  const tiers = assign(items);
  assert.ok(new Set([tiers[0], tiers[1], tiers[2]]).size >= 2);
  assert.equal(tiers[3], 0, "distant label returns to bottom tier");
});

test("wider gap setting pushes labels further apart", () => {
  const items = [{ x: 0, w: 100 }, { x: 105, w: 100 }];
  const close = assign(items, 0);
  const wide = assign(items, 50);
  assert.ok(wide[1] > close[1], "larger gap should force a higher tier");
});

test("tier cap holds steady at 7 so labels never fly off the canvas", () => {
  const items = [];
  for (let n = 0; n < 12; n++) items.push({ x: n * 10, w: 200 });
  const tiers = assign(items);
  tiers.forEach((t) => assert.ok(t >= 0 && t <= 7, `tier ${t} out of bounds`));
  assert.equal(Math.max(...tiers), 7, "cap should actually engage here");
});

test("data-independence: every permutation of the same set is consistent", () => {
  const base = [{ x: 20, w: 80 }, { x: 40, w: 80 }, { x: 500, w: 80 }];
  const resultA = assign(base, 4);
  const resultB = assign([base[2], base[0], base[1]], 4);
  assert.deepEqual(new Set(resultB), new Set(resultA));
  assert.equal(resultB[0], resultA[2]);
  assert.equal(resultB[1], resultA[0]);
  assert.equal(resultB[2], resultA[1]);
});

test("empty or single-item layouts are safe", () => {
  assert.deepEqual(assign([{ x: 5, w: 30 }]), [0]);
  assert.deepEqual(assign([]), []);
});
