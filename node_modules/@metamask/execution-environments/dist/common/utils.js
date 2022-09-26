"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allFunctions = exports.allProperties = exports.constructError = void 0;
/**
 * Takes an error that was thrown, determines if it is
 * an error object. If it is then it will return that. Otherwise,
 * an error object is created with the original error message.
 *
 * @param originalError - The error that was originally thrown.
 * @returns An error object.
 */
function constructError(originalError) {
    let _originalError;
    if (originalError instanceof Error) {
        _originalError = originalError;
    }
    else if (typeof originalError === 'string') {
        _originalError = new Error(originalError);
        // The stack is useless in this case.
        delete _originalError.stack;
    }
    return _originalError;
}
exports.constructError = constructError;
/**
 * Get all properties of an object, including its prototype chain.
 *
 * @param obj - The object to get all properties for.
 * @returns All properties of `obj` as a tuple set, containing the property name
 * and value.
 */
function allProperties(obj) {
    const properties = new Set();
    let current = obj;
    do {
        for (const key of Reflect.ownKeys(current)) {
            properties.add([current, key]);
        }
    } while ((current = Reflect.getPrototypeOf(current)) &&
        current !== Object.prototype);
    return properties;
}
exports.allProperties = allProperties;
/**
 * Get all functions of an object, including its prototype chain. This does not
 * include constructor functions.
 *
 * @param obj - The object to get all functions for.
 * @returns An array with all functions of `obj` as string or symbol.
 */
function allFunctions(obj) {
    const result = [];
    for (const [object, key] of allProperties(obj)) {
        if (key === 'constructor') {
            continue;
        }
        const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
        if (descriptor !== undefined && typeof descriptor.value === 'function') {
            result.push(key);
        }
    }
    return result;
}
exports.allFunctions = allFunctions;
//# sourceMappingURL=utils.js.map