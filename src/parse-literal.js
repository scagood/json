function parseLiteral(input, index, stringValue, value) {
    const inputValue = input.slice(index, index + stringValue.length);

    if (inputValue !== stringValue) {
        throw `Expecting ${ stringValue}`;
    }

    index += stringValue.length;
    return { index, value };
}

module.exports = parseLiteral;
