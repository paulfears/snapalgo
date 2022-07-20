"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerEval = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
/**
 * Spawn a new worker thread to run the provided bundle in.
 *
 * @param bundlePath - The path to the bundle to run.
 * @returns `null` if the worker ran successfully.
 * @throws If the worker failed to run successfully.
 */
function workerEval(bundlePath) {
    return new Promise((resolve) => {
        (0, child_process_1.fork)(getEvalWorkerPath(), [bundlePath]).on('exit', (exitCode) => {
            if (exitCode === 0) {
                resolve(null);
            }
            else {
                throw new Error(`Worker exited abnormally! Code: ${exitCode}`);
            }
        });
    });
}
exports.workerEval = workerEval;
/**
 * Get the path to the eval worker file.
 *
 * @returns The path to the eval worker file.
 */
function getEvalWorkerPath() {
    return path_1.default.join(__dirname, 'eval-worker.js');
}
//# sourceMappingURL=workerEval.js.map