var tape = require("tape");

tape("jq", function(t) {
  var jq = require("./jq.bundle.js");
  t.plan(3);

  jq.onInitialized.addListener(() => {
    t.deepEquals(
      jq.json(
        { a: "a letter", b: "other letter", "%": null },
        '[.a, .["%"]] | {res: .}'
      ),
      { res: ["a letter", null] }
    );

    t.equals(
      jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}'),
      `{\n  "what?": "üñìçôdẽ"\n}`
    );

    t.equals(
      jq.json({ message: "This is an emoji test 🙏" }, ".message"),
      "This is an emoji test 🙏"
    );
  });
});

tape("jq.min", function(t) {
  var jq = require("./jq.min.js");
  t.plan(3);

  jq.onInitialized.addListener(() => {
    t.deepEquals(
      jq.json(
        { a: "a letter", b: "other letter", "%": null },
        '[.a, .["%"]] | {res: .}'
      ),
      { res: ["a letter", null] }
    );

    t.equals(
      jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}'),
      `{\n  "what?": "üñìçôdẽ"\n}`
    );

    t.equals(
      jq.json({ message: "This is an emoji test 🙏" }, ".message"),
      "This is an emoji test 🙏"
    );
  });
});
