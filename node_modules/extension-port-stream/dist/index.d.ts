/// <reference types="node" />
import { Duplex } from 'stream';
import { Runtime } from 'webextension-polyfill-ts';
declare const _default: {
    new (port: Runtime.Port): {
        _port: Runtime.Port;
        /**
         * Callback triggered when a message is received from
         * the remote Port associated with this Stream.
         *
         * @param msg - Payload from the onMessage listener of the port
         */
        _onMessage(msg: unknown): void;
        /**
         * Callback triggered when the remote Port associated with this Stream
         * disconnects.
         */
        _onDisconnect(): void;
        /**
         * Explicitly sets read operations to a no-op.
         */
        _read(): void;
        /**
         * Called internally when data should be written to this writable stream.
         *
         * @param msg - Arbitrary object to write
         * @param encoding - Encoding to use when writing payload
         * @param cb - Called when writing is complete or an error occurs
         */
        _write(msg: unknown, _encoding: BufferEncoding, cb: (error?: Error | null | undefined) => void): void;
        readonly writable: boolean;
        readonly writableEnded: boolean;
        readonly writableFinished: boolean;
        readonly writableHighWaterMark: number;
        readonly writableLength: number;
        readonly writableObjectMode: boolean;
        readonly writableCorked: number;
        _writev?(chunks: {
            chunk: any;
            encoding: BufferEncoding;
        }[], callback: (error?: Error | null | undefined) => void): void;
        _destroy(error: Error | null, callback: (error: Error | null) => void): void;
        _final(callback: (error?: Error | null | undefined) => void): void;
        write(chunk: any, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined, cb?: ((error: Error | null | undefined) => void) | undefined): boolean;
        write(chunk: any, cb?: ((error: Error | null | undefined) => void) | undefined): boolean;
        setDefaultEncoding(encoding: BufferEncoding): any;
        end(cb?: (() => void) | undefined): void;
        end(chunk: any, cb?: (() => void) | undefined): void;
        end(chunk: any, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined, cb?: (() => void) | undefined): void;
        cork(): void;
        uncork(): void;
        readable: boolean;
        readonly readableEncoding: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | null;
        readonly readableEnded: boolean;
        readonly readableFlowing: boolean | null;
        readonly readableHighWaterMark: number;
        readonly readableLength: number;
        readonly readableObjectMode: boolean;
        destroyed: boolean;
        read(size?: number | undefined): any;
        setEncoding(encoding: BufferEncoding): any;
        pause(): any;
        resume(): any;
        isPaused(): boolean;
        unpipe(destination?: NodeJS.WritableStream | undefined): any;
        unshift(chunk: any, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined): void;
        wrap(oldStream: NodeJS.ReadableStream): any;
        push(chunk: any, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined): boolean;
        destroy(error?: Error | undefined): void;
        addListener(event: "close", listener: () => void): any;
        addListener(event: "data", listener: (chunk: any) => void): any;
        addListener(event: "end", listener: () => void): any;
        addListener(event: "error", listener: (err: Error) => void): any;
        addListener(event: "pause", listener: () => void): any;
        addListener(event: "readable", listener: () => void): any;
        addListener(event: "resume", listener: () => void): any;
        addListener(event: string | symbol, listener: (...args: any[]) => void): any;
        emit(event: "close"): boolean;
        emit(event: "data", chunk: any): boolean;
        emit(event: "end"): boolean;
        emit(event: "error", err: Error): boolean;
        emit(event: "pause"): boolean;
        emit(event: "readable"): boolean;
        emit(event: "resume"): boolean;
        emit(event: string | symbol, ...args: any[]): boolean;
        on(event: "close", listener: () => void): any;
        on(event: "data", listener: (chunk: any) => void): any;
        on(event: "end", listener: () => void): any;
        on(event: "error", listener: (err: Error) => void): any;
        on(event: "pause", listener: () => void): any;
        on(event: "readable", listener: () => void): any;
        on(event: "resume", listener: () => void): any;
        on(event: string | symbol, listener: (...args: any[]) => void): any;
        once(event: "close", listener: () => void): any;
        once(event: "data", listener: (chunk: any) => void): any;
        once(event: "end", listener: () => void): any;
        once(event: "error", listener: (err: Error) => void): any;
        once(event: "pause", listener: () => void): any;
        once(event: "readable", listener: () => void): any;
        once(event: "resume", listener: () => void): any;
        once(event: string | symbol, listener: (...args: any[]) => void): any;
        prependListener(event: "close", listener: () => void): any;
        prependListener(event: "data", listener: (chunk: any) => void): any;
        prependListener(event: "end", listener: () => void): any;
        prependListener(event: "error", listener: (err: Error) => void): any;
        prependListener(event: "pause", listener: () => void): any;
        prependListener(event: "readable", listener: () => void): any;
        prependListener(event: "resume", listener: () => void): any;
        prependListener(event: string | symbol, listener: (...args: any[]) => void): any;
        prependOnceListener(event: "close", listener: () => void): any;
        prependOnceListener(event: "data", listener: (chunk: any) => void): any;
        prependOnceListener(event: "end", listener: () => void): any;
        prependOnceListener(event: "error", listener: (err: Error) => void): any;
        prependOnceListener(event: "pause", listener: () => void): any;
        prependOnceListener(event: "readable", listener: () => void): any;
        prependOnceListener(event: "resume", listener: () => void): any;
        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): any;
        removeListener(event: "close", listener: () => void): any;
        removeListener(event: "data", listener: (chunk: any) => void): any;
        removeListener(event: "end", listener: () => void): any;
        removeListener(event: "error", listener: (err: Error) => void): any;
        removeListener(event: "pause", listener: () => void): any;
        removeListener(event: "readable", listener: () => void): any;
        removeListener(event: "resume", listener: () => void): any;
        removeListener(event: string | symbol, listener: (...args: any[]) => void): any;
        [Symbol.asyncIterator](): AsyncIterableIterator<any>;
        pipe<T extends NodeJS.WritableStream>(destination: T, options?: {
            end?: boolean | undefined;
        } | undefined): T;
        off(event: string | symbol, listener: (...args: any[]) => void): any;
        removeAllListeners(event?: string | symbol | undefined): any;
        setMaxListeners(n: number): any;
        getMaxListeners(): number;
        listeners(event: string | symbol): Function[];
        rawListeners(event: string | symbol): Function[];
        listenerCount(event: string | symbol): number;
        eventNames(): (string | symbol)[];
    };
    from(iterable: Iterable<any> | AsyncIterable<any>, options?: import("stream").ReadableOptions | undefined): import("stream").Readable;
    finished: typeof import("stream").finished;
    pipeline: typeof import("stream").pipeline;
    Stream: typeof import("stream").Stream;
    Readable: typeof import("stream").Readable;
    Writable: typeof import("stream").Writable;
    Duplex: typeof Duplex;
    Transform: typeof import("stream").Transform;
    PassThrough: typeof import("stream").PassThrough;
    listenerCount(emitter: import("events").EventEmitter, event: string | symbol): number;
    defaultMaxListeners: number;
    readonly errorMonitor: unique symbol;
};
export = _default;
