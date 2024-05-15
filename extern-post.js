module.exports = jq().then( module => {
    return { json: module.json, raw: module.raw };
} );
