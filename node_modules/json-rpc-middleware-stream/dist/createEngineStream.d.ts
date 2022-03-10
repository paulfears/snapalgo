import { Duplex } from 'readable-stream';
import { JsonRpcEngine } from 'json-rpc-engine';
interface EngineStreamOptions {
    engine: JsonRpcEngine;
}
/**
 * Takes a JsonRpcEngine and returns a Duplex stream wrapping it.
 *
 * @param opts - Options bag.
 * @param opts.engine - The JsonRpcEngine to wrap in a stream.
 * @returns The stream wrapping the engine.
 */
export default function createEngineStream(opts: EngineStreamOptions): Duplex;
export {};
