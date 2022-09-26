/// <reference types="node" />
import type { Duplex } from 'stream';
import SafeEventEmitter from '@metamask/safe-event-emitter';
import type { JsonRpcMiddleware } from 'json-rpc-engine';
import { BaseProvider, BaseProviderOptions } from './BaseProvider';
export interface StreamProviderOptions extends BaseProviderOptions {
    /**
     * The name of the stream used to connect to the wallet.
     */
    jsonRpcStreamName: string;
}
export interface JsonRpcConnection {
    events: SafeEventEmitter;
    middleware: JsonRpcMiddleware<unknown, unknown>;
    stream: Duplex;
}
/**
 * An abstract EIP-1193 provider wired to some duplex stream via a
 * `json-rpc-middleware-stream` JSON-RPC stream middleware. Implementers must
 * call {@link AbstractStreamProvider._initializeStateAsync} after instantiation
 * to initialize the provider's state.
 */
export declare abstract class AbstractStreamProvider extends BaseProvider {
    protected _jsonRpcConnection: JsonRpcConnection;
    /**
     * @param connectionStream - A Node.js duplex stream
     * @param options - An options bag
     * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
     * @param options.logger - The logging API to use. Default: console
     * @param options.maxEventListeners - The maximum number of event
     * listeners. Default: 100
     */
    constructor(connectionStream: Duplex, { jsonRpcStreamName, logger, maxEventListeners, rpcMiddleware, }: StreamProviderOptions);
    /**
     * **MUST** be called by child classes.
     *
     * Calls `metamask_getProviderState` and passes the result to
     * {@link BaseProvider._initializeState}. Logs an error if getting initial state
     * fails. Throws if called after initialization has completed.
     */
    protected _initializeStateAsync(): Promise<void>;
    /**
     * Called when connection is lost to critical streams. Emits an 'error' event
     * from the provider with the error message and stack if present.
     *
     * @emits BaseProvider#disconnect
     */
    private _handleStreamDisconnect;
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
    protected _handleChainChanged({ chainId, networkVersion, }?: {
        chainId?: string;
        networkVersion?: string;
    }): void;
}
/**
 * An EIP-1193 provider wired to some duplex stream via a
 * `json-rpc-middleware-stream` JSON-RPC stream middleware. Consumers must
 * call {@link StreamProvider.initialize} after instantiation to complete
 * initialization.
 */
export declare class StreamProvider extends AbstractStreamProvider {
    /**
     * **MUST** be called after instantiation to complete initialization.
     *
     * Calls `metamask_getProviderState` and passes the result to
     * {@link BaseProvider._initializeState}. Logs an error if getting initial state
     * fails. Throws if called after initialization has completed.
     */
    initialize(): Promise<void>;
}
