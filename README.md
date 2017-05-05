# jq-web

This is a build of [jq](https://github.com/stedolan/jq), the command-line JSON processor in Javascript using [Emscripten](http://kripken.github.io/emscripten-site/) along with a wrapper for making it usable as a library.

It runs in the browser.

### install and use

```
npm install jq-web
```

```js
var jq = require('jq-web')

jq({
  a: {
    big: {
      json: [
        'full',
        'of',
        'important',
        'things'
      ]
    } 
  }
}, '.a.big.json | ["empty", .[1], "useless", .[3]] | join(" ")')
```

the code above returns the string `"empty of useless things"`.
