"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEventListener = exports.addEventListener = void 0;
const globalObject_1 = require("./globalObject");
/**
 * Adds an event listener platform agnostically, trying both `globalThis.addEventListener` and `globalThis.process.on`
 *
 * @param event - The event to listen for.
 * @param listener - The listener to be triggered when the event occurs.
 * @returns The result of the platform agnostic operation if any.
 * @throws If none of the platform options are present.
 */
function addEventListener(event, listener) {
    if ('addEventListener' in globalObject_1.rootRealmGlobal &&
        typeof globalObject_1.rootRealmGlobal.addEventListener === 'function') {
        return globalObject_1.rootRealmGlobal.addEventListener(event.toLowerCase(), listener);
    }
    if (globalObject_1.rootRealmGlobal.process &&
        'on' in globalObject_1.rootRealmGlobal.process &&
        typeof globalObject_1.rootRealmGlobal.process.on === 'function') {
        return globalObject_1.rootRealmGlobal.process.on(event, listener);
    }
    throw new Error('Platform agnostic addEventListener failed');
}
exports.addEventListener = addEventListener;
/**
 * Removes an event listener platform agnostically, trying both `globalThis.removeEventListener` and `globalThis.process.removeListener`
 *
 * @param event - The event to remove the listener for.
 * @param listener - The currently attached listener.
 * @returns The result of the platform agnostic operation if any.
 * @throws If none of the platform options are present.
 */
function removeEventListener(event, listener) {
    if ('removeEventListener' in globalObject_1.rootRealmGlobal &&
        typeof globalObject_1.rootRealmGlobal.removeEventListener === 'function') {
        return globalObject_1.rootRealmGlobal.removeEventListener(event.toLowerCase(), listener);
    }
    if (globalObject_1.rootRealmGlobal.process &&
        'removeListener' in globalObject_1.rootRealmGlobal.process &&
        typeof globalObject_1.rootRealmGlobal.process.removeListener === 'function') {
        return globalObject_1.rootRealmGlobal.process.removeListener(event, listener);
    }
    throw new Error('Platform agnostic removeEventListener failed');
}
exports.removeEventListener = removeEventListener;
//# sourceMappingURL=globalEvents.js.map