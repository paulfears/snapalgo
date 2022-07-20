"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePostMessageStream = void 0;
const readable_stream_1 = require("readable-stream");
const noop = () => undefined;
const SYN = 'SYN';
const ACK = 'ACK';
/**
 * Abstract base class for postMessage streams.
 */
class BasePostMessageStream extends readable_stream_1.Duplex {
    constructor() {
        super({
            objectMode: true,
        });
        // Initialization flags
        this._init = false;
        this._haveSyn = false;
    }
    /**
     * Must be called at end of child constructor to initiate
     * communication with other end.
     */
    _handshake() {
        // Send synchronization message
        this._write(SYN, null, noop);
        this.cork();
    }
    _onData(data) {
        if (this._init) {
            // Forward message
            try {
                this.push(data);
            }
            catch (err) {
                this.emit('error', err);
            }
        }
        else if (data === SYN) {
            // Listen for handshake
            this._haveSyn = true;
            this._write(ACK, null, noop);
        }
        else if (data === ACK) {
            this._init = true;
            if (!this._haveSyn) {
                this._write(ACK, null, noop);
            }
            this.uncork();
        }
    }
    _read() {
        return undefined;
    }
    _write(data, _encoding, cb) {
        this._postMessage(data);
        cb();
    }
}
exports.BasePostMessageStream = BasePostMessageStream;
//# sourceMappingURL=BasePostMessageStream.js.map