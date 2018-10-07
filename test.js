var tape = require("tape");

tape("jq", function(t) {
  var jq = require("./jq.js");
  t.plan(3);

  jq.promised(
    { a: "a letter", b: "other letter", "%": null },
    '[.a, .["%"]] | {res: .}'
  ).then(res => {
    t.deepEquals(res, { res: ["a letter", null] });
  });

  jq.promised
    .raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
    .then(res => {
      console.log(res);
      t.equals(res, `{\n  "what?": "üñìçôdẽ"\n}`);
    });

  jq.promised({ message: "This is an emoji test 🙏" }, ".message").then(res => {
    t.equals(res, "This is an emoji test 🙏");
  });
});

tape("jq.min", function(t) {
  var jq = require("./jq.min.js");
  t.plan(3);

  jq.promised(
    { a: "a letter", b: "other letter", "%": null },
    '[.a, .["%"]] | {res: .}'
  ).then(res => {
    t.deepEquals(res, { res: ["a letter", null] });
  });

  jq.promised
    .raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
    .then(res => {
      console.log(res);
      t.equals(res, `{\n  "what?": "üñìçôdẽ"\n}`);
    });

  jq.promised({ message: "This is an emoji test 🙏" }, ".message").then(res => {
    t.equals(res, "This is an emoji test 🙏");
  });
});
