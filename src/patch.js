const clone = require('clone-deep');
const parsePointer = require('./pointer.js');

function executePath(object, { value }) {
    if (object instanceof Object === false) {
        throw new TypeError('Parent node not an object');
    }

    if (
        Array.isArray(object) &&
        value === '-'
    ) {
        return object[object.length - 1];
    }

    return object[value];
}

function findQueryIndex(array, pointer) {
    if (Array.isArray(array) === false) {
        throw new TypeError('Cannot query non arrays');
    }

    const index = array.findIndex(object => {
        for (const query of pointer.query) {
            let left = query.left.value;
            let right = query.right.value;

            if (query.left.type === 'path') {
                left = executePath(object, query.left);
            }

            if (query.right.type === 'path') {
                right = executePath(object, query.right);
            }

            if (query.operator === '==' && left !== right) {
                return false;
            }

            if (query.operator === '!=' && left === right) {
                return false;
            }
        }

        return true;
    });

    if (index < 0) {
        throw new Error('Cannot locate index from query');
    }

    pointer.value = index;
}

function traverseTo(object, path) {
    let current = object;
    for (const pointer of path) {
        if (pointer.type === 'query') {
            findQueryIndex(current, pointer);
        }

        current = executePath(current, pointer);
    }

    return current;
}

function arrayIndex(parent, target) {
    if (target.value === '-') {
        target.value = parent.length;
    }

    const numericIndex = Number.parseFloat(target.value, 10);

    if (Number.isInteger(numericIndex) === false) {
        throw new TypeError(`Cannot add at ${target.value} in an array`);
    }

    if (numericIndex < 0) {
        throw new Error(`Cannot add at ${target.value} its below 0`);
    }

    if (numericIndex > parent.length) {
        throw new Error(`Cannot add at ${target.value} its beyond array.length(${parent.length})`);
    }

    return numericIndex;
}

function actionAt(object, { path }, objectAction, arrayAction) {
    const pointer = parsePointer(path);

    const output = clone(object);
    const parent = traverseTo(output, pointer.slice(0, -1));

    const target = pointer.pop();
    if (target.type === 'query') {
        findQueryIndex(parent, target);
    }

    if (Array.isArray(parent)) {
        const numericIndex = arrayIndex(parent, target);

        arrayAction(parent, numericIndex);

        return output;
    }

    if (parent instanceof Object === false) {
        throw new TypeError(`Cannot add at ${target.value} in not an Object`);
    }

    objectAction(parent, target.value);

    return output;
}

function add(object, { path, value }) {
    return actionAt(
        object,
        { path, value },
        (target, key) => {
            if (
                typeof target[key] !== 'undefined' &&
                target[key] !== null
            ) {
                throw new Error('Cannot "add" over existing value');
            }

            target[key] = value;
        },
        (target, index) => target.splice(index, 0, value),
    );
}

function remove(object, { path }) {
    return actionAt(
        object,
        { path },
        (target, key) => {
            delete target[key];
        },
        (target, index) => target.splice(index, 1),
    );
}

function replace(object, { path, value }) {
    return actionAt(
        object,
        { path, value },
        (target, key) => {
            target[key] = value;
        },
        (target, index) => target.splice(index, 1, value),
    );
}

function copy(object, { path, from }) {
    const value = traverseTo(object, parsePointer(from));

    return actionAt(
        object,
        { path, value },
        (target, key) => {
            target[key] = value;
        },
        (target, index) => target.splice(index, 1, value),
    );
}

function move(object, { path, from }) {
    const value = traverseTo(object, parsePointer(from));
    object = remove(object, { path: from });

    return actionAt(
        object,
        { path, value },
        (target, key) => {
            target[key] = value;
        },
        (target, index) => target.splice(index, 1, value),
    );
}

function test(object, { path, value }) {
    const testValue = (target, key) => {
        if (target[key] !== value) {
            throw new Error(`value at "${path}" does not match given value`);
        }
    };

    return actionAt(
        object,
        { path, value },
        testValue,
        testValue,
    );
}

const operations = {
    add, remove, replace,
    copy, move, test,
};

function patch(object, patches) {
    for (const patch of patches) {
        if (Object.hasOwnProperty.call(operations, patch.op) === false) {
            throw new Error('Invalid patch operation');
        }

        object = operations[patch.op](object, patch);
    }

    return object;
}

module.exports = patch;
