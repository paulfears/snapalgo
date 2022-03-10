"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMITTED_NOTIFICATIONS = exports.NOOP = exports.logStreamDisconnectWarning = exports.getRpcPromiseCallback = exports.createErrorMiddleware = void 0;
const eth_rpc_errors_1 = require("eth-rpc-errors");
// utility functions
/**
 * json-rpc-engine middleware that logs RPC errors and and validates req.method.
 *
 * @param log - The logging API to use.
 * @returns  json-rpc-engine middleware function
 */
function createErrorMiddleware(log) {
    return (req, res, next) => {
        // json-rpc-engine will terminate the request when it notices this error
        if (typeof req.method !== 'string' || !req.method) {
            res.error = eth_rpc_errors_1.ethErrors.rpc.invalidRequest({
                message: `The request 'method' must be a non-empty string.`,
                data: req,
            });
        }
        next((done) => {
            const { error } = res;
            if (!error) {
                return done();
            }
            log.error(`MetaMask - RPC Error: ${error.message}`, error);
            return done();
        });
    };
}
exports.createErrorMiddleware = createErrorMiddleware;
// resolve response.result or response, reject errors
const getRpcPromiseCallback = (resolve, reject, unwrapResult = true) => (error, response) => {
    if (error || response.error) {
        reject(error || response.error);
    }
    else {
        !unwrapResult || Array.isArray(response)
            ? resolve(response)
            : resolve(response.result);
    }
};
exports.getRpcPromiseCallback = getRpcPromiseCallback;
/**
 * Logs a stream disconnection error. Emits an 'error' if given an
 * EventEmitter that has listeners for the 'error' event.
 *
 * @param log - The logging API to use.
 * @param remoteLabel - The label of the disconnected stream.
 * @param error - The associated error to log.
 * @param emitter - The logging API to use.
 */
function logStreamDisconnectWarning(log, remoteLabel, error, emitter) {
    let warningMsg = `MetaMask: Lost connection to "${remoteLabel}".`;
    if (error === null || error === void 0 ? void 0 : error.stack) {
        warningMsg += `\n${error.stack}`;
    }
    log.warn(warningMsg);
    if (emitter && emitter.listenerCount('error') > 0) {
        emitter.emit('error', warningMsg);
    }
}
exports.logStreamDisconnectWarning = logStreamDisconnectWarning;
const NOOP = () => undefined;
exports.NOOP = NOOP;
// constants
exports.EMITTED_NOTIFICATIONS = [
    'eth_subscription',
];
//# sourceMappingURL=utils.js.map