import { SnapProvider } from '@metamask/snap-types';
/**
 * Gets the endowments for a particular Snap. Some endowments, like `setTimeout`
 * and `clearTimeout`, must be attenuated so that they can only affect behavior
 * within the Snap's own realm. Therefore, we use factory functions to create
 * such attenuated / modified endowments. Otherwise, the value that's on the
 * root realm global will be used.
 *
 * @param wallet - The Snap's provider object.
 * @param endowments - The list of endowments to provide to the snap.
 * @returns An object containing the Snap's endowments.
 */
export declare function createEndowments(wallet: SnapProvider, endowments?: string[]): {
    endowments: Record<string, unknown>;
    teardown: () => Promise<void>;
};
/**
 * Checks whether the specified function is a constructor.
 *
 * @param value - Any function value.
 * @returns Whether the specified function is a constructor.
 */
export declare function isConstructor<T extends Function>(value: T): boolean;
