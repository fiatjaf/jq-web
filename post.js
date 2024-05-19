/** @format */

const NEWLINE = 0xa;

const utf8Decoder = new TextDecoder();

function fromByteArray(data) {
  let u8Array = new Uint8Array(data);

  // Ignore trailing newline:
  if (u8Array[u8Array.length - 1] === NEWLINE) {
    u8Array = new Uint8Array(u8Array.buffer, 0, u8Array.length - 1);
  }

  return utf8Decoder.decode(u8Array);
}

// takes a string as input and returns a string
// like `echo <jsonstring> | jq <filter>`, returning the value of STDOUT
function raw(jsonstring, filter, flags) {
  outBuffer = [];
  errBuffer = [];

  // window.FS=FS
  flags = flags || []

  let mainErr, stdout, stderr, exitCode;

  // Emscripten 3.1.31 neglects to free its argv, so we’ll do it here.
  // This should be safe to do even if Emscripten fixes that.
  const stackBefore = stackSave();

  // Emscripten, as of 3.1.31, mucks with process.exitCode, which
  // makes no sense.
  let preExitCode;
  if (typeof process !== "undefined") {
    preExitCode = process.exitCode;
  }

  FS.writeFile("inputString", jsonstring);

  try {
    exitCode = Module.callMain(flags.concat(filter, "inputString")); // induce c main open it
  } catch (e) {
    mainErr = e;
  }

  if (preExitCode !== undefined) {
    process.exitCode = preExitCode;
  }

  stackRestore(stackBefore);

  // make sure closed & clean up fd
  if(FS.streams[1]) FS.close(FS.streams[1])
  if(FS.streams[2]) FS.close(FS.streams[2])
  if(FS.streams[3]) FS.close(FS.streams[3])
  if(FS.streams.length>3) FS.streams.pop()

  // calling main closes stdout, so we reopen it here:
  FS.streams[1] = FS.open('/dev/stdout', 577, 0)
  FS.streams[2] = FS.open('/dev/stderr', 577, 0)

  if (errBuffer.length) {
    stderr = fromByteArray(errBuffer);
    console.warn('%cstderr%c: %c%s', 'background:red;color:black', '', 'color:red', stderr);
  }

  if (outBuffer.length) {
    stdout = fromByteArray(outBuffer);
  }

  try {
    if (mainErr) {
      throw mainErr;
    } else if (exitCode !== 0) {
      const err = new Error(`Non-zero JQ exit code: ${exitCode}`);
      if (stderr) err.stderr = stderr;
      err.exitCode = exitCode;
      throw err;
    }
  } catch (e) {
    if (stderr) e.stderr = stderr;
    throw e;
  }

  return stdout;
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
