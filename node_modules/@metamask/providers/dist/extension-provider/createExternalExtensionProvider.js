"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExternalExtensionProvider = void 0;
const extension_port_stream_1 = __importDefault(require("extension-port-stream"));
const detect_browser_1 = require("detect-browser");
const MetaMaskInpageProvider_1 = require("../MetaMaskInpageProvider");
const StreamProvider_1 = require("../StreamProvider");
const utils_1 = require("../utils");
const external_extension_config_json_1 = __importDefault(require("./external-extension-config.json"));
const browser = detect_browser_1.detect();
function createExternalExtensionProvider() {
    let provider;
    try {
        const currentMetaMaskId = getMetaMaskId();
        const metamaskPort = chrome.runtime.connect(currentMetaMaskId);
        const pluginStream = new extension_port_stream_1.default(metamaskPort);
        provider = new StreamProvider_1.StreamProvider(pluginStream, {
            jsonRpcStreamName: MetaMaskInpageProvider_1.MetaMaskInpageProviderStreamName,
            logger: console,
            rpcMiddleware: utils_1.getDefaultExternalMiddleware(console),
        });
        // This is asynchronous but merely logs an error and does not throw upon
        // failure. Previously this just happened as a side-effect in the
        // constructor.
        provider.initialize();
    }
    catch (error) {
        console.dir(`MetaMask connect error.`, error);
        throw error;
    }
    return provider;
}
exports.createExternalExtensionProvider = createExternalExtensionProvider;
function getMetaMaskId() {
    switch (browser === null || browser === void 0 ? void 0 : browser.name) {
        case 'chrome':
            return external_extension_config_json_1.default.CHROME_ID;
        case 'firefox':
            return external_extension_config_json_1.default.FIREFOX_ID;
        default:
            return external_extension_config_json_1.default.CHROME_ID;
    }
}
//# sourceMappingURL=createExternalExtensionProvider.js.map