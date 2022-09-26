"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalObject_1 = require("../globalObject");
const createCrypto = () => {
    if ('crypto' in globalObject_1.rootRealmGlobal &&
        typeof globalObject_1.rootRealmGlobal.crypto === 'object' &&
        'SubtleCrypto' in globalObject_1.rootRealmGlobal &&
        typeof globalObject_1.rootRealmGlobal.SubtleCrypto === 'function') {
        return {
            crypto: globalObject_1.rootRealmGlobal.crypto,
            SubtleCrypto: globalObject_1.rootRealmGlobal.SubtleCrypto,
        };
    }
    // For now, we expose the experimental webcrypto API for Node.js execution environments
    // @todo Figure out if this is enough long-term or if we should use a polyfill.
    /* eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, node/global-require */
    const crypto = require('crypto').webcrypto;
    return { crypto, SubtleCrypto: crypto.subtle.constructor };
};
const endowmentModule = {
    names: ['crypto', 'SubtleCrypto'],
    factory: createCrypto,
};
exports.default = endowmentModule;
//# sourceMappingURL=crypto.js.map