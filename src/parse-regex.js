function parseRegex(input, index) {
    let source = '';

    const slash = input[index++];
    while (
        index < input.length &&
        input[index] !== slash
    ) {
        const character = input[index++];

        if (character === '\r' || character === '\n') {
            throw new Error(`Unexpected new line at ${index - 1}`);
        }

        if (character === '\\') {
            source += character;
            source += input[index++];

            continue;
        }

        source += character;
    }
    index++;

    const allowedFlags = 'gimsuy';
    let flags = '';
    while (
        index < input.length &&
        allowedFlags.includes(input[index])
    ) {
        const character = input[index++];

        if (flags.includes(character)) {
            throw new Error(`Duplicate flag at ${index - 1}`);
        }

        flags += character;
    }

    const regex = new RegExp(source, flags);
    return { index: index, value: regex };
}

module.exports = parseRegex;
