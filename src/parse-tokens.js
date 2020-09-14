function skipWhiteSpace(input, index) {
    while (
        index < input.length &&
        (
            input[index] === ' ' ||
            input[index] === '\r' ||
            input[index] === '\n' ||
            input[index] === '\t'
        )
    ) {
        index++;
    }

    return { index };
}

function parseComma(input, index, terminator) {
    ({ index } = skipWhiteSpace(input, index));

    if (input[index] === terminator) {
        return { index };
    }

    // This does allow trailing commas
    if (input[index] !== ',') {
        throw new Error('Invalid json, expected a ","');
    }

    return skipWhiteSpace(input, index + 1);
}

function parseColon(input, index) {
    ({ index } = skipWhiteSpace(input, index));

    // This does allow trailing commas
    if (input[index] !== ':') {
        throw new Error('Invalid json, expected a ":"');
    }

    return skipWhiteSpace(input, index + 1);
}

function parseAnd(input, index, terminator) {
    ({ index } = skipWhiteSpace(input, index));

    if (input[index] === terminator) {
        return { index };
    }

    const value = input[index] + input[index + 1];
    if (value !== '&&') {
        throw new Error('Invalid json, expected a "&&"');
    }

    return skipWhiteSpace(input, index + 2);
}

function parseEquals(input, index) {
    ({ index } = skipWhiteSpace(input, index));

    const value = input[index] + input[index + 1];
    if (
        value !== '==' &&
        value !== '!='
    ) {
        throw new Error('Invalid json, expected "==", or "!="');
    }

    ({ index } = skipWhiteSpace(input, index + 2));

    return { index, value };
}

module.exports = {
    skipWhiteSpace,
    parseComma,
    parseColon,
    parseAnd,
    parseEquals,
};
