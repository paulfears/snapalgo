"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSnapConfig = void 0;
function isSnapConfig(obj, _argumentName) {
    return ((obj !== null &&
        typeof obj === "object" ||
        typeof obj === "function") &&
        (typeof obj.cliOptions === "undefined" ||
            (obj.cliOptions !== null &&
                typeof obj.cliOptions === "object" ||
                typeof obj.cliOptions === "function") &&
                Object.entries(obj.cliOptions)
                    .every(([key, _value]) => (typeof key === "string"))) &&
        (typeof obj.bundlerCustomizer === "undefined" ||
            typeof obj.bundlerCustomizer === "function"));
}
exports.isSnapConfig = isSnapConfig;
//# sourceMappingURL=snap-config.__GENERATED__.js.map