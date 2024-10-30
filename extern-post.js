jq = jq().then( module => {
  return { json: module.json, raw: module.raw };
} );

if (typeof exports === 'object' && typeof module === 'object')
  module.exports = jq;
else if (typeof exports === 'object')
  exports["jq"] = jq;
