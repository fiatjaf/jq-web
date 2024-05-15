/** @format */

// necessary because the default emscriptem exit() logs a lot of text.
function exit() {}

// takes a string as input and returns a string
// like `echo <jsonstring> | jq <filter>`, returning the value of STDOUT
function raw(jsonstring, filter, flags) {
  stdin = jsonstring
  inBuffer = []
  outBuffer = []
  errBuffer = []

  // window.FS=FS
  flags = flags || []
  Module.callMain(flags.concat(filter, '/dev/stdin')) // induce c main open it

  // make sure closed & clean up fd
  if(FS.streams[1]) FS.close(FS.streams[1])
  if(FS.streams[2]) FS.close(FS.streams[2])
  if(FS.streams[3]) FS.close(FS.streams[3])
  if(FS.streams.length>3) FS.streams.pop()

  // calling main closes stdout, so we reopen it here:
  FS.streams[1] = FS.open('/dev/stdout', 577, 0)
  FS.streams[2] = FS.open('/dev/stderr', 577, 0)

  if (errBuffer.length) {
    console.log('%cstderr%c: %c%s', 'background:red;color:black', '', 'color:red', fromByteArray(errBuffer))
  }

  if (outBuffer.length) {
    return fromByteArray(outBuffer).trim()
  }

  if (errBuffer.length) {
    var errBufferContents = fromByteArray(errBuffer)
    var errString = errBufferContents
    if (errString.indexOf(':') > -1) {
      var parts = errString.split(':')
      errString = parts[parts.length - 1].trim()
    }
    var err = new Error(errString)
    err.stack = errBufferContents
    throw err
  }

  return ''
}

// takes an object as input and tries to return objects.
function json(json, filter) {
  var jsonstring = JSON.stringify(json)
  var result = raw(jsonstring, filter, ['-c']).trim()

  if (result.indexOf('\n') !== -1) {
    return result
      .split('\n')
      .filter(function(x) {
        return x
      })
      .reduce(function(acc, line) {
        return acc.concat(JSON.parse(line))
      }, [])
  } else {
    return JSON.parse(result)
  }
}

Object.assign(
    Module,
    { json, raw },
);
