"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extension_port_stream_1 = __importDefault(require("extension-port-stream"));
const detect_browser_1 = require("detect-browser");
const BaseProvider_1 = __importDefault(require("../BaseProvider"));
const external_extension_config_json_1 = __importDefault(require("./external-extension-config.json"));
const browser = detect_browser_1.detect();
function createMetaMaskExternalExtensionProvider() {
    let provider;
    try {
        const currentMetaMaskId = getMetaMaskId();
        const metamaskPort = chrome.runtime.connect(currentMetaMaskId);
        const pluginStream = new extension_port_stream_1.default(metamaskPort);
        provider = new BaseProvider_1.default(pluginStream);
    }
    catch (e) {
        console.dir(`Metamask connect error `, e);
        throw e;
    }
    return provider;
}
exports.default = createMetaMaskExternalExtensionProvider;
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