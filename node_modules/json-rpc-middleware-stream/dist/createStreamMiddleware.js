"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const safe_event_emitter_1 = __importDefault(require("@metamask/safe-event-emitter"));
const readable_stream_1 = require("readable-stream");
/**
 * Creates a JsonRpcEngine middleware with an associated Duplex stream and
 * EventEmitter. The middleware, and by extension stream, assume that middleware
 * parameters are properly formatted. No runtime type checking or validation is
 * performed.
 *
 * @returns The event emitter, middleware, and stream.
 */
function createStreamMiddleware() {
    const idMap = {};
    const stream = new readable_stream_1.Duplex({
        objectMode: true,
        read: readNoop,
        write: processMessage,
    });
    const events = new safe_event_emitter_1.default();
    const middleware = (req, res, next, end) => {
        // write req to stream
        stream.push(req);
        // register request on id map
        idMap[req.id] = { req, res, next, end };
    };
    return { events, middleware, stream };
    function readNoop() {
        return false;
    }
    function processMessage(res, _encoding, cb) {
        let err;
        try {
            const isNotification = !res.id;
            if (isNotification) {
                processNotification(res);
            }
            else {
                processResponse(res);
            }
        }
        catch (_err) {
            err = _err;
        }
        // continue processing stream
        cb(err);
    }
    function processResponse(res) {
        const context = idMap[res.id];
        if (!context) {
            throw new Error(`StreamMiddleware - Unknown response id "${res.id}"`);
        }
        delete idMap[res.id];
        // copy whole res onto original res
        Object.assign(context.res, res);
        // run callback on empty stack,
        // prevent internal stream-handler from catching errors
        setTimeout(context.end);
    }
    function processNotification(res) {
        events.emit('notification', res);
    }
}
exports.default = createStreamMiddleware;
//# sourceMappingURL=createStreamMiddleware.js.map