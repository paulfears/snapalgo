"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadParentMessageStream = void 0;
const BasePostMessageStream_1 = require("../BasePostMessageStream");
const utils_1 = require("../utils");
/**
 * Parent-side Node.js `worker_threads` stream.
 */
class ThreadParentMessageStream extends BasePostMessageStream_1.BasePostMessageStream {
    /**
     * Creates a stream for communicating with a Node.js `worker_threads` thread.
     *
     * @param args - Options bag.
     * @param args.thread - The thread to communicate with.
     */
    constructor({ thread }) {
        super();
        this._thread = thread;
        this._onMessage = this._onMessage.bind(this);
        this._thread.on('message', this._onMessage);
        this._handshake();
    }
    _postMessage(data) {
        this._thread.postMessage({ data });
    }
    _onMessage(message) {
        if (!(0, utils_1.isValidStreamMessage)(message)) {
            return;
        }
        this._onData(message.data);
    }
    _destroy() {
        this._thread.removeListener('message', this._onMessage);
    }
}
exports.ThreadParentMessageStream = ThreadParentMessageStream;
//# sourceMappingURL=ThreadParentMessageStream.js.map