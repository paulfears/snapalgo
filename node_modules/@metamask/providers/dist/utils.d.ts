/// <reference types="node" />
import { EventEmitter } from 'events';
import { JsonRpcMiddleware, PendingJsonRpcResponse } from 'json-rpc-engine';
export declare type Maybe<T> = Partial<T> | null | undefined;
export declare type ConsoleLike = Pick<Console, 'log' | 'warn' | 'error' | 'debug' | 'info' | 'trace'>;
/**
 * json-rpc-engine middleware that logs RPC errors and and validates req.method.
 *
 * @param log - The logging API to use.
 * @returns  json-rpc-engine middleware function
 */
export declare function createErrorMiddleware(log: ConsoleLike): JsonRpcMiddleware<unknown, unknown>;
export declare const getRpcPromiseCallback: (resolve: (value?: any) => void, reject: (error?: Error | undefined) => void, unwrapResult?: boolean) => (error: Error, response: PendingJsonRpcResponse<unknown>) => void;
/**
 * Logs a stream disconnection error. Emits an 'error' if given an
 * EventEmitter that has listeners for the 'error' event.
 *
 * @param log - The logging API to use.
 * @param remoteLabel - The label of the disconnected stream.
 * @param error - The associated error to log.
 * @param emitter - The logging API to use.
 */
export declare function logStreamDisconnectWarning(log: ConsoleLike, remoteLabel: string, error: Error, emitter: EventEmitter): void;
export declare const NOOP: () => undefined;
export declare const EMITTED_NOTIFICATIONS: string[];
