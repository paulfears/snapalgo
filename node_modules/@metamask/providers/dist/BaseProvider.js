"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = void 0;
const safe_event_emitter_1 = __importDefault(require("@metamask/safe-event-emitter"));
const eth_rpc_errors_1 = require("eth-rpc-errors");
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const json_rpc_engine_1 = require("json-rpc-engine");
const messages_1 = __importDefault(require("./messages"));
const utils_1 = require("./utils");
/**
 * An abstract class implementing the EIP-1193 interface. Implementers must:
 *
 * 1. At initialization, push a middleware to the internal `_rpcEngine` that
 *    hands off requests to the server and receives responses in return.
 * 2. At initialization, retrieve initial state and call
 *    {@link BaseProvider._initializeState} **once**.
 * 3. Ensure that the provider's state is synchronized with the wallet.
 * 4. Ensure that notifications are received and emitted as appropriate.
 */
class BaseProvider extends safe_event_emitter_1.default {
    /**
     * @param options - An options bag
     * @param options.logger - The logging API to use. Default: console
     * @param options.maxEventListeners - The maximum number of event
     * listeners. Default: 100
     */
    constructor({ logger = console, maxEventListeners = 100, rpcMiddleware = [], } = {}) {
        super();
        this._log = logger;
        this.setMaxListeners(maxEventListeners);
        // Private state
        this._state = Object.assign({}, BaseProvider._defaultState);
        // Public state
        this.selectedAddress = null;
        this.chainId = null;
        // Bind functions to prevent consumers from making unbound calls
        this._handleAccountsChanged = this._handleAccountsChanged.bind(this);
        this._handleConnect = this._handleConnect.bind(this);
        this._handleChainChanged = this._handleChainChanged.bind(this);
        this._handleDisconnect = this._handleDisconnect.bind(this);
        this._handleUnlockStateChanged = this._handleUnlockStateChanged.bind(this);
        this._rpcRequest = this._rpcRequest.bind(this);
        this.request = this.request.bind(this);
        // Handle RPC requests via dapp-side RPC engine.
        //
        // ATTN: Implementers must push a middleware that hands off requests to
        // the server.
        const rpcEngine = new json_rpc_engine_1.JsonRpcEngine();
        rpcMiddleware.forEach((middleware) => rpcEngine.push(middleware));
        this._rpcEngine = rpcEngine;
    }
    //====================
    // Public Methods
    //====================
    /**
     * Returns whether the provider can process RPC requests.
     */
    isConnected() {
        return this._state.isConnected;
    }
    /**
     * Submits an RPC request for the given method, with the given params.
     * Resolves with the result of the method call, or rejects on error.
     *
     * @param args - The RPC request arguments.
     * @param args.method - The RPC method name.
     * @param args.params - The parameters for the RPC method.
     * @returns A Promise that resolves with the result of the RPC method,
     * or rejects if an error is encountered.
     */
    async request(args) {
        if (!args || typeof args !== 'object' || Array.isArray(args)) {
            throw eth_rpc_errors_1.ethErrors.rpc.invalidRequest({
                message: messages_1.default.errors.invalidRequestArgs(),
                data: args,
            });
        }
        const { method, params } = args;
        if (typeof method !== 'string' || method.length === 0) {
            throw eth_rpc_errors_1.ethErrors.rpc.invalidRequest({
                message: messages_1.default.errors.invalidRequestMethod(),
                data: args,
            });
        }
        if (params !== undefined &&
            !Array.isArray(params) &&
            (typeof params !== 'object' || params === null)) {
            throw eth_rpc_errors_1.ethErrors.rpc.invalidRequest({
                message: messages_1.default.errors.invalidRequestParams(),
                data: args,
            });
        }
        return new Promise((resolve, reject) => {
            this._rpcRequest({ method, params }, utils_1.getRpcPromiseCallback(resolve, reject));
        });
    }
    //====================
    // Private Methods
    //====================
    /**
     * **MUST** be called by child classes.
     *
     * Sets initial state if provided and marks this provider as initialized.
     * Throws if called more than once.
     *
     * Permits the `networkVersion` field in the parameter object for
     * compatibility with child classes that use this value.
     *
     * @param initialState - The provider's initial state.
     * @emits BaseProvider#_initialized
     * @emits BaseProvider#connect - If `initialState` is defined.
     */
    _initializeState(initialState) {
        if (this._state.initialized === true) {
            throw new Error('Provider already initialized.');
        }
        if (initialState) {
            const { accounts, chainId, isUnlocked, networkVersion } = initialState;
            // EIP-1193 connect
            this._handleConnect(chainId);
            this._handleChainChanged({ chainId, networkVersion });
            this._handleUnlockStateChanged({ accounts, isUnlocked });
            this._handleAccountsChanged(accounts);
        }
        // Mark provider as initialized regardless of whether initial state was
        // retrieved.
        this._state.initialized = true;
        this.emit('_initialized');
    }
    /**
     * Internal RPC method. Forwards requests to background via the RPC engine.
     * Also remap ids inbound and outbound.
     *
     * @param payload - The RPC request object.
     * @param callback - The consumer's callback.
     */
    _rpcRequest(payload, callback) {
        let cb = callback;
        if (!Array.isArray(payload)) {
            if (!payload.jsonrpc) {
                payload.jsonrpc = '2.0';
            }
            if (payload.method === 'eth_accounts' ||
                payload.method === 'eth_requestAccounts') {
                // handle accounts changing
                cb = (err, res) => {
                    this._handleAccountsChanged(res.result || [], payload.method === 'eth_accounts');
                    callback(err, res);
                };
            }
            return this._rpcEngine.handle(payload, cb);
        }
        return this._rpcEngine.handle(payload, cb);
    }
    /**
     * When the provider becomes connected, updates internal state and emits
     * required events. Idempotent.
     *
     * @param chainId - The ID of the newly connected chain.
     * @emits MetaMaskInpageProvider#connect
     */
    _handleConnect(chainId) {
        if (!this._state.isConnected) {
            this._state.isConnected = true;
            this.emit('connect', { chainId });
            this._log.debug(messages_1.default.info.connected(chainId));
        }
    }
    /**
     * When the provider becomes disconnected, updates internal state and emits
     * required events. Idempotent with respect to the isRecoverable parameter.
     *
     * Error codes per the CloseEvent status codes as required by EIP-1193:
     * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
     *
     * @param isRecoverable - Whether the disconnection is recoverable.
     * @param errorMessage - A custom error message.
     * @emits BaseProvider#disconnect
     */
    _handleDisconnect(isRecoverable, errorMessage) {
        if (this._state.isConnected ||
            (!this._state.isPermanentlyDisconnected && !isRecoverable)) {
            this._state.isConnected = false;
            let error;
            if (isRecoverable) {
                error = new eth_rpc_errors_1.EthereumRpcError(1013, // Try again later
                errorMessage || messages_1.default.errors.disconnected());
                this._log.debug(error);
            }
            else {
                error = new eth_rpc_errors_1.EthereumRpcError(1011, // Internal error
                errorMessage || messages_1.default.errors.permanentlyDisconnected());
                this._log.error(error);
                this.chainId = null;
                this._state.accounts = null;
                this.selectedAddress = null;
                this._state.isUnlocked = false;
                this._state.isPermanentlyDisconnected = true;
            }
            this.emit('disconnect', error);
        }
    }
    /**
     * Upon receipt of a new `chainId`, emits the corresponding event and sets
     * and sets relevant public state. Does nothing if the given `chainId` is
     * equivalent to the existing value.
     *
     * Permits the `networkVersion` field in the parameter object for
     * compatibility with child classes that use this value.
     *
     * @emits BaseProvider#chainChanged
     * @param networkInfo - An object with network info.
     * @param networkInfo.chainId - The latest chain ID.
     */
    _handleChainChanged({ chainId, } = {}) {
        if (!utils_1.isValidChainId(chainId)) {
            this._log.error(messages_1.default.errors.invalidNetworkParams(), { chainId });
            return;
        }
        this._handleConnect(chainId);
        if (chainId !== this.chainId) {
            this.chainId = chainId;
            if (this._state.initialized) {
                this.emit('chainChanged', this.chainId);
            }
        }
    }
    /**
     * Called when accounts may have changed. Diffs the new accounts value with
     * the current one, updates all state as necessary, and emits the
     * accountsChanged event.
     *
     * @param accounts - The new accounts value.
     * @param isEthAccounts - Whether the accounts value was returned by
     * a call to eth_accounts.
     */
    _handleAccountsChanged(accounts, isEthAccounts = false) {
        let _accounts = accounts;
        if (!Array.isArray(accounts)) {
            this._log.error('MetaMask: Received invalid accounts parameter. Please report this bug.', accounts);
            _accounts = [];
        }
        for (const account of accounts) {
            if (typeof account !== 'string') {
                this._log.error('MetaMask: Received non-string account. Please report this bug.', accounts);
                _accounts = [];
                break;
            }
        }
        // emit accountsChanged if anything about the accounts array has changed
        if (!fast_deep_equal_1.default(this._state.accounts, _accounts)) {
            // we should always have the correct accounts even before eth_accounts
            // returns
            if (isEthAccounts && this._state.accounts !== null) {
                this._log.error(`MetaMask: 'eth_accounts' unexpectedly updated accounts. Please report this bug.`, _accounts);
            }
            this._state.accounts = _accounts;
            // handle selectedAddress
            if (this.selectedAddress !== _accounts[0]) {
                this.selectedAddress = _accounts[0] || null;
            }
            // finally, after all state has been updated, emit the event
            if (this._state.initialized) {
                this.emit('accountsChanged', _accounts);
            }
        }
    }
    /**
     * Upon receipt of a new isUnlocked state, sets relevant public state.
     * Calls the accounts changed handler with the received accounts, or an empty
     * array.
     *
     * Does nothing if the received value is equal to the existing value.
     * There are no lock/unlock events.
     *
     * @param opts - Options bag.
     * @param opts.accounts - The exposed accounts, if any.
     * @param opts.isUnlocked - The latest isUnlocked value.
     */
    _handleUnlockStateChanged({ accounts, isUnlocked, } = {}) {
        if (typeof isUnlocked !== 'boolean') {
            this._log.error('MetaMask: Received invalid isUnlocked parameter. Please report this bug.');
            return;
        }
        if (isUnlocked !== this._state.isUnlocked) {
            this._state.isUnlocked = isUnlocked;
            this._handleAccountsChanged(accounts || []);
        }
    }
}
exports.BaseProvider = BaseProvider;
BaseProvider._defaultState = {
    accounts: null,
    isConnected: false,
    isUnlocked: false,
    initialized: false,
    isPermanentlyDisconnected: false,
};
//# sourceMappingURL=BaseProvider.js.map