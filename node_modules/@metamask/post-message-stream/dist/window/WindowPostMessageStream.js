"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowPostMessageStream = void 0;
const BasePostMessageStream_1 = require("../BasePostMessageStream");
const utils_1 = require("../utils");
/**
 * A {@link Window.postMessage} stream.
 */
class WindowPostMessageStream extends BasePostMessageStream_1.BasePostMessageStream {
    /**
     * Creates a stream for communicating with other streams across the same or
     * different `window` objects.
     *
     * @param args - Options bag.
     * @param args.name - The name of the stream. Used to differentiate between
     * multiple streams sharing the same window object.
     * @param args.target - The name of the stream to exchange messages with.
     * @param args.targetOrigin - The origin of the target. Defaults to
     * `location.origin`, '*' is permitted.
     * @param args.targetWindow - The window object of the target stream. Defaults
     * to `window`.
     */
    constructor({ name, target, targetOrigin = location.origin, targetWindow = window, }) {
        super();
        if (typeof window === 'undefined' ||
            typeof window.postMessage !== 'function') {
            throw new Error('window.postMessage is not a function. This class should only be instantiated in a Window.');
        }
        this._name = name;
        this._target = target;
        this._targetOrigin = targetOrigin;
        this._targetWindow = targetWindow;
        this._onMessage = this._onMessage.bind(this);
        window.addEventListener('message', this._onMessage, false);
        this._handshake();
    }
    _postMessage(data) {
        this._targetWindow.postMessage({
            target: this._target,
            data,
        }, this._targetOrigin);
    }
    _onMessage(event) {
        const message = event.data;
        if ((this._targetOrigin !== '*' && event.origin !== this._targetOrigin) ||
            event.source !== this._targetWindow ||
            !(0, utils_1.isValidStreamMessage)(message) ||
            message.target !== this._name) {
            return;
        }
        this._onData(message.data);
    }
    _destroy() {
        window.removeEventListener('message', this._onMessage, false);
    }
}
exports.WindowPostMessageStream = WindowPostMessageStream;
//# sourceMappingURL=WindowPostMessageStream.js.map