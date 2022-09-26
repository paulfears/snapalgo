"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readable_stream_1 = require("readable-stream");
/**
 * Takes a JsonRpcEngine and returns a Duplex stream wrapping it.
 *
 * @param opts - Options bag.
 * @param opts.engine - The JsonRpcEngine to wrap in a stream.
 * @returns The stream wrapping the engine.
 */
function createEngineStream(opts) {
    if (!opts || !opts.engine) {
        throw new Error('Missing engine parameter!');
    }
    const { engine } = opts;
    const stream = new readable_stream_1.Duplex({ objectMode: true, read, write });
    // forward notifications
    if (engine.on) {
        engine.on('notification', (message) => {
            stream.push(message);
        });
    }
    return stream;
    function read() {
        return undefined;
    }
    function write(req, _encoding, cb) {
        engine.handle(req, (_err, res) => {
            stream.push(res);
        });
        cb();
    }
}
exports.default = createEngineStream;
//# sourceMappingURL=createEngineStream.js.map