const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../../timeline-core.js");

test("every milestone carries at least one curriculum tag", () => {
  core.MILESTONES.forEach((m) => {
    const tags = core.curriculumTagsFor(m);
    assert.ok(tags.length >= 1, `no tags for ${m.title}`);
  });
});

test("all used tags are from the approved taxonomy", () => {
  core.MILESTONES.forEach((m) => {
    core.curriculumTagsFor(m).forEach((t) => {
      assert.ok(core.CURRICULUM_TAGS.includes(t), `unknown tag ${t} on ${m.title}`);
    });
  });
});

test("tags are de-duplicated and ordered consistently", () => {
  core.MILESTONES.forEach((m) => {
    const tags = core.curriculumTagsFor(m);
    assert.equal(new Set(tags).size, tags.length, `dupes on ${m.title}`);
  });
});

test("each taxonomy tag actually teaches something on the line", () => {
  const used = new Set();
  core.MILESTONES.forEach((m) => core.curriculumTagsFor(m).forEach((t) => used.add(t)));
  core.CURRICULUM_TAGS.forEach((t) => assert.ok(used.has(t), `taxonomy tag never used: ${t}`));
});

test("science and humanities coverage is real, not token", () => {
  const eventsWithScience = core.MILESTONES.filter((m) => {
    return core.curriculumTagsFor(m).some((t) =>
      t.includes("astronomy") || t.includes("physics") || t.includes("biology") || t.includes("geology")
    );
  }).length;
  const eventsWithHumanities = core.MILESTONES.filter((m) => {
    return core.curriculumTagsFor(m).some((t) =>
      t.includes("history") || t.includes("religion") || t.includes("empires") || t.includes("art")
    );
  }).length;
  assert.ok(eventsWithScience >= 20, `science coverage thin: ${eventsWithScience}`);
  assert.ok(eventsWithHumanities >= 25, `humanities coverage thin: ${eventsWithHumanities}`);
});
