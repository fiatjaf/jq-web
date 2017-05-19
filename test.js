var tape = require('tape')
var jq = require('.')

tape('jq', function (t) {
  t.plan(2)

  t.deepEquals(
    jq({a: 'a letter', b: 'other letter', '%': null}, '[.a, .["%"]] | {res: .}'),
    {res: ['a letter', null]}
  )

  t.equals(
    jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}'),
    `{
  "what?": "üñìçôdẽ"
}
`
  )
})
