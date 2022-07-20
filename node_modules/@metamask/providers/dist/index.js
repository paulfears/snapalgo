"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamProvider = exports.shimWeb3 = exports.setGlobalProvider = exports.MetaMaskInpageProvider = exports.MetaMaskInpageProviderStreamName = exports.initializeProvider = exports.createExternalExtensionProvider = exports.BaseProvider = void 0;
const BaseProvider_1 = require("./BaseProvider");
Object.defineProperty(exports, "BaseProvider", { enumerable: true, get: function () { return BaseProvider_1.BaseProvider; } });
const createExternalExtensionProvider_1 = require("./extension-provider/createExternalExtensionProvider");
Object.defineProperty(exports, "createExternalExtensionProvider", { enumerable: true, get: function () { return createExternalExtensionProvider_1.createExternalExtensionProvider; } });
const initializeInpageProvider_1 = require("./initializeInpageProvider");
Object.defineProperty(exports, "initializeProvider", { enumerable: true, get: function () { return initializeInpageProvider_1.initializeProvider; } });
Object.defineProperty(exports, "setGlobalProvider", { enumerable: true, get: function () { return initializeInpageProvider_1.setGlobalProvider; } });
const MetaMaskInpageProvider_1 = require("./MetaMaskInpageProvider");
Object.defineProperty(exports, "MetaMaskInpageProvider", { enumerable: true, get: function () { return MetaMaskInpageProvider_1.MetaMaskInpageProvider; } });
Object.defineProperty(exports, "MetaMaskInpageProviderStreamName", { enumerable: true, get: function () { return MetaMaskInpageProvider_1.MetaMaskInpageProviderStreamName; } });
const shimWeb3_1 = require("./shimWeb3");
Object.defineProperty(exports, "shimWeb3", { enumerable: true, get: function () { return shimWeb3_1.shimWeb3; } });
const StreamProvider_1 = require("./StreamProvider");
Object.defineProperty(exports, "StreamProvider", { enumerable: true, get: function () { return StreamProvider_1.StreamProvider; } });
//# sourceMappingURL=index.js.map