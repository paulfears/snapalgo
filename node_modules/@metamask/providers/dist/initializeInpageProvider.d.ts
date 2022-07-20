/// <reference types="node" />
import { Duplex } from 'stream';
import { MetaMaskInpageProvider, MetaMaskInpageProviderOptions } from './MetaMaskInpageProvider';
interface InitializeProviderOptions extends MetaMaskInpageProviderOptions {
    /**
     * The stream used to connect to the wallet.
     */
    connectionStream: Duplex;
    /**
     * Whether the provider should be set as window.ethereum.
     */
    shouldSetOnWindow?: boolean;
    /**
     * Whether the window.web3 shim should be set.
     */
    shouldShimWeb3?: boolean;
}
/**
 * Initializes a MetaMaskInpageProvider and (optionally) assigns it as window.ethereum.
 *
 * @param options - An options bag.
 * @param options.connectionStream - A Node.js stream.
 * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
 * @param options.maxEventListeners - The maximum number of event listeners.
 * @param options.shouldSendMetadata - Whether the provider should send page metadata.
 * @param options.shouldSetOnWindow - Whether the provider should be set as window.ethereum.
 * @param options.shouldShimWeb3 - Whether a window.web3 shim should be injected.
 * @returns The initialized provider (whether set or not).
 */
export declare function initializeProvider({ connectionStream, jsonRpcStreamName, logger, maxEventListeners, shouldSendMetadata, shouldSetOnWindow, shouldShimWeb3, }: InitializeProviderOptions): MetaMaskInpageProvider;
/**
 * Sets the given provider instance as window.ethereum and dispatches the
 * 'ethereum#initialized' event on window.
 *
 * @param providerInstance - The provider instance.
 */
export declare function setGlobalProvider(providerInstance: MetaMaskInpageProvider): void;
export {};
