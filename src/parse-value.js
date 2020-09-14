const { skipWhiteSpace } = require('./parse-tokens.js');

const parseObject = require('./parse-object.js');
const parseArray = require('./parse-array.js');
const parseQuery = require('./parse-query.js');
const parseLiteral = require('./parse-literal.js');
const parseRegex = require('./parse-regex.js');
const parsePath = require('./parse-path.js');
const parseString = require('./parse-string.js');
const parseNumber = require('./parse-number.js');

const numericStartingValues = '0123456789-.';
function parseValue(input, index) {
    ({ index } = skipWhiteSpace(input, index));

    if (input[index] === '{') {
        return parseObject(input, index);
    }

    if (input[index] === '[') {
        return parseArray(input, index);
    }

    if (input[index] === 't') {
        return parseLiteral(input, index, 'true', true);
    }

    if (input[index] === 'f') {
        return parseLiteral(input, index, 'false', false);
    }

    if (input[index] === 'n') {
        return parseLiteral(input, index, 'null', null);
    }

    if (input[index] === '/') {
        return parseRegex(input, index);
    }

    if (input[index] === '\'' || input[index] === '"') {
        return parseString(input, index);
    }

    if (numericStartingValues.includes(input[index])) {
        return parseNumber(input, index);
    }

    throw new Error(`Invalid value at ${index}`);
}

function parsePathValue(input, index, excludeQuery = false) {
    ({ index } = skipWhiteSpace(input, index));

    if (
        excludeQuery !== true &&
        input[index] === '/' &&
        input[index + 1] === '['
    ) {
        return parseQuery(input, index + 1);
    }

    if (input[index] === 't') {
        return parseLiteral(input, index, 'true', true);
    }

    if (input[index] === 'f') {
        return parseLiteral(input, index, 'false', false);
    }

    if (input[index] === 'n') {
        return parseLiteral(input, index, 'null', null);
    }

    if (input[index] === '/') {
        return parsePath(input, index);
    }

    if (input[index] === '\'' || input[index] === '"') {
        return parseString(input, index);
    }

    if (numericStartingValues.includes(input[index])) {
        return parseNumber(input, index);
    }

    throw new Error(`Invalid value at ${index}`);
}

module.exports = {
    parseValue,
    parsePathValue,
};
