import { BasePostMessageStream } from '../BasePostMessageStream';
import { StreamData } from '../utils';
/**
 * Worker-side dedicated `WebWorker.postMessage` stream. Designed for use with
 * dedicated workers only.
 */
export declare class WebWorkerPostMessageStream extends BasePostMessageStream {
    private _name;
    constructor();
    protected _postMessage(data: StreamData): void;
    private _onMessage;
    _destroy(): void;
}
