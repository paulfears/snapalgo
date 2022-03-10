/// <reference types="node" />
import { Duplex } from 'stream';
import { JsonRpcEngine, JsonRpcId, JsonRpcVersion, JsonRpcMiddleware } from 'json-rpc-engine';
import SafeEventEmitter from '@metamask/safe-event-emitter';
import { ConsoleLike, Maybe } from './utils';
export interface UnvalidatedJsonRpcRequest {
    id?: JsonRpcId;
    jsonrpc?: JsonRpcVersion;
    method: string;
    params?: unknown;
}
export interface BaseProviderOptions {
    /**
     * The name of the stream used to connect to the wallet.
     */
    jsonRpcStreamName?: string;
    /**
     * The logging API to use.
     */
    logger?: ConsoleLike;
    /**
     * The maximum number of event listeners.
     */
    maxEventListeners?: number;
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
export interface JsonRpcConnection {
    events: SafeEventEmitter;
    middleware: JsonRpcMiddleware<unknown, unknown>;
    stream: Duplex;
}
export default class BaseProvider extends SafeEventEmitter {
    protected readonly _log: ConsoleLike;
    protected _state: BaseProviderState;
    protected _rpcEngine: JsonRpcEngine;
    protected _jsonRpcConnection: JsonRpcConnection;
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
     * @param connectionStream - A Node.js duplex stream
     * @param options - An options bag
     * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
     * Default: metamask-provider
     * @param options.logger - The logging API to use. Default: console
     * @param options.maxEventListeners - The maximum number of event
     * listeners. Default: 100
     */
    constructor(connectionStream: Duplex, { jsonRpcStreamName, logger, maxEventListeners, }?: BaseProviderOptions);
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
     * Constructor helper.
     * Populates initial state by calling 'metamask_getProviderState' and emits
     * necessary events.
     */
    private _initializeState;
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
     * @emits MetaMaskInpageProvider#disconnect
     */
    protected _handleDisconnect(isRecoverable: boolean, errorMessage?: string): void;
    /**
     * Called when connection is lost to critical streams.
     *
     * @emits MetamaskInpageProvider#disconnect
     */
    protected _handleStreamDisconnect(streamName: string, error: Error): void;
    /**
     * Upon receipt of a new chainId and networkVersion, emits corresponding
     * events and sets relevant public state.
     * Does nothing if neither the chainId nor the networkVersion are different
     * from existing values.
     *
     * @emits MetamaskInpageProvider#chainChanged
     * @param networkInfo - An object with network info.
     * @param networkInfo.chainId - The latest chain ID.
     * @param networkInfo.networkVersion - The latest network ID.
     */
    protected _handleChainChanged({ chainId, networkVersion, }?: {
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
