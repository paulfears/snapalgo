import SafeEventEmitter from '@metamask/safe-event-emitter';
import { JsonRpcEngine, JsonRpcId, JsonRpcVersion, JsonRpcMiddleware } from 'json-rpc-engine';
import { ConsoleLike, Maybe } from './utils';
export interface UnvalidatedJsonRpcRequest {
    id?: JsonRpcId;
    jsonrpc?: JsonRpcVersion;
    method: string;
    params?: unknown;
}
export interface BaseProviderOptions {
    /**
     * The logging API to use.
     */
    logger?: ConsoleLike;
    /**
     * The maximum number of event listeners.
     */
    maxEventListeners?: number;
    /**
     * `json-rpc-engine` middleware. The middleware will be inserted in the given
     * order immediately after engine initialization.
     */
    rpcMiddleware?: JsonRpcMiddleware<unknown, unknown>[];
}
export interface RequestArguments {
    /** The RPC method to request. */
    method: string;
    /** The params of the RPC method, if any. */
    params?: unknown[] | Record<string, unknown>;
}
export interface BaseProviderState {
    accounts: null | string[];
    isConnected: boolean;
    isUnlocked: boolean;
    initialized: boolean;
    isPermanentlyDisconnected: boolean;
}
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
export declare abstract class BaseProvider extends SafeEventEmitter {
    protected readonly _log: ConsoleLike;
    protected _state: BaseProviderState;
    protected _rpcEngine: JsonRpcEngine;
    protected static _defaultState: BaseProviderState;
    /**
     * The chain ID of the currently connected Ethereum chain.
     * See [chainId.network]{@link https://chainid.network} for more information.
     */
    chainId: string | null;
    /**
     * The user's currently selected Ethereum address.
     * If null, MetaMask is either locked or the user has not permitted any
     * addresses to be viewed.
     */
    selectedAddress: string | null;
    /**
     * @param options - An options bag
     * @param options.logger - The logging API to use. Default: console
     * @param options.maxEventListeners - The maximum number of event
     * listeners. Default: 100
     */
    constructor({ logger, maxEventListeners, rpcMiddleware, }?: BaseProviderOptions);
    /**
     * Returns whether the provider can process RPC requests.
     */
    isConnected(): boolean;
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
    request<T>(args: RequestArguments): Promise<Maybe<T>>;
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
    protected _initializeState(initialState?: {
        accounts: string[];
        chainId: string;
        isUnlocked: boolean;
        networkVersion?: string;
    }): void;
    /**
     * Internal RPC method. Forwards requests to background via the RPC engine.
     * Also remap ids inbound and outbound.
     *
     * @param payload - The RPC request object.
     * @param callback - The consumer's callback.
     */
    protected _rpcRequest(payload: UnvalidatedJsonRpcRequest | UnvalidatedJsonRpcRequest[], callback: (...args: any[]) => void): void;
    /**
     * When the provider becomes connected, updates internal state and emits
     * required events. Idempotent.
     *
     * @param chainId - The ID of the newly connected chain.
     * @emits MetaMaskInpageProvider#connect
     */
    protected _handleConnect(chainId: string): void;
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
    protected _handleDisconnect(isRecoverable: boolean, errorMessage?: string): void;
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
    protected _handleChainChanged({ chainId, }?: {
        chainId?: string;
        networkVersion?: string;
    }): void;
    /**
     * Called when accounts may have changed. Diffs the new accounts value with
     * the current one, updates all state as necessary, and emits the
     * accountsChanged event.
     *
     * @param accounts - The new accounts value.
     * @param isEthAccounts - Whether the accounts value was returned by
     * a call to eth_accounts.
     */
    protected _handleAccountsChanged(accounts: unknown[], isEthAccounts?: boolean): void;
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
    protected _handleUnlockStateChanged({ accounts, isUnlocked, }?: {
        accounts?: string[];
        isUnlocked?: boolean;
    }): void;
}
