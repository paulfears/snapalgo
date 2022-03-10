"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExternalExtensionProvider = exports.shimWeb3 = exports.setGlobalProvider = exports.BaseProvider = exports.MetaMaskInpageProvider = exports.initializeProvider = void 0;
const MetaMaskInpageProvider_1 = __importDefault(require("./MetaMaskInpageProvider"));
exports.MetaMaskInpageProvider = MetaMaskInpageProvider_1.default;
const createExternalExtensionProvider_1 = __importDefault(require("./extension-provider/createExternalExtensionProvider"));
exports.createExternalExtensionProvider = createExternalExtensionProvider_1.default;
const BaseProvider_1 = __importDefault(require("./BaseProvider"));
exports.BaseProvider = BaseProvider_1.default;
const initializeInpageProvider_1 = require("./initializeInpageProvider");
Object.defineProperty(exports, "initializeProvider", { enumerable: true, get: function () { return initializeInpageProvider_1.initializeProvider; } });
Object.defineProperty(exports, "setGlobalProvider", { enumerable: true, get: function () { return initializeInpageProvider_1.setGlobalProvider; } });
const shimWeb3_1 = __importDefault(require("./shimWeb3"));
exports.shimWeb3 = shimWeb3_1.default;
//# sourceMappingURL=index.js.map