import { JsonRpcMiddleware, PendingJsonRpcResponse } from 'json-rpc-engine';
export declare type Maybe<T> = Partial<T> | null | undefined;
export declare type ConsoleLike = Pick<Console, 'log' | 'warn' | 'error' | 'debug' | 'info' | 'trace'>;
export declare const EMITTED_NOTIFICATIONS: readonly string[];
/**
 * Gets the default middleware for external providers, consisting of an ID
 * remapping middleware and an error middleware.
 *
 * @param logger - The logger to use in the error middleware.
 * @returns An array of json-rpc-engine middleware functions.
 */
export declare const getDefaultExternalMiddleware: (logger?: ConsoleLike) => JsonRpcMiddleware<unknown, unknown>[];
export declare const getRpcPromiseCallback: (resolve: (value?: any) => void, reject: (error?: Error | undefined) => void, unwrapResult?: boolean) => (error: Error, response: PendingJsonRpcResponse<unknown>) => void;
/**
 * Checks whether the given chain ID is valid, meaning if it is non-empty,
 * '0x'-prefixed string.
 *
 * @param chainId - The chain ID to validate.
 * @returns Whether the given chain ID is valid.
 */
export declare const isValidChainId: (chainId: unknown) => chainId is string;
/**
 * Checks whether the given network version is valid, meaning if it is non-empty
 * string.
 *
 * @param networkVersion - The network version to validate.
 * @returns Whether the given network version is valid.
 */
export declare const isValidNetworkVersion: (networkVersion: unknown) => networkVersion is string;
export declare const NOOP: () => undefined;
