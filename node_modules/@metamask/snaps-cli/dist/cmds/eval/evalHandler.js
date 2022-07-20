"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapEval = void 0;
const utils_1 = require("../../utils");
const workerEval_1 = require("./workerEval");
/**
 * Runs the snap in a worker, to ensure SES compatibility.
 *
 * @param argv - The Yargs arguments object.
 * @returns A promise that resolves once the eval has finished.
 * @throws If the eval failed.
 */
async function snapEval(argv) {
    const { bundle: bundlePath } = argv;
    await (0, utils_1.validateFilePath)(bundlePath);
    try {
        await (0, workerEval_1.workerEval)(bundlePath);
        console.log(`Eval Success: evaluated '${bundlePath}' in SES!`);
    }
    catch (err) {
        (0, utils_1.logError)(`Snap evaluation error: ${err.message}`, err);
        throw err;
    }
}
exports.snapEval = snapEval;
//# sourceMappingURL=evalHandler.js.map