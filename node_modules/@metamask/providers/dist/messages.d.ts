declare const messages: {
    errors: {
        disconnected: () => string;
        permanentlyDisconnected: () => string;
        sendSiteMetadata: () => string;
        unsupportedSync: (method: string) => string;
        invalidDuplexStream: () => string;
        invalidNetworkParams: () => string;
        invalidRequestArgs: () => string;
        invalidRequestMethod: () => string;
        invalidRequestParams: () => string;
        invalidLoggerObject: () => string;
        invalidLoggerMethod: (method: string) => string;
    };
    info: {
        connected: (chainId: string) => string;
    };
    warnings: {
        enableDeprecation: string;
        sendDeprecation: string;
        events: {
            close: string;
            data: string;
            networkChanged: string;
            notification: string;
        };
        rpc: {
            ethDecryptDeprecation: string;
            ethGetEncryptionPublicKeyDeprecation: string;
        };
        experimentalMethods: string;
    };
};
export default messages;
