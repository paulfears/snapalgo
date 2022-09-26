"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessParentMessageStream = void 0;
const BasePostMessageStream_1 = require("../BasePostMessageStream");
const utils_1 = require("../utils");
/**
 * Parent-side Node.js `child_process` stream.
 */
class ProcessParentMessageStream extends BasePostMessageStream_1.BasePostMessageStream {
    /**
     * Creates a stream for communicating with a Node.js `child_process` process.
     *
     * @param args - Options bag.
     * @param args.process - The process to communicate with.
     */
    constructor({ process }) {
        super();
        this._process = process;
        this._onMessage = this._onMessage.bind(this);
        this._process.on('message', this._onMessage);
        this._handshake();
    }
    _postMessage(data) {
        this._process.send({ data });
    }
    _onMessage(message) {
        if (!(0, utils_1.isValidStreamMessage)(message)) {
            return;
        }
        this._onData(message.data);
    }
    _destroy() {
        this._process.removeListener('message', this._onMessage);
    }
}
exports.ProcessParentMessageStream = ProcessParentMessageStream;
//# sourceMappingURL=ProcessParentMessageStream.js.map