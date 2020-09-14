const { parseValue } = require('./parse-value.js');

function parse(input) {
    const { value } = parseValue(input, 0);

    // TODO: value path post processing

    return value;
}

module.exports = parse;
