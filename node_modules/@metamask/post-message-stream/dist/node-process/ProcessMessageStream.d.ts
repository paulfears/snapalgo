import { BasePostMessageStream } from '../BasePostMessageStream';
import { StreamData } from '../utils';
/**
 * Child process-side Node.js `child_process` stream.
 */
export declare class ProcessMessageStream extends BasePostMessageStream {
    constructor();
    protected _postMessage(data: StreamData): void;
    private _onMessage;
    _destroy(): void;
}
