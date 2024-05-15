[![npm badge](https://img.shields.io/npm/v/jq-web.svg)](https://www.npmjs.com/package/jq-web) [![Mentioned in Awesome jq](https://awesome.re/mentioned-badge.svg)](https://github.com/fiatjaf/awesome-jq)

# jq-web

This is a WebAssembly build of [jq](https://github.com/jqlang/jq), the command-line JSON processor.

It runs in the browser.

### Installation and use

```
npm install jq-web
```

```js
var jq = require('jq-web');

jq.then( jq => jq.json({
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

The code above returns the string `"empty of useless things"`.

You could do the same using the promised API with `jq.promised.json({...}).then(result => {})`. That is useful if you're loading a `.mem` or `.wasm` file, as the library won't return the correct results until these files are asynchronously fetched by the Emscripten runtime.

### Webpack issues

#### `fs`
The Emscripten runtime will try to `require` the `fs` module, and if it fails it will resort to an in-memory filesystem (almost no use of that is made of the library, but it is needed somehow). In Browserify there's a default `{}` that corresponds to the `fs` module, but in Webpack you must [declare it as an empty module](https://github.com/fiatjaf/jq-web/issues/5#issuecomment-342694955).

#### 404 error when loading `.wasm` files
By default projects compiled with Emscripten look for `.wasm` files in the same directory that the `.js` file is run from. This causes issues when using webpack because name of the `.wasm` file is altered with a hash and can be placed in a different directory. To fix this problem you can use the [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) to copy the `jq.wasm` file to the same directory that the webpack bundle is placed.

## Reference

`jq-web` exports a promise that resolves to an object with `json` and `raw` methods.

`jq.json(<object>, <filter>) <object>` will take a Javascript object, or scalar, whatever, and dump it to JSON, then it will return whatever your filter outputs and try to convert that into a JS object.

`jq.raw(<json-string>, <filter>, <flags>) <raw-output>` will take a string that will be passed as it is to jq (like if you were doing `echo '<json-string>' | jq <filter>` on the command line) then return a string with the raw STDOUT response.

## Build

1. Install Emscripten. There have been several API changes over time; version 3.1.31
is known to work.
2. Clone this repository, and `cd` into it.
3. `make`
    * This may take a while if you have never run Emscripten before.

## Test
A handful of tests exist in `test.js`. These are a good place to start when verifying a build.
To run them, do `make test`.

You can test browser functionality by running:
`./node_modules/live-server/live-server.js --open="index.html"`.
