"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a pair of `setInterval` and `clearInterval` functions attenuated such
 * that:
 * - `setInterval` throws if its "handler" parameter is not a function.
 * - `clearInterval` only clears timeouts created by its sibling `setInterval`,
 * or else no-ops.
 *
 * @returns An object with the attenuated `setInterval` and `clearInterval`
 * functions.
 */
const createInterval = () => {
    const registeredHandles = new Map();
    const _setInterval = (handler, timeout) => {
        if (typeof handler !== 'function') {
            throw new Error(`The interval handler must be a function. Received: ${typeof handler}`);
        }
        const handle = Object.freeze({});
        const platformHandle = setInterval(handler, timeout);
        registeredHandles.set(handle, platformHandle);
        return handle;
    };
    const _clearInterval = (handle) => {
        const platformHandle = registeredHandles.get(handle);
        if (platformHandle !== undefined) {
            clearInterval(platformHandle);
            registeredHandles.delete(handle);
        }
    };
    const teardownFunction = () => {
        for (const handle of registeredHandles.keys()) {
            _clearInterval(handle);
        }
    };
    return {
        setInterval: _setInterval,
        clearInterval: _clearInterval,
        teardownFunction,
    };
};
const endowmentModule = {
    names: ['setInterval', 'clearInterval'],
    factory: createInterval,
};
exports.default = endowmentModule;
//# sourceMappingURL=interval.js.map