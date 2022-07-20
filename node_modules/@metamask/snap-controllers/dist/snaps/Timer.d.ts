export declare class Timer {
    private _timeout?;
    private _start?;
    private _remaining;
    private _callback?;
    constructor(ms: number);
    isStarted(): boolean;
    isFinished(): boolean;
    cancel(): void;
    pause(): void;
    start(callback: () => void): void;
    resume(): void;
    private onFinish;
}
