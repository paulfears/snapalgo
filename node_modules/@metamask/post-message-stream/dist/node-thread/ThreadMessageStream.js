"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ThreadMessageStream_parentPort;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadMessageStream = void 0;
const worker_threads_1 = require("worker_threads");
const BasePostMessageStream_1 = require("../BasePostMessageStream");
const utils_1 = require("../utils");
/**
 * Child thread-side Node.js `worker_threads` stream.
 */
class ThreadMessageStream extends BasePostMessageStream_1.BasePostMessageStream {
    constructor() {
        super();
        _ThreadMessageStream_parentPort.set(this, void 0);
        if (!worker_threads_1.parentPort) {
            throw new Error('Parent port not found. This class should only be instantiated in a Node.js worker thread.');
        }
        __classPrivateFieldSet(this, _ThreadMessageStream_parentPort, worker_threads_1.parentPort, "f");
        this._onMessage = this._onMessage.bind(this);
        __classPrivateFieldGet(this, _ThreadMessageStream_parentPort, "f").on('message', this._onMessage);
        this._handshake();
    }
    _postMessage(data) {
        __classPrivateFieldGet(this, _ThreadMessageStream_parentPort, "f").postMessage({ data });
    }
    _onMessage(message) {
        if (!(0, utils_1.isValidStreamMessage)(message)) {
            return;
        }
        this._onData(message.data);
    }
    _destroy() {
        __classPrivateFieldGet(this, _ThreadMessageStream_parentPort, "f").removeListener('message', this._onMessage);
    }
}
exports.ThreadMessageStream = ThreadMessageStream;
_ThreadMessageStream_parentPort = new WeakMap();
//# sourceMappingURL=ThreadMessageStream.js.map