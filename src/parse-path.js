function parsePath(input, index) {
    let source = '';

    index++;
    while (
        index < input.length &&
        input[index] !== '/' &&
        input[index] !== ' '
    ) {
        const character = input[index++];

        if (character === '\r' || character === '\n') {
            throw new Error(`Unexpected new line at ${index - 1}`);
        }

        if (character === '\\') {
            source += input[index++];

            continue;
        }

        source += character;
    }

    const value = { type: 'path', value: source };

    return { index, value };
}

module.exports = parsePath;
