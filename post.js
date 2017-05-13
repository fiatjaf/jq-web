// necessary because the default emscriptem exit() logs a lot of text.
function exit () {}

// takes a string as input and returns a string
// like `echo <jsonstring> | jq <filter>`, returning the value of STDOUT
function raw (jsonstring, filter, flags) {
  stdin = jsonstring
  stdout = ''
  stderr = ''

  flags = flags || []
  Module.callMain(flags.concat(filter))

  // calling main closes stdout, so we reopen it here:
  FS.streams[1] = FS.open('/dev/stdout', 577, 0)

  if (stdout) {
    return stdout
  }

  throw new Error(stderr)
}

// takes an object as input and tries to return objects.
function json (json, filter) {
  var jsonstring = JSON.stringify(json)
  var result = raw(jsonstring, filter, ['-c']).trim()

  if (result.indexOf('\n') !== -1) {
    return result
      .split('\n')
      .filter(function (x) { return x })
      .reduce(function (acc, line) { return acc.concat(JSON.parse(line)) }, [])
  } else {
    return JSON.parse(result)
  }
}

module.exports = json
module.exports.raw = raw
