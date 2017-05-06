const createClass = require('create-react-class')
const h = require('react-hyperscript')
const CodeMirror = require('react-codemirror')
const JSONPretty = require('react-json-pretty')
const jq = require('jq-web')
const debounce = require('debounce')

require('codemirror/mode/javascript/javascript')

module.exports = createClass({
  displayName: 'Main',
  getInitialState () {
    return {
      input: `{
  "field": {
    "internal": "object"
  }
}`,
      filter: '.field',
      output: null
    }
  },

  componentDidMount () {
    this.dcalc = debounce(this.calc)

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
        h('main.tile.is-ancestor', [
          h('.tile.is-vertical', [
            h('.tile.is-parent', [
              h('.tile.is-child', [
                h(CodeMirror, {
                  value: this.state.input,
                  onChange: v => { this.change({input: v}) },
                  options: {
                    viewportMargin: Infinity,
                    mode: 'json'
                  }
                })
              ])
            ])
          ]),
          h('.tile.is-vertical', [
            h('.tile.is-parent', [
              h('.tile.is-child', [
                h('.field', [
                  h('.control.is-extended', [
                    h('input.input.is-large.filter', {
                      value: this.state.filter,
                      onChange: e => { this.change({filter: e.target.value}) }
                    })
                  ])
                ])
              ])
            ]),
            h('.tile.is-parent', [
              h('.tile.is-child', [
                h(JSONPretty, {json: this.state.output})
              ])
            ])
          ])
        ])
      ])
    )
  },

  change (change) {
    this.setState(change, this.dcalc)
  },

  calc () {
    var output
    try {
      let json = JSON.parse(this.state.input)
      output = jq(json, this.state.filter)
    } catch (e) {
      output = e.message
    }
    this.setState({output})
  }
})
