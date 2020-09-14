const { parseAnd, parseEquals } = require('./parse-tokens.js');

function fixType(value) {
    if (value instanceof Object) {
        return value;
    }

    return {
        type: typeof value,
        value: value,
    };
}

function parseQuery(input, index) {
    // eslint-disable-next-line global-require
    const { parsePathValue } = require('./parse-value.js');

    const value = {};

    ({ value: value.left, index } = parsePathValue(input, index, true));
    ({ value: value.operator, index } = parseEquals(input, index));
    ({ value: value.right, index } = parsePathValue(input, index, true));

    value.left = fixType(value.left);
    value.right = fixType(value.right);

    return { index, value };
}

function parseQueryGroup(input, index) {
    const query = [];
    index++;

    while (
        index < input.length &&
        input[index] !== ']'
    ) {
        let value;
        ({ index, value } = parseQuery(input, index));
        query.push(value);

        ({ index } = parseAnd(input, index, ']'));
    }

    const value = {
        type: 'query',
        query: query,
    };

    index++;
    return { index, value };
}

module.exports = parseQueryGroup;
