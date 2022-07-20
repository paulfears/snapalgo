"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
// eslint-disable-next-line import/no-unassigned-import
require("ses/lockdown");
const mock_1 = require("./mock");
lockdown({
    consoleTaming: 'unsafe',
    errorTaming: 'unsafe',
    mathTaming: 'unsafe',
    dateTaming: 'unsafe',
    overrideTaming: 'severe',
});
/**
 * Get mock endowments that don't do anything. This is useful for running the
 * eval, for snaps that try to communicate with the extension on initialisation,
 * for example.
 *
 * @returns The mock endowments.
 */
function getMockEndowments() {
    const endowments = (0, mock_1.generateMockEndowments)();
    return Object.assign(Object.assign({}, endowments), { window: endowments, self: endowments });
}
const snapFilePath = process.argv[2];
const snapModule = { exports: {} };
new Compartment(Object.assign(Object.assign({}, getMockEndowments()), { module: snapModule, exports: snapModule.exports })).evaluate((0, fs_1.readFileSync)(snapFilePath, 'utf8'));
if (!((_a = snapModule.exports) === null || _a === void 0 ? void 0 : _a.onRpcRequest)) {
    console.warn(`The Snap doesn't have an "onRpcRequest" export defined.`);
}
setTimeout(() => process.exit(0), 1000); // Hack to ensure worker exits
//# sourceMappingURL=eval-worker.js.map