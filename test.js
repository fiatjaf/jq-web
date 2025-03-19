/** @format */

const tape = require('tape');

const jqPromise = require('./jq.js');

tape('jq behavior', async function(t) {
  doJQTests(t, await jqPromise);
});

/*
tape('detect memory leaks', async function(t) {
  const iterations = 1000;
  t.plan(iterations);

  const jq = await jqPromise;

  [...Array(iterations)].forEach( (_, i) => {
    t.doesNotThrow(
      () => {
        jq.raw(
            `{"foo": 1, "bar": 2, "deep": { "qux": 3 } }`,
            `.foo`,
        );
      },
    );

    t.throws(
      () => {
        jq.raw(
            `{"foo": 1, "bar": 2, "deep": { "qux": 3 } }`,
            `.foo,`,
        );
      },
      /exit code/i,
    );
  });
});
*/

function doJQTests(t, jq) {
  t.plan(9);

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

  t.equals(
    jq.raw('{}', '$a +  $a1', ['--argjson', 'a', '1', '--argjson', 'a1', '2']),
    '3',
    '--argjson works with keys that are substrings of each other'
);

}
