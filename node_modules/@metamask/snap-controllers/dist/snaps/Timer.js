"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
class Timer {
    constructor(ms) {
        this._remaining = ms;
    }
    isStarted() {
        return Boolean(this._timeout && this._start);
    }
    isFinished() {
        return this._remaining <= 0;
    }
    cancel() {
        this._remaining = 0;
        clearTimeout(this._timeout);
    }
    pause() {
        if (!this.isStarted()) {
            return;
        }
        clearTimeout(this._timeout);
        this._timeout = undefined;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._remaining -= Date.now() - this._start;
    }
    start(callback) {
        if (this._callback) {
            throw new Error('Timer is already started');
        }
        this._callback = callback;
        this.resume();
    }
    resume() {
        if (this.isStarted() || this.isFinished()) {
            return;
        }
        this._start = Date.now();
        this._timeout = setTimeout(() => this.onFinish(), this._remaining);
    }
    onFinish() {
        var _a;
        this._remaining = 0;
        (_a = this._callback) === null || _a === void 0 ? void 0 : _a.call(this);
    }
}
exports.Timer = Timer;
//# sourceMappingURL=Timer.js.map