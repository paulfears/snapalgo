"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebWorkerPostMessageStream = void 0;
// We ignore coverage for the entire file due to limits on our instrumentation,
// but it is in fact covered by our tests.
const BasePostMessageStream_1 = require("../BasePostMessageStream");
const utils_1 = require("../utils");
/**
 * Worker-side dedicated `WebWorker.postMessage` stream. Designed for use with
 * dedicated workers only.
 */
class WebWorkerPostMessageStream extends BasePostMessageStream_1.BasePostMessageStream {
    constructor() {
        // Kudos: https://stackoverflow.com/a/18002694
        if (typeof self === 'undefined' ||
            // @ts-expect-error: No types for WorkerGlobalScope
            typeof WorkerGlobalScope === 'undefined' ||
            // @ts-expect-error: No types for WorkerGlobalScope
            !(self instanceof WorkerGlobalScope)) {
            throw new Error('WorkerGlobalScope not found. This class should only be instantiated in a WebWorker.');
        }
        super();
        this._name = utils_1.DEDICATED_WORKER_NAME;
        self.onmessage = this._onMessage.bind(this);
        this._handshake();
    }
    _postMessage(data) {
        // Cast of self.postMessage due to usage of DOM lib
        self.postMessage({ data });
    }
    _onMessage(event) {
        const message = event.data;
        // validate message
        if (!(0, utils_1.isValidStreamMessage)(message) || message.target !== this._name) {
            return;
        }
        this._onData(message.data);
    }
    // worker stream lifecycle assumed to be coterminous with global scope
    _destroy() {
        return undefined;
    }
}
exports.WebWorkerPostMessageStream = WebWorkerPostMessageStream;
//# sourceMappingURL=WebWorkerPostMessageStream.js.map