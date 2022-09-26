import { BasePostMessageStream } from '../BasePostMessageStream';
interface WindowPostMessageStreamArgs {
    name: string;
    target: string;
    targetOrigin?: string;
    targetWindow?: Window;
}
/**
 * A {@link Window.postMessage} stream.
 */
export declare class WindowPostMessageStream extends BasePostMessageStream {
    private _name;
    private _target;
    private _targetOrigin;
    private _targetWindow;
    /**
     * Creates a stream for communicating with other streams across the same or
     * different `window` objects.
     *
     * @param args - Options bag.
     * @param args.name - The name of the stream. Used to differentiate between
     * multiple streams sharing the same window object.
     * @param args.target - The name of the stream to exchange messages with.
     * @param args.targetOrigin - The origin of the target. Defaults to
     * `location.origin`, '*' is permitted.
     * @param args.targetWindow - The window object of the target stream. Defaults
     * to `window`.
     */
    constructor({ name, target, targetOrigin, targetWindow, }: WindowPostMessageStreamArgs);
    protected _postMessage(data: unknown): void;
    private _onMessage;
    _destroy(): void;
}
export {};
