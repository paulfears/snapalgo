/// <reference types="node" />
import type { ChildProcess } from 'child_process';
import { BasePostMessageStream } from '../BasePostMessageStream';
import { StreamData } from '../utils';
interface ProcessParentMessageStreamArgs {
    process: ChildProcess;
}
/**
 * Parent-side Node.js `child_process` stream.
 */
export declare class ProcessParentMessageStream extends BasePostMessageStream {
    private _process;
    /**
     * Creates a stream for communicating with a Node.js `child_process` process.
     *
     * @param args - Options bag.
     * @param args.process - The process to communicate with.
     */
    constructor({ process }: ProcessParentMessageStreamArgs);
    protected _postMessage(data: StreamData): void;
    private _onMessage;
    _destroy(): void;
}
export {};
