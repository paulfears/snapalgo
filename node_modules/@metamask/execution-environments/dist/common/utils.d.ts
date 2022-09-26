/**
 * Takes an error that was thrown, determines if it is
 * an error object. If it is then it will return that. Otherwise,
 * an error object is created with the original error message.
 *
 * @param originalError - The error that was originally thrown.
 * @returns An error object.
 */
export declare function constructError(originalError: unknown): Error | undefined;
/**
 * Get all properties of an object, including its prototype chain.
 *
 * @param obj - The object to get all properties for.
 * @returns All properties of `obj` as a tuple set, containing the property name
 * and value.
 */
export declare function allProperties(obj: any): Set<[object, string | symbol]>;
/**
 * Get all functions of an object, including its prototype chain. This does not
 * include constructor functions.
 *
 * @param obj - The object to get all functions for.
 * @returns An array with all functions of `obj` as string or symbol.
 */
export declare function allFunctions(obj: any): (string | symbol)[];
