"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessMessageStream = void 0;
const BasePostMessageStream_1 = require("../BasePostMessageStream");
const utils_1 = require("../utils");
/**
 * Child process-side Node.js `child_process` stream.
 */
class ProcessMessageStream extends BasePostMessageStream_1.BasePostMessageStream {
    constructor() {
        super();
        if (typeof globalThis.process.send !== 'function') {
            throw new Error('Parent IPC channel not found. This class should only be instantiated in a Node.js child process.');
        }
        this._onMessage = this._onMessage.bind(this);
        globalThis.process.on('message', this._onMessage);
        this._handshake();
    }
    _postMessage(data) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        globalThis.process.send({ data });
    }
    _onMessage(message) {
        if (!(0, utils_1.isValidStreamMessage)(message)) {
            return;
        }
        this._onData(message.data);
    }
    _destroy() {
        globalThis.process.removeListener('message', this._onMessage);
    }
}
exports.ProcessMessageStream = ProcessMessageStream;
//# sourceMappingURL=ProcessMessageStream.js.map