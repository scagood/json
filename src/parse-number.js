function parseNumber(input, index) {
    const startIndex = index;

    while (
        index < input.length &&
        '-0123456789.eE'.includes(input.charAt(index))
    ) {
        index++;
    }

    const number = Number(input.slice(startIndex, index));

    const value = number.valueOf();
    return { index, value };
}

module.exports = parseNumber;
