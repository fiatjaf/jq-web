// necessary because the default emscriptem exit() logs a lot of text.
function exit() {}

// takes a string as input and returns a string
// like `echo <jsonstring> | jq <filter>`, returning the value of STDOUT
function raw(jsonstring, filter, flags) {
  if (!initialized) return "{}";

  stdin = jsonstring;
  inBuffer = [];
  outBuffer = [];
  errBuffer = [];

  flags = flags || [];
  Module.callMain(flags.concat(filter));

  // calling main closes stdout, so we reopen it here:
  FS.streams[1] = FS.open("/dev/stdout", 577, 0);
  FS.streams[2] = FS.open("/dev/stderr", 577, 0);

  if (outBuffer.length) {
    return fromByteArray(outBuffer).trim();
  }

  if (errBuffer.length) {
    var errBufferContents = fromByteArray(errBuffer);
    var errString = errBufferContents;
    if (errString.indexOf(":") > -1) {
      var parts = errString.split(":");
      errString = parts[parts.length - 1].trim();
    }
    throw new Error(errString);
  }

  return "";
}

// takes an object as input and tries to return objects.
function json(json, filter) {
  if (!initialized) return {};

  var jsonstring = JSON.stringify(json);
  var result = raw(jsonstring, filter, ["-c"]).trim();

  if (result.indexOf("\n") !== -1) {
    return result
      .split("\n")
      .filter(function(x) {
        return x;
      })
      .reduce(function(acc, line) {
        return acc.concat(JSON.parse(line));
      }, []);
  } else {
    return JSON.parse(result);
  }
}

Module.json = json;
Module.raw = raw;

Module.onInitialized = {
  addListener: function(cb) {
    if (initialized) {
      cb();
    }
    initListeners.push(cb);
  }
};

Module.promised = {};
Module.promised.json = function() {
  var args = arguments;
  return new Promise(function(resolve, reject) {
    Module.onInitialized.addListener(function() {
      try {
        resolve(Module.json.apply(Module, args));
      } catch (e) {
        reject(e);
      }
    });
  });
};
Module.promised.raw = function() {
  var args = arguments;
  return new Promise(function(resolve, reject) {
    Module.onInitialized.addListener(function() {
      try {
        resolve(Module.raw.apply(Module, args));
      } catch (e) {
        reject(e);
      }
    });
  });
};
