"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadSnapExecutor = void 0;
const object_multiplex_1 = __importDefault(require("@metamask/object-multiplex"));
const pump_1 = __importDefault(require("pump"));
const post_message_stream_1 = require("@metamask/post-message-stream");
const BaseSnapExecutor_1 = require("../common/BaseSnapExecutor");
const enums_1 = require("../common/enums");
class ThreadSnapExecutor extends BaseSnapExecutor_1.BaseSnapExecutor {
    static initialize() {
        console.log('Worker: Connecting to parent.');
        const parentStream = new post_message_stream_1.ThreadMessageStream();
        const mux = new object_multiplex_1.default();
        (0, pump_1.default)(parentStream, mux, parentStream, (err) => {
            if (err) {
                console.error(`Parent stream failure, closing worker.`, err);
            }
            self.close();
        });
        const commandStream = mux.createStream(enums_1.SNAP_STREAM_NAMES.COMMAND);
        const rpcStream = mux.createStream(enums_1.SNAP_STREAM_NAMES.JSON_RPC);
        return new ThreadSnapExecutor(commandStream, rpcStream);
    }
}
exports.ThreadSnapExecutor = ThreadSnapExecutor;
//# sourceMappingURL=ThreadSnapExecutor.js.map