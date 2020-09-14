const { parseComma } = require('./parse-tokens.js');

function parseArray(input, index) {
    // eslint-disable-next-line global-require
    const { parseValue } = require('./parse-value.js');

    const array = [];
    // Open bracket
    index++;

    while (
        index < input.length &&
        input[index] !== ']'
    ) {
        let value;
        ({ index, value } = parseValue(input, index));
        array.push(value);

        ({ index } = parseComma(input, index, ']'));
    }

    // Close bracket
    index++;

    return { index: index, value: array };
}

module.exports = parseArray;
