"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/**
 * Create a network endowment, consisting of a `WebSocket` object and `fetch`
 * function. This allows us to provide a teardown function, so that we can cancel
 * any pending requests, connections, streams, etc. that may be open when a snap
 * is terminated.
 *
 * This wraps the original implementations of `WebSocket` and `fetch`,
 * to ensure that a bad actor cannot get access to the original objects, thus
 * potentially preventing the network requests from being torn down.
 *
 * @returns An object containing a wrapped `WebSocket` class and `fetch`
 * function, as well as a teardown function.
 */
const createNetwork = () => {
    var _instances, _teardownClose, _createWrapped, _socket, _isTornDown, _events, _onopenOriginal, _onmessageOriginal, _onerrorOriginal, _oncloseOriginal, _a;
    // Open fetch calls or open body streams or open websockets
    const openConnections = new Set();
    // Remove items from openConnections after they were garbage collected
    const cleanup = new FinalizationRegistry(
    /* istanbul ignore next: can't test garbage collection without modifying node parameters */
    (callback) => callback());
    const _fetch = async (input, init) => {
        const abortController = new AbortController();
        if ((init === null || init === void 0 ? void 0 : init.signal) !== null && (init === null || init === void 0 ? void 0 : init.signal) !== undefined) {
            const originalSignal = init.signal;
            // Merge abort controllers
            originalSignal.addEventListener('abort', () => {
                abortController.abort(originalSignal.reason);
            }, { once: true });
        }
        let res;
        let openFetchConnection;
        try {
            const fetchPromise = fetch(input, Object.assign(Object.assign({}, init), { signal: abortController.signal }));
            openFetchConnection = {
                cancel: async () => {
                    abortController.abort();
                    try {
                        await fetchPromise;
                    }
                    catch (_a) {
                        /* do nothing */
                    }
                },
            };
            openConnections.add(openFetchConnection);
            res = await fetchPromise;
        }
        finally {
            if (openFetchConnection !== undefined) {
                openConnections.delete(openFetchConnection);
            }
        }
        if (res.body !== null) {
            const body = new WeakRef(res.body);
            const openBodyConnection = {
                cancel: 
                /* istanbul ignore next: see it.todo('can be torn down during body read') test */
                async () => {
                    var _a;
                    try {
                        await ((_a = body.deref()) === null || _a === void 0 ? void 0 : _a.cancel());
                    }
                    catch (_b) {
                        /* do nothing */
                    }
                },
            };
            openConnections.add(openBodyConnection);
            cleanup.register(res.body, 
            /* istanbul ignore next: can't test garbage collection without modifying node parameters */
            () => openConnections.delete(openBodyConnection));
        }
        return res;
    };
    /**
     * This class wraps a WebSocket object instead of extending it.
     * That way, a bad actor can't get access to original methods using
     * `socket.prototype`.
     *
     * When modifying this class, ensure that no method calls any other method
     * from the same class (#socket calls are fine). Otherwise, a bad actor could
     * replace one of the implementations
     */
    const _WebSocket = (_a = class {
            constructor(url, protocols) {
                _instances.add(this);
                _socket.set(this, void 0);
                /**
                 * After this is set to true, no new event listeners can be added
                 */
                _isTornDown.set(this, false);
                _events.set(this, {});
                _onopenOriginal.set(this, null);
                _onmessageOriginal.set(this, null);
                _onerrorOriginal.set(this, null);
                _oncloseOriginal.set(this, null);
                __classPrivateFieldSet(this, _socket, new WebSocket(url, protocols), "f");
                // You can't call ref.deref()?.#teardownClose()
                // But you can capture the close itself
                const ref = new WeakRef(__classPrivateFieldGet(this, _instances, "m", _teardownClose).bind(this));
                const openConnection = {
                    cancel: async () => {
                        var _a;
                        try {
                            await ((_a = ref.deref()) === null || _a === void 0 ? void 0 : _a());
                        }
                        catch (_b) {
                            /* do nothing */
                        }
                    },
                };
                openConnections.add(openConnection);
                cleanup.register(this, 
                /* istanbul ignore next: can't test garbage collection without modifying node parameters */
                () => openConnections.delete(openConnection));
            }
            get onclose() {
                return __classPrivateFieldGet(this, _oncloseOriginal, "f");
            }
            set onclose(callback) {
                if (__classPrivateFieldGet(this, _isTornDown, "f") !== true) {
                    __classPrivateFieldSet(this, _oncloseOriginal, callback, "f");
                    __classPrivateFieldGet(this, _socket, "f").onclose = __classPrivateFieldGet(this, _instances, "m", _createWrapped).call(this, callback);
                }
            }
            get onerror() {
                return __classPrivateFieldGet(this, _onerrorOriginal, "f");
            }
            set onerror(callback) {
                __classPrivateFieldSet(this, _onerrorOriginal, callback, "f");
                __classPrivateFieldGet(this, _socket, "f").onerror = __classPrivateFieldGet(this, _instances, "m", _createWrapped).call(this, callback);
            }
            get onmessage() {
                return __classPrivateFieldGet(this, _onmessageOriginal, "f");
            }
            set onmessage(callback) {
                __classPrivateFieldSet(this, _onmessageOriginal, callback, "f");
                __classPrivateFieldGet(this, _socket, "f").onmessage = __classPrivateFieldGet(this, _instances, "m", _createWrapped).call(this, callback);
            }
            get onopen() {
                return __classPrivateFieldGet(this, _onopenOriginal, "f");
            }
            set onopen(callback) {
                __classPrivateFieldSet(this, _onopenOriginal, callback, "f");
                __classPrivateFieldGet(this, _socket, "f").onopen = __classPrivateFieldGet(this, _instances, "m", _createWrapped).call(this, callback);
            }
            close(code, reason) {
                __classPrivateFieldGet(this, _socket, "f").close(code, reason);
            }
            send(data) {
                __classPrivateFieldGet(this, _socket, "f").send(data);
            }
            get CLOSED() {
                return __classPrivateFieldGet(this, _socket, "f").CLOSED;
            }
            get CLOSING() {
                return __classPrivateFieldGet(this, _socket, "f").CLOSING;
            }
            get CONNECTING() {
                return __classPrivateFieldGet(this, _socket, "f").CONNECTING;
            }
            get OPEN() {
                return __classPrivateFieldGet(this, _socket, "f").OPEN;
            }
            get binaryType() {
                return __classPrivateFieldGet(this, _socket, "f").binaryType;
            }
            set binaryType(value) {
                __classPrivateFieldGet(this, _socket, "f").binaryType = value;
            }
            get bufferedAmount() {
                var _a;
                return (_a = __classPrivateFieldGet(this, _socket, "f").bufferedAmount) !== null && _a !== void 0 ? _a : 0;
            }
            get extensions() {
                var _a;
                return (_a = __classPrivateFieldGet(this, _socket, "f").extensions) !== null && _a !== void 0 ? _a : '';
            }
            get protocol() {
                return __classPrivateFieldGet(this, _socket, "f").protocol;
            }
            get readyState() {
                return __classPrivateFieldGet(this, _socket, "f").readyState;
            }
            get url() {
                return __classPrivateFieldGet(this, _socket, "f").url;
            }
            addEventListener(type, listener, options) {
                if (__classPrivateFieldGet(this, _isTornDown, "f") !== true) {
                    if (__classPrivateFieldGet(this, _events, "f")[type] === undefined) {
                        __classPrivateFieldGet(this, _events, "f")[type] = new Map();
                    }
                    const wrapped = __classPrivateFieldGet(this, _instances, "m", _createWrapped).call(this, listener);
                    if (wrapped !== null) {
                        __classPrivateFieldGet(this, _events, "f")[type].set(listener, wrapped);
                        __classPrivateFieldGet(this, _socket, "f").addEventListener(type, wrapped, options);
                    }
                }
            }
            removeEventListener(type, listener, options) {
                if (__classPrivateFieldGet(this, _events, "f")[type] !== undefined) {
                    const wrapped = __classPrivateFieldGet(this, _events, "f")[type].get(listener);
                    if (wrapped !== undefined) {
                        __classPrivateFieldGet(this, _events, "f")[type].delete(listener);
                        __classPrivateFieldGet(this, _socket, "f").removeEventListener(type, wrapped, options);
                    }
                }
            }
            dispatchEvent(event) {
                // Can't call close prematurely before the teardown finishes
                if (event.type !== 'close' || __classPrivateFieldGet(this, _isTornDown, "f") !== true) {
                    return __classPrivateFieldGet(this, _socket, "f").dispatchEvent(event);
                }
                return false;
            }
        },
        _socket = new WeakMap(),
        _isTornDown = new WeakMap(),
        _events = new WeakMap(),
        _onopenOriginal = new WeakMap(),
        _onmessageOriginal = new WeakMap(),
        _onerrorOriginal = new WeakMap(),
        _oncloseOriginal = new WeakMap(),
        _instances = new WeakSet(),
        _teardownClose = function _teardownClose() {
            var _a, _b, _c;
            // We clear all close listeners
            __classPrivateFieldGet(this, _socket, "f").onclose = null;
            for (const wrapped of (_b = (_a = __classPrivateFieldGet(this, _events, "f").close) === null || _a === void 0 ? void 0 : _a.values()) !== null && _b !== void 0 ? _b : []) {
                __classPrivateFieldGet(this, _socket, "f").removeEventListener('close', wrapped);
            }
            (_c = __classPrivateFieldGet(this, _events, "f").close) === null || _c === void 0 ? void 0 : _c.clear();
            // We add our own listener
            let onClosedResolve;
            const onClosed = new Promise((r) => (onClosedResolve = r));
            __classPrivateFieldGet(this, _socket, "f").onclose = () => {
                onClosedResolve();
            };
            // No new listeners can be added after this point
            __classPrivateFieldSet(this, _isTornDown, true, "f");
            __classPrivateFieldGet(this, _socket, "f").close();
            return onClosed;
        },
        _createWrapped = function _createWrapped(listener) {
            if (listener === null) {
                return null;
            }
            return (e) => {
                const functions = (0, utils_1.allFunctions)(e).map((key) => e[key].bind(this));
                listener.apply(this, [
                    Object.assign(Object.assign(Object.assign({}, e), functions), { target: this, currentTarget: this, srcElement: this, ports: [this], source: null, composedPath: () => [this] }),
                ]);
            };
        },
        _a);
    const teardownFunction = async () => {
        const promises = [];
        openConnections.forEach(({ cancel }) => promises.push(cancel()));
        openConnections.clear();
        await Promise.all(promises);
    };
    return {
        fetch: _fetch,
        WebSocket: _WebSocket,
        teardownFunction,
    };
};
const endowmentModule = {
    names: ['fetch', 'WebSocket'],
    factory: createNetwork,
};
exports.default = endowmentModule;
//# sourceMappingURL=network.js.map