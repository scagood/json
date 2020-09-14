const { parseComma, parseColon } = require('./parse-tokens.js');
const { skipWhiteSpace } = require('./parse-tokens.js');
const parseString = require('./parse-string.js');
const parseNumber = require('./parse-number.js');

function parseNonQuotedKey(input, index) {
    let value = '';

    while (
        index < input.length &&
        /\w/.test(input[index])
    ) {
        value += input[index++];
    }

    return { index, value };
}

const numericStartingValues = '0123456789-.';
function parseKey(input, index) {
    ({ index } = skipWhiteSpace(input, index));

    if (input[index] === '\'' || input[index] === '"') {
        return parseString(input, index);
    }

    if (numericStartingValues.includes(input[index])) {
        return parseNumber(input, index);
    }

    if (/\w/.test(input[index])) {
        return parseNonQuotedKey(input, index);
    }

    throw new Error(`Invalid object key at ${index}`);
}

function parseObject(input, index) {
    // eslint-disable-next-line global-require
    const { parseValue } = require('./parse-value.js');

    const object = {};
    // Open bracket
    index++;

    while (
        index < input.length &&
        input[index] !== '}'
    ) {
        let key;
        ({ index, value: key } = parseKey(input, index));

        ({ index } = parseColon(input, index));

        let value;
        ({ index, value } = parseValue(input, index));
        object[key] = value;

        ({ index } = parseComma(input, index, '}'));
    }

    // Close bracket
    index++;

    return { index: index, value: object };
}

module.exports = parseObject;
