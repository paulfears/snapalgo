"use strict";
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../../../../../node_modules/ses/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeLockdown = void 0;
/**
 * Execute SES lockdown in the current context, i.e., the current iframe.
 *
 * @throws If the SES lockdown failed.
 */
function executeLockdown() {
    try {
        lockdown({
            consoleTaming: 'unsafe',
            errorTaming: 'unsafe',
            mathTaming: 'unsafe',
            dateTaming: 'unsafe',
            overrideTaming: 'severe',
        });
    }
    catch (error) {
        // If the `lockdown` call throws an exception, it should not be able to continue
        console.error('Lockdown failed:', error);
        throw error;
    }
}
exports.executeLockdown = executeLockdown;
//# sourceMappingURL=lockdown.js.map