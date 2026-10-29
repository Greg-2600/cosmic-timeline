const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../../timeline-core.js");

const M = core.MILESTONES;
const ageOf = (title) => M.find((m) => m.title === title).yearsAgo;

/** deterministic rng: cycles a simple LCG */
function seededRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

test("makeQuiz returns the requested number of questions (bounded by the event supply)", () => {
  assert.equal(core.makeQuiz(5, seededRng(1)).length, 5);
  assert.equal(core.makeQuiz(1, seededRng(2)).length, 1);
  const big = core.makeQuiz(99, seededRng(3)); // as many as ~76 events can feed
  assert.ok(big.length >= 25 && big.length <= 38, "supply-bounded: " + big.length);
});

test("makeQuiz respects an era filter (teacher packs)", () => {
  const qs = core.makeQuiz(5, null, (m) => m.era === "Biblical");
  assert.ok(qs.length >= 2, "biblical pool feeds questions: " + qs.length);
  const titles = new Set(qs.flatMap((q) => q.options));
  titles.forEach((t) => assert.ok(core.LEARN_MORE[t] !== undefined, "title from data"));
  qs.flatMap((q) => q.options).forEach((o) => {
    const m = core.MILESTONES.find((mm) => mm.title === o);
    assert.equal(m.era, "Biblical", "option outside filter: " + o);
  });
});

test("'which came first?' questions are always answerable and correct", () => {
  const qs = core.makeQuiz(9, seededRng(7));
  qs.filter((q) => q.type === "which-first").forEach((q) => {
    assert.ok(q.options.length === 2, "two options");
    assert.notEqual(q.options[0], q.options[1], "distinct options");
    const answer = q.options[q.answerIndex];
    assert.equal(answer, q.answer, "answerIndex matches answer string");
    const a0 = ageOf(q.options[0]), a1 = ageOf(q.options[1]);
    assert.equal(q.answer, a0 > a1 ? q.options[0] : q.options[1], "the answer is truly the older event");
    assert.ok(q.fact.includes(q.answer), "feedback names the winner");
  });
});

test("'pick oldest' questions put the true oldest among the options", () => {
  const qs = core.makeQuiz(9, seededRng(42));
  qs.filter((q) => q.type === "pick-oldest").forEach((q) => {
    assert.equal(q.options.length, 3, "three options");
    const ages = q.options.map((t) => ageOf(t));
    assert.equal(q.answer, q.options[ages.indexOf(Math.max(...ages))], "fact-checkable");
    assert.equal(q.answer, q.options[q.answerIndex]);
  });
});

test("quiz questions stay within the 23-event supply without duplicates per round", () => {
  const qs = core.makeQuiz(5, seededRng(99));
  const mentioned = new Set();
  qs.forEach((q) => q.options.forEach((o) => mentioned.add(o)));
  assert.ok(mentioned.size <= 23, "never invents events");
  // options inside a single question never repeat
  qs.forEach((q) => assert.equal(new Set(q.options).size, q.options.length));
});

test("quiz with default rng still yields well-formed questions", () => {
  for (let i = 0; i < 20; i++) {
    core.makeQuiz(5).forEach((q) => {
      assert.ok(Array.isArray(q.options) && q.options.length >= 2);
      assert.ok(q.answer, "answer present");
      assert.ok(q.fact && q.fact.length > 10, "fact present");
    });
  }
});

test("slugify produces clean URL slugs", () => {
  assert.equal(core.slugify("Moon Landing"), "moon-landing");
  assert.equal(core.slugify("Internet & World Wide Web"), "internet-and-world-wide-web");
  assert.equal(core.slugify("Great Pyramid of Giza"), "great-pyramid-of-giza");
  assert.equal(core.slugify("Fall of Rome / Middle Ages"), "fall-of-rome-middle-ages");
  assert.equal(core.slugify("The Milky Way!!!"), "the-milky-way");
});

test("slugs are unique across every milestone (perm_safe permalink map)", () => {
  const slugs = M.map((m) => core.slugify(m.title));
  assert.equal(new Set(slugs).size, M.length, "slug collision detected");
  slugs.forEach((s) => assert.match(s, /^[a-z0-9-]+$/, "slugs must be URL-safe"));
});
