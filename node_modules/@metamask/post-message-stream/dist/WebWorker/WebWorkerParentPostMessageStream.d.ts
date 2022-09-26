import { BasePostMessageStream } from '../BasePostMessageStream';
interface WorkerParentStreamArgs {
    worker: Worker;
}
/**
 * Parent-side dedicated `WebWorker.postMessage` stream. Designed for use with
 * dedicated workers only.
 */
export declare class WebWorkerParentPostMessageStream extends BasePostMessageStream {
    private _target;
    private _worker;
    /**
     * Creates a stream for communicating with a dedicated `WebWorker`.
     *
     * @param args - Options bag.
     * @param args.worker - The Web Worker to exchange messages with. The worker
     * must instantiate a `WebWorkerPostMessageStream`.
     */
    constructor({ worker }: WorkerParentStreamArgs);
    protected _postMessage(data: unknown): void;
    private _onMessage;
    _destroy(): void;
}
export {};
