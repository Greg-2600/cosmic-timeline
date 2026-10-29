const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../../timeline-core.js");

const M = core.MILESTONES;
const ERAS = Object.keys(core.ERA_COLORS);

test("there are 92 milestones spanning Big Bang → Present", () => {
  assert.equal(M.length, 92);
  assert.equal(M[0].title, "The Big Bang");
  assert.equal(M[0].yearsAgo, 13_800_000_000);
  assert.equal(M[M.length - 1].yearsAgo, 0);
  assert.equal(M[M.length - 1].title, "The Modern Era");
});

test("every milestone has complete, non-empty content", () => {
  M.forEach((m, i) => {
    assert.ok(m.title && m.title.length > 3, `title missing on #${i}`);
    assert.ok(typeof m.yearsAgo === "number" && m.yearsAgo >= 0, `yearsAgo bad on #${i}`);
    assert.ok(ERAS.includes(m.era), `era "${m.era}" unknown on #${i}`);
    assert.ok(m.kid.length > 60, `kid text too short on #${i} (${m.title})`);
    assert.ok(m.fun.length > 30, `fun fact too short on #${i} (${m.title})`);
    assert.ok(m.summary.length > 120, `summary too short on #${i} (${m.title})`);
    assert.ok(Array.isArray(m.deep) && m.deep.length >= 3, `deep list too short on #${i} (${m.title})`);
    m.deep.forEach((d) => assert.ok(d.length > 40, `deep bullet too short on ${m.title}`));
  });
});

test("kid text is genuinely simple (short sentences, no heavy jargon walls)", () => {
  M.forEach((m, i) => {
    const kidWords = m.kid.split(/\s+/).length;
    assert.ok(kidWords <= 90, `kid text too long on ${m.title} (${kidWords} words)`);
    assert.ok(m.kid.endsWith("!") || m.kid.includes("!") || m.kid.includes("?"), `kid text lacks punch on ${m.title}`);
  });
});

test("milestones are strictly ordered youngest → oldest (descending age)", () => {
  for (let i = 1; i < M.length; i++) {
    assert.ok(M[i].yearsAgo < M[i - 1].yearsAgo, `out of order at #${i}: ${M[i].title}`);
  }
});

test("titles are unique", () => {
  const titles = new Set(M.map((m) => m.title));
  assert.equal(titles.size, M.length);
});

test("every milestone has a trusted learn-more link", () => {
  M.forEach((m) => {
    const link = core.LEARN_MORE[m.title];
    assert.ok(link, `no LEARN_MORE entry for ${m.title}`);
    assert.match(link, /^https:\/\/en\.wikipedia\.org\//, `bad link for ${m.title}`);
  });
});

test("every era in use has a color and an explainer", () => {
  const used = new Set(M.map((m) => m.era));
  used.forEach((era) => {
    assert.ok(ERAS.includes(era), `era ${era} missing color`);
    assert.ok(core.ERA_INFO[era] && core.ERA_INFO[era].length > 40, `era ${era} missing explainer`);
  });
});

test("edu-critical events are all present", () => {
  const titles = M.map((m) => m.title);
  [
    "The Big Bang", "First Life Appears", "Oxygenation of the Atmosphere",
    "First Complex Life", "Dinosaur Extinction", "Homo sapiens",
    "Agriculture Begins", "Writing Invented", "Roman Empire",
    "Moon Landing", "Internet & World Wide Web",
  ].forEach((t) => assert.ok(titles.includes(t), `missing key event: ${t}`));
});

test("learn-more links are unique", () => {
  const links = new Set(M.map((m) => core.LEARN_MORE[m.title]));
  assert.equal(links.size, M.length);
});
