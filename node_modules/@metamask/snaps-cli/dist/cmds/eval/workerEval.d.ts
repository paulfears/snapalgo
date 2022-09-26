/**
 * Spawn a new worker thread to run the provided bundle in.
 *
 * @param bundlePath - The path to the bundle to run.
 * @returns `null` if the worker ran successfully.
 * @throws If the worker failed to run successfully.
 */
export declare function workerEval(bundlePath: string): Promise<null>;
