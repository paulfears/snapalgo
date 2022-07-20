import { BaseSnapExecutor } from '../common/BaseSnapExecutor';
export declare class IFrameSnapExecutor extends BaseSnapExecutor {
    /**
     * Initialize the IFrameSnapExecutor. This creates a post message stream from
     * and to the parent window, for two-way communication with the iframe.
     *
     * @returns An instance of `IFrameSnapExecutor`, with the initialized post
     * message streams.
     */
    static initialize(): IFrameSnapExecutor;
}
