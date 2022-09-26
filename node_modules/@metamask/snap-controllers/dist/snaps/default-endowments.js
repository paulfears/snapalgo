"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ENDOWMENTS = void 0;
/**
 * Global JavaScript APIs exposed by default to all snaps.
 */
exports.DEFAULT_ENDOWMENTS = Object.freeze([
    'atob',
    'btoa',
    'BigInt',
    'Buffer',
    'console',
    'crypto',
    'Date',
    'Math',
    'setTimeout',
    'clearTimeout',
    'SubtleCrypto',
    'TextDecoder',
    'TextEncoder',
    'URL',
    'WebAssembly',
    'setInterval',
    'clearInterval',
    'AbortController', // Used by fetch, but also as API for some packages that don't do network connections
]);
//# sourceMappingURL=default-endowments.js.map