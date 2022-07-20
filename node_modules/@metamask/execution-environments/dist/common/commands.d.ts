import { ExecuteSnap, Ping, SnapRpc, Terminate } from '../__GENERATED__/openrpc';
export declare type CommandMethodsMapping = {
    ping: Ping;
    terminate: Terminate;
    executeSnap: ExecuteSnap;
    snapRpc: SnapRpc;
};
/**
 * Gets an object mapping internal, "command" JSON-RPC method names to their
 * implementations.
 *
 * @param startSnap - A function that starts a snap.
 * @param invokeSnapRpc - A function that invokes the RPC method handler of a
 * snap.
 * @param onTerminate - A function that will be called when this executor is
 * terminated in order to handle cleanup tasks.
 * @returns An object containing the "command" method implementations.
 */
export declare function getCommandMethodImplementations(startSnap: (...args: Parameters<ExecuteSnap>) => Promise<void>, invokeSnapRpc: SnapRpc, onTerminate: () => void): CommandMethodsMapping;
