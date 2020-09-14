const { parsePathValue } = require('./parse-value.js');

function parse(input) {
    const output = [];

    let value;
    let index = 0;
    while (index < input.length) {
        ({ value, index } = parsePathValue(input, index));

        if (value instanceof Object === false) {
            value = {
                type: typeof value,
                value: value,
            };
        }
        output.push(value);
    }

    return output;
}

module.exports = parse;
