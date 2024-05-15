/** @format */

const tape = require('tape');

const jq = require('./jq.js');

tape('jq', async function(t) {
  doJQTests(t, await jq);
})

function doJQTests(t, jq) {
  t.plan(8);

  t.deepEqual(
    Object.keys(jq).sort(),
    ["json", "raw"],
    "expected API",
  );

  t.deepEquals(
      jq.json(
      {a: 'a letter', b: 'other letter', '%': null},
      '[.a, .["%"]] | {res: .}'
      ),
      {res: ['a letter', null]}
  );

  t.equals(
      jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}'),
      `{\n  "what?": "üñìçôdẽ"\n}`
  );

  t.equals(
      jq.json({message: 'This is an emoji test 🙏'}, '.message'),
      'This is an emoji test 🙏'
  );

  t.throws(
    () => { jq.raw('invalid JSON', '.') },
    null,
    "Invalid JSON triggers an exception.",
  );

  t.equals(
    jq.raw('123', '.'),
    '123',
    "raw() works after invalid JSON.",
  );

  t.deepEqual(
    jq.json([123], '.'),
    [123],
  );

  t.equals(
    jq.raw(Number.MAX_SAFE_INTEGER + "000", '.'),
    Number.MAX_SAFE_INTEGER + "000",
    'Number that exceeds MAX_SAFE_INTEGER round-trips.',
  );
}
