"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebWorkerParentPostMessageStream = void 0;
const BasePostMessageStream_1 = require("../BasePostMessageStream");
const utils_1 = require("../utils");
/**
 * Parent-side dedicated `WebWorker.postMessage` stream. Designed for use with
 * dedicated workers only.
 */
class WebWorkerParentPostMessageStream extends BasePostMessageStream_1.BasePostMessageStream {
    /**
     * Creates a stream for communicating with a dedicated `WebWorker`.
     *
     * @param args - Options bag.
     * @param args.worker - The Web Worker to exchange messages with. The worker
     * must instantiate a `WebWorkerPostMessageStream`.
     */
    constructor({ worker }) {
        super();
        this._target = utils_1.DEDICATED_WORKER_NAME;
        this._worker = worker;
        this._worker.onmessage = this._onMessage.bind(this);
        this._handshake();
    }
    _postMessage(data) {
        this._worker.postMessage({
            target: this._target,
            data,
        });
    }
    _onMessage(event) {
        const message = event.data;
        if (!(0, utils_1.isValidStreamMessage)(message)) {
            return;
        }
        this._onData(message.data);
    }
    _destroy() {
        this._worker.onmessage = null;
        this._worker = null;
    }
}
exports.WebWorkerParentPostMessageStream = WebWorkerParentPostMessageStream;
//# sourceMappingURL=WebWorkerParentPostMessageStream.js.map