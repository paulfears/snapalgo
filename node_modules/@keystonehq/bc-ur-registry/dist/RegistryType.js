"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryTypes = exports.RegistryType = void 0;
class RegistryType {
    constructor(type, tag) {
        this.type = type;
        this.tag = tag;
        this.getTag = () => this.tag;
        this.getType = () => this.type;
    }
}
exports.RegistryType = RegistryType;
exports.RegistryTypes = {
    UUID: new RegistryType('uuid', 37),
    BYTES: new RegistryType('bytes', undefined),
    CRYPTO_HDKEY: new RegistryType('crypto-hdkey', 303),
    CRYPTO_KEYPATH: new RegistryType('crypto-keypath', 304),
    CRYPTO_COIN_INFO: new RegistryType('crypto-coin-info', 305),
    CRYPTO_ECKEY: new RegistryType('crypto-eckey', 306),
    CRYPTO_OUTPUT: new RegistryType('crypto-output', 308),
    CRYPTO_PSBT: new RegistryType('crypto-psbt', 310),
    CRYPTO_ACCOUNT: new RegistryType('crypto-account', 311),
    CRYPTO_MULTI_ACCOUNTS: new RegistryType("crypto-multi-accounts", 1103),
};
//# sourceMappingURL=RegistryType.js.map