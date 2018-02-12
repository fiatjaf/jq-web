var tape = require('tape')

tape('jq', function (t) {
  var jq = require('./jq.js')
  t.plan(2)

  t.deepEquals(
    jq({a: 'a letter', b: 'other letter', '%': null}, '[.a, .["%"]] | {res: .}'),
    {res: ['a letter', null]}
  )

  t.equals(
    jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}'),
    `{
  "what?": "üñìçôdẽ"
}`
  )
})

tape('jq.min', function (t) {
  var jq = require('./jq.min.js')
  t.plan(2)

  t.deepEquals(
    jq({a: 'a letter', b: 'other letter', '%': null}, '[.a, .["%"]] | {res: .}'),
    {res: ['a letter', null]}
  )

  t.equals(
    jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}'),
    `{
  "what?": "üñìçôdẽ"
}`
  )
})
