"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamProvider = exports.AbstractStreamProvider = void 0;
const object_multiplex_1 = __importDefault(require("@metamask/object-multiplex"));
const is_stream_1 = require("is-stream");
const json_rpc_middleware_stream_1 = require("json-rpc-middleware-stream");
const pump_1 = __importDefault(require("pump"));
const messages_1 = __importDefault(require("./messages"));
const utils_1 = require("./utils");
const BaseProvider_1 = require("./BaseProvider");
/**
 * An abstract EIP-1193 provider wired to some duplex stream via a
 * `json-rpc-middleware-stream` JSON-RPC stream middleware. Implementers must
 * call {@link AbstractStreamProvider._initializeStateAsync} after instantiation
 * to initialize the provider's state.
 */
class AbstractStreamProvider extends BaseProvider_1.BaseProvider {
    /**
     * @param connectionStream - A Node.js duplex stream
     * @param options - An options bag
     * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
     * @param options.logger - The logging API to use. Default: console
     * @param options.maxEventListeners - The maximum number of event
     * listeners. Default: 100
     */
    constructor(connectionStream, { jsonRpcStreamName, logger, maxEventListeners, rpcMiddleware, }) {
        super({ logger, maxEventListeners, rpcMiddleware });
        if (!is_stream_1.duplex(connectionStream)) {
            throw new Error(messages_1.default.errors.invalidDuplexStream());
        }
        // Bind functions to prevent consumers from making unbound calls
        this._handleStreamDisconnect = this._handleStreamDisconnect.bind(this);
        // Set up connectionStream multiplexing
        const mux = new object_multiplex_1.default();
        pump_1.default(connectionStream, mux, connectionStream, this._handleStreamDisconnect.bind(this, 'MetaMask'));
        // Set up RPC connection
        this._jsonRpcConnection = json_rpc_middleware_stream_1.createStreamMiddleware();
        pump_1.default(this._jsonRpcConnection.stream, mux.createStream(jsonRpcStreamName), this._jsonRpcConnection.stream, this._handleStreamDisconnect.bind(this, 'MetaMask RpcProvider'));
        // Wire up the JsonRpcEngine to the JSON-RPC connection stream
        this._rpcEngine.push(this._jsonRpcConnection.middleware);
        // Handle JSON-RPC notifications
        this._jsonRpcConnection.events.on('notification', (payload) => {
            const { method, params } = payload;
            if (method === 'metamask_accountsChanged') {
                this._handleAccountsChanged(params);
            }
            else if (method === 'metamask_unlockStateChanged') {
                this._handleUnlockStateChanged(params);
            }
            else if (method === 'metamask_chainChanged') {
                this._handleChainChanged(params);
            }
            else if (utils_1.EMITTED_NOTIFICATIONS.includes(method)) {
                this.emit('message', {
                    type: method,
                    data: params,
                });
            }
            else if (method === 'METAMASK_STREAM_FAILURE') {
                connectionStream.destroy(new Error(messages_1.default.errors.permanentlyDisconnected()));
            }
        });
    }
    //====================
    // Private Methods
    //====================
    /**
     * **MUST** be called by child classes.
     *
     * Calls `metamask_getProviderState` and passes the result to
     * {@link BaseProvider._initializeState}. Logs an error if getting initial state
     * fails. Throws if called after initialization has completed.
     */
    async _initializeStateAsync() {
        let initialState;
        try {
            initialState = (await this.request({
                method: 'metamask_getProviderState',
            }));
        }
        catch (error) {
            this._log.error('MetaMask: Failed to get initial state. Please report this bug.', error);
        }
        this._initializeState(initialState);
    }
    /**
     * Called when connection is lost to critical streams. Emits an 'error' event
     * from the provider with the error message and stack if present.
     *
     * @emits BaseProvider#disconnect
     */
    _handleStreamDisconnect(streamName, error) {
        let warningMsg = `MetaMask: Lost connection to "${streamName}".`;
        if (error === null || error === void 0 ? void 0 : error.stack) {
            warningMsg += `\n${error.stack}`;
        }
        this._log.warn(warningMsg);
        if (this.listenerCount('error') > 0) {
            this.emit('error', warningMsg);
        }
        this._handleDisconnect(false, error ? error.message : undefined);
    }
    /**
     * Upon receipt of a new chainId and networkVersion, emits corresponding
     * events and sets relevant public state. This class does not have a
     * `networkVersion` property, but we rely on receiving a `networkVersion`
     * with the value of `loading` to detect when the network is changing and
     * a recoverable `disconnect` even has occurred. Child classes that use the
     * `networkVersion` for other purposes must implement additional handling
     * therefore.
     *
     * @emits BaseProvider#chainChanged
     * @param networkInfo - An object with network info.
     * @param networkInfo.chainId - The latest chain ID.
     * @param networkInfo.networkVersion - The latest network ID.
     */
    _handleChainChanged({ chainId, networkVersion, } = {}) {
        if (!utils_1.isValidChainId(chainId) || !utils_1.isValidNetworkVersion(networkVersion)) {
            this._log.error(messages_1.default.errors.invalidNetworkParams(), {
                chainId,
                networkVersion,
            });
            return;
        }
        if (networkVersion === 'loading') {
            this._handleDisconnect(true);
        }
        else {
            super._handleChainChanged({ chainId });
        }
    }
}
exports.AbstractStreamProvider = AbstractStreamProvider;
/**
 * An EIP-1193 provider wired to some duplex stream via a
 * `json-rpc-middleware-stream` JSON-RPC stream middleware. Consumers must
 * call {@link StreamProvider.initialize} after instantiation to complete
 * initialization.
 */
class StreamProvider extends AbstractStreamProvider {
    /**
     * **MUST** be called after instantiation to complete initialization.
     *
     * Calls `metamask_getProviderState` and passes the result to
     * {@link BaseProvider._initializeState}. Logs an error if getting initial state
     * fails. Throws if called after initialization has completed.
     */
    async initialize() {
        return this._initializeStateAsync();
    }
}
exports.StreamProvider = StreamProvider;
//# sourceMappingURL=StreamProvider.js.map