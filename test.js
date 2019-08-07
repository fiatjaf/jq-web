/** @format */

var tape = require('tape')

var jq = require('./jq.asm.js')
var jqMin = require('./jq.asm.min.js')

tape('jq', function(t) {
  t.plan(3)

  jq.onInitialized.addListener(() => {
    t.deepEquals(
      jq.json(
        {a: 'a letter', b: 'other letter', '%': null},
        '[.a, .["%"]] | {res: .}'
      ),
      {res: ['a letter', null]}
    )

    t.equals(
      jq.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}'),
      `{\n  "what?": "üñìçôdẽ"\n}`
    )

    t.equals(
      jq.json({message: 'This is an emoji test 🙏'}, '.message'),
      'This is an emoji test 🙏'
    )
  })
})

tape('jq.min', function(t) {
  t.plan(3)

  jqMin.onInitialized.addListener(() => {
    t.deepEquals(
      jqMin.json(
        {a: 'a letter', b: 'other letter', '%': null},
        '[.a, .["%"]] | {res: .}'
      ),
      {res: ['a letter', null]}
    )

    t.equals(
      jqMin.raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}'),
      `{\n  "what?": "üñìçôdẽ"\n}`
    )

    t.equals(
      jqMin.json({message: 'This is an emoji test 🙏'}, '.message'),
      'This is an emoji test 🙏'
    )
  })
})

tape('jq.promise', function(t) {
  t.plan(2)

  jqMin.promised
    .json(
      {a: 'a letter', b: 'other letter', '%': null},
      '[.a, .["%"]] | {res: .}'
    )
    .then(res => {
      t.deepEquals(res, {res: ['a letter', null]})
    })

  jqMin.promised
    .raw('["a", {"12": "üñìçôdẽ"}]', '.[1]["12"] | {"what?": .}')
    .then(res => {
      t.equals(res, `{\n  "what?": "üñìçôdẽ"\n}`)
    })
})
