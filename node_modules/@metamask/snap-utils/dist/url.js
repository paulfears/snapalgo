"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = void 0;
/**
 * Checks whether a URL is valid.
 *
 * @param maybeUrl - The string to check.
 * @returns Whether the specified string is a valid URL.
 */
function isValidUrl(maybeUrl) {
    try {
        return Boolean(new URL(maybeUrl));
    }
    catch (_error) {
        return false;
    }
}
exports.isValidUrl = isValidUrl;
//# sourceMappingURL=url.js.map