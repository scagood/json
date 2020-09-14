function characterFrom(input, index, length) {
    const stringValue = input.slice(index, index + length);
    const numericValue = Number.parseInt(stringValue, 16);

    return String.fromCharCode(numericValue);
}

function parseString(input, index) {
    let value = '';

    const quote = input[index++];
    while (
        index < input.length &&
        input[index] !== quote
    ) {
        const character = input[index++];

        if (character === '\r' || character === '\n') {
            throw new Error(`Unexpected new line at ${index - 1}`);
        }

        if (character === '\\') {
            const escaped = input[index++];
            switch (escaped) {
            case 'b':
                value += '\b';
                break;
            case 'f':
                value += '\f';
                break;
            case 'n':
                value += '\n';
                break;
            case 'r':
                value += '\r';
                break;
            case 't':
                value += '\t';
                break;
            case 'u':
                value += characterFrom(input, index, 4);
                index += 4;
                break;
            case 'x':
                value += characterFrom(input, index, 2);
                index += 2;
                break;
            default:
                value += escaped;
                break;
            }

            continue;
        }

        value += character;
    }

    index++;
    return { index, value };
}

module.exports = parseString;
