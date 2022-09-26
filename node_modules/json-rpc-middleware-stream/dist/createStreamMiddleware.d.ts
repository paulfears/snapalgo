import SafeEventEmitter from '@metamask/safe-event-emitter';
import { Duplex } from 'readable-stream';
import { JsonRpcMiddleware } from 'json-rpc-engine';
/**
 * Creates a JsonRpcEngine middleware with an associated Duplex stream and
 * EventEmitter. The middleware, and by extension stream, assume that middleware
 * parameters are properly formatted. No runtime type checking or validation is
 * performed.
 *
 * @returns The event emitter, middleware, and stream.
 */
export default function createStreamMiddleware(): {
    events: SafeEventEmitter;
    middleware: JsonRpcMiddleware<unknown, unknown>;
    stream: Duplex;
};
