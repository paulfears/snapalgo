"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConstructor = exports.createEndowments = void 0;
const utils_1 = require("@metamask/utils");
const globalObject_1 = require("../globalObject");
const buffer_1 = __importDefault(require("./buffer"));
const interval_1 = __importDefault(require("./interval"));
const network_1 = __importDefault(require("./network"));
const timeout_1 = __importDefault(require("./timeout"));
const crypto_1 = __importDefault(require("./crypto"));
/**
 * A map of endowment names to their factory functions. Some endowments share
 * the same factory function, but we only call each factory once for each snap.
 * See {@link createEndowments} for details.
 */
const endowmentFactories = [buffer_1.default, timeout_1.default, interval_1.default, network_1.default, crypto_1.default].reduce((factories, builder) => {
    builder.names.forEach((name) => {
        factories.set(name, builder.factory);
    });
    return factories;
}, new Map());
/**
 * Gets the endowments for a particular Snap. Some endowments, like `setTimeout`
 * and `clearTimeout`, must be attenuated so that they can only affect behavior
 * within the Snap's own realm. Therefore, we use factory functions to create
 * such attenuated / modified endowments. Otherwise, the value that's on the
 * root realm global will be used.
 *
 * @param wallet - The Snap's provider object.
 * @param endowments - The list of endowments to provide to the snap.
 * @returns An object containing the Snap's endowments.
 */
function createEndowments(wallet, endowments = []) {
    const attenuatedEndowments = {};
    // TODO: All endowments should be hardened to prevent covert communication
    // channels. Hardening the returned objects breaks tests elsewhere in the
    // monorepo, so further research is needed.
    const result = endowments.reduce(({ allEndowments, teardowns }, endowmentName) => {
        // First, check if the endowment has a factory, and default to that.
        if (endowmentFactories.has(endowmentName)) {
            if (!(0, utils_1.hasProperty)(attenuatedEndowments, endowmentName)) {
                // Call the endowment factory for the current endowment. If the factory
                // creates multiple endowments, they will all be assigned to the
                // `attenuatedEndowments` object, but will only be passed on to the snap
                // if explicitly listed among its endowment.
                // This may not have an actual use case, but, safety first.
                // We just confirmed that endowmentFactories has the specified key.
                const _a = 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                endowmentFactories.get(endowmentName)(), { teardownFunction } = _a, endowment = __rest(_a, ["teardownFunction"]);
                Object.assign(attenuatedEndowments, endowment);
                if (teardownFunction) {
                    teardowns.push(teardownFunction);
                }
            }
            allEndowments[endowmentName] = attenuatedEndowments[endowmentName];
        }
        else if (endowmentName in globalObject_1.rootRealmGlobal) {
            // If the endowment doesn't have a factory, just use whatever is on the
            // global object.
            const globalValue = globalObject_1.rootRealmGlobal[endowmentName];
            allEndowments[endowmentName] =
                typeof globalValue === 'function' && !isConstructor(globalValue)
                    ? globalValue.bind(globalObject_1.rootRealmGlobal)
                    : globalValue;
        }
        else {
            // If we get to this point, we've been passed an endowment that doesn't
            // exist in our current environment.
            throw new Error(`Unknown endowment: "${endowmentName}".`);
        }
        return { allEndowments, teardowns };
    }, {
        allEndowments: { wallet },
        teardowns: [],
    });
    const teardown = async () => {
        await Promise.all(result.teardowns.map((teardownFunction) => teardownFunction()));
    };
    return { endowments: result.allEndowments, teardown };
}
exports.createEndowments = createEndowments;
/**
 * Checks whether the specified function is a constructor.
 *
 * @param value - Any function value.
 * @returns Whether the specified function is a constructor.
 */
// `Function` is exactly what we want here.
// eslint-disable-next-line @typescript-eslint/ban-types
function isConstructor(value) {
    var _a, _b;
    // In our current usage, the string `prototype.constructor.name` should never
    // be empty, because you can't create a class with no name, and the
    // `prototype.constructor.name` property is configurable but not writable.
    // Nevertheless, that property was the empty string for `Date` in the iframe
    // execution environment during local testing. We have no idea why, but we
    // have to handle that case.
    // TODO: Does the `prototype` object always have a `constructor` property?
    return Boolean(typeof ((_b = (_a = value.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) === 'string');
}
exports.isConstructor = isConstructor;
//# sourceMappingURL=index.js.map