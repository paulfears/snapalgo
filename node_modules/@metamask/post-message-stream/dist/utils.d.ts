export declare const DEDICATED_WORKER_NAME = "dedicatedWorker";
export declare type StreamData = number | string | Record<string, unknown> | unknown[];
export interface StreamMessage {
    data: StreamData;
    [key: string]: unknown;
}
/**
 * Checks whether the specified stream event message is valid per the
 * expectations of this library.
 *
 * @param message - The stream event message property.
 * @returns Whether the `message` is a valid stream message.
 */
export declare function isValidStreamMessage(message: unknown): message is StreamMessage;
