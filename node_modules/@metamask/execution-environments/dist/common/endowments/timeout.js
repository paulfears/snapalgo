"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a pair of `setTimeout` and `clearTimeout` functions attenuated such
 * that:
 * - `setTimeout` throws if its "handler" parameter is not a function.
 * - `clearTimeout` only clears timeouts created by its sibling `setTimeout`,
 * or else no-ops.
 *
 * @returns An object with the attenuated `setTimeout` and `clearTimeout`
 * functions.
 */
const createTimeout = () => {
    const registeredHandles = new Map();
    const _setTimeout = (handler, timeout) => {
        if (typeof handler !== 'function') {
            throw new Error(`The timeout handler must be a function. Received: ${typeof handler}`);
        }
        const handle = Object.freeze({});
        const platformHandle = setTimeout(() => {
            registeredHandles.delete(handle);
            handler();
        }, timeout);
        registeredHandles.set(handle, platformHandle);
        return handle;
    };
    const _clearTimeout = (handle) => {
        const platformHandle = registeredHandles.get(handle);
        if (platformHandle !== undefined) {
            clearTimeout(platformHandle);
            registeredHandles.delete(handle);
        }
    };
    const teardownFunction = () => {
        for (const handle of registeredHandles.keys()) {
            _clearTimeout(handle);
        }
    };
    return {
        setTimeout: _setTimeout,
        clearTimeout: _clearTimeout,
        teardownFunction,
    };
};
const endowmentModule = {
    names: ['setTimeout', 'clearTimeout'],
    factory: createTimeout,
};
exports.default = endowmentModule;
//# sourceMappingURL=timeout.js.map