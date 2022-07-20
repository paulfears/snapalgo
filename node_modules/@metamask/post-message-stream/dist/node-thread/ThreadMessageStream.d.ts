import { BasePostMessageStream } from '../BasePostMessageStream';
import { StreamData } from '../utils';
/**
 * Child thread-side Node.js `worker_threads` stream.
 */
export declare class ThreadMessageStream extends BasePostMessageStream {
    #private;
    constructor();
    protected _postMessage(data: StreamData): void;
    private _onMessage;
    _destroy(): void;
}
