const createClass = require('create-react-class')
const h = require('react-hyperscript')
const CodeMirror = require('react-codemirror')
const JSONPretty = require('react-json-pretty')
const qs = require('qs')
const jq = window.jq
const debounce = require('debounce')

require('codemirror/mode/javascript/javascript')
require('codemirror/addon/mode/simple')
require('codemirror').defineSimpleMode('jq', require('codemirror-mode-jq'))

const query = qs.parse(location.search.slice(1))

const dflt = [
  [`{
  "values": [1, 2, 7, 23, 48, 26],
  "label": "mouse",
  "name": "gerald"
}`, '"\\(.name), the \\(.label)," as $phrase | .values | reduce .[] as $v (0;.+$v) | $phrase + " has a value of \\(.)"'],
  [`[{
  "kind": "fruit",
  "name": "banana"
}, {
  "kind": "sport",
  "name": "tennis"
}, {
  "kind": "fruit",
  "name": "strawberry"
}, {
  "kind": "fruit",
  "name": "mango"
}]`, 'reduce .[] as $item ({}; .[$item.kind] |= . + 1)'],
  [`{
  "a": {
    "big": [
      892173,
      {
        "nested": {
          "json": {
            "some key deep inside": "some value deep inside"
          }
        }
      }
    ]
  }
}`, '.a.big[1].nested.json']
]

let chosen = dflt[parseInt(Math.random() * dflt.length)]

module.exports = createClass({
  displayName: 'Main',
  getInitialState () {
    return {
      input: query.i || chosen[0],
      filter: query.f || chosen[1],
      output: null,
      error: null
    }
  },

  componentDidMount () {
    this.dcalc = debounce(this.calc, 700)

    this.calc()
  },

  render () {
    return (
      h('div', [
        h('nav.nav', [
          h('.nav-left', [
            h('a.nav-item', [
              h('span.icon', [
                h('img', {
                  src: 'https://stedolan.github.io/jq/jq.png',
                  alt: 'jq logo',
                  title: 'jq trademark'
                })
              ]),
              '-web'
            ])
          ]),
          h('.nav-center', [
            h('a.nav-item', {
              onClick: this.shareURL
            }, 'share'),
            h('a.nav-item', {
              href: 'https://stedolan.github.io/jq/manual/',
              target: '_blank'
            }, 'jq manual'),
            h('a.nav-item', {
              href: 'https://github.com/fiatjaf/jq-web',
              target: '_blank'
            }, [
              h('span.icon', [ h('i.fa.fa-github') ]),
              ' source code'
            ])
          ])
        ]),
        h('main.columns', [
          h('.column.is-4', [
            h(CodeMirror, {
              value: this.state.input,
              onChange: v => { this.change({input: v}) },
              options: {
                viewportMargin: Infinity,
                mode: 'application/json',
                theme: 'xq-dark'
              }
            })
          ]),
          h('.column.is-4', [
            h(CodeMirror, {
              value: this.state.filter,
              onChange: v => { this.change({filter: v}) },
              options: {
                viewportMargin: Infinity,
                mode: 'jq',
                theme: 'xq-dark'
              }
            })
          ]),
          h('.column.is-4', [
            this.state.output
            ? h(JSONPretty, {json: this.state.output})
            : h('pre', [ h('code', this.state.error) ])
          ])
        ])
      ])
    )
  },

  change (change) {
    this.setState(change, this.dcalc)
  },

  shareURL (e) {
    window.history.pushState(null, null, '?' + qs.stringify({i: this.state.input, f: this.state.filter}))
  },

  calc () {
    var output
    try {
      let json = JSON.parse(this.state.input)
      output = jq(json, this.state.filter)
      this.setState({output})
    } catch (e) {
      this.setState({output: null, error: e.message})
    }
  }
})
