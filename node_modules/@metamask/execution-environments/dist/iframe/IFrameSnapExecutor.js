"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFrameSnapExecutor = void 0;
const object_multiplex_1 = __importDefault(require("@metamask/object-multiplex"));
const post_message_stream_1 = require("@metamask/post-message-stream");
const pump_1 = __importDefault(require("pump"));
const BaseSnapExecutor_1 = require("../common/BaseSnapExecutor");
const enums_1 = require("../common/enums");
class IFrameSnapExecutor extends BaseSnapExecutor_1.BaseSnapExecutor {
    /**
     * Initialize the IFrameSnapExecutor. This creates a post message stream from
     * and to the parent window, for two-way communication with the iframe.
     *
     * @returns An instance of `IFrameSnapExecutor`, with the initialized post
     * message streams.
     */
    static initialize() {
        console.log('Worker: Connecting to parent.');
        const parentStream = new post_message_stream_1.WindowPostMessageStream({
            name: 'child',
            target: 'parent',
            targetWindow: self.parent,
            targetOrigin: '*',
        });
        const mux = new object_multiplex_1.default();
        (0, pump_1.default)(parentStream, mux, parentStream, (err) => {
            if (err) {
                console.error(`Parent stream failure, closing worker.`, err);
            }
            self.close();
        });
        const commandStream = mux.createStream(enums_1.SNAP_STREAM_NAMES.COMMAND);
        const rpcStream = mux.createStream(enums_1.SNAP_STREAM_NAMES.JSON_RPC);
        return new IFrameSnapExecutor(commandStream, rpcStream);
    }
}
exports.IFrameSnapExecutor = IFrameSnapExecutor;
//# sourceMappingURL=IFrameSnapExecutor.js.map