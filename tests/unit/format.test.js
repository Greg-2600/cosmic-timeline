const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../../timeline-core.js");

test("formatTime covers every magnitude", () => {
  assert.equal(core.formatTime(0), "Present");
  assert.equal(core.formatTime(55), "55 years ago");
  assert.equal(core.formatTime(999), "999 years ago");
  assert.ok(core.formatTime(12_000).includes("thousand years ago"));
  assert.ok(core.formatTime(300_000).includes("thousand years ago"));
  assert.ok(core.formatTime(66_000_000).includes("million years ago"));
  assert.ok(core.formatTime(13_800_000_000).includes("billion years ago"));
});

test("formatTime is monotonic in magnitude (never says 'billion' for kya values)", () => {
  assert.ok(core.formatTime(12_000).includes("thousand"));
  assert.ok(core.formatTime(12_000_000).includes("million"));
  assert.ok(core.formatTime(12_000_000_000).includes("billion"));
});

test("formatShort covers each bucket", () => {
  assert.equal(core.formatShort(0), "Present");
  assert.equal(core.formatShort(0 === 0 ? 999 : 0), "999 ya");
  assert.equal(core.formatShort(1_000), "1 kya");
  assert.equal(core.formatShort(300_000), "300 kya");
  assert.equal(core.formatShort(600_000_000), "600 Mya");
  assert.equal(core.formatShort(13_800_000_000), "13.8 Bya");
});

test("formatShort never emits zero-slot strings", () => {
  [0, 1, 55, 12_000, 4_560, 66_000_000].forEach((n) => {
    const s = core.formatShort(n);
    assert.ok(s.trim().length > 0, `empty short for ${n}`);
    assert.doesNotMatch(s, /NaN|undefined/);
  });
});

test("panel labels remain human-readable for the trickiest ages", () => {
  const tricky = [584, 12_000, 7_000_000, 2_400_000_000];
  tricky.forEach((n) => {
    assert.ok(core.formatTime(n).length > 5, "full format too terse: " + core.formatTime(n));
    assert.ok(core.formatShort(n).length <= 14, "short format too long: " + core.formatShort(n));
  });
});
