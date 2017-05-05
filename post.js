function exit () {}

function jqfilter (json, filter) {
  stdin = JSON.stringify(json)
  stdout = ''
  stderr = ''

  Module.callMain(['-c', filter])

  // calling main closes stdout, so we reopen it here:
  FS.streams[1] = FS.open('/dev/stdout', 577, 0)

  stdout = stdout.trim()
  try {
    if (stdout.indexOf('\n') !== -1) {
      return stdout
        .split('\n')
        .filter(function (x) { return x })
        .reduce(function (acc, line) { return acc.concat(JSON.parse(line)) }, [])
    } else {
      return JSON.parse(stdout)
    }
  } catch (e) {}

  if (stdout) {
    return stdout
  }

  throw new Error(stderr)
}
