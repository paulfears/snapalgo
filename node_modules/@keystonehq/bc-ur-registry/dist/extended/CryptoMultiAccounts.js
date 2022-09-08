"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoMultiAccounts = void 0;
const RegistryType_1 = require("../RegistryType");
const CryptoHDKey_1 = require("../CryptoHDKey");
const RegistryItem_1 = require("../RegistryItem");
const lib_1 = require("../lib");
var Keys;
(function (Keys) {
    Keys[Keys["masterFingerprint"] = 1] = "masterFingerprint";
    Keys[Keys["keys"] = 2] = "keys";
    Keys[Keys["device"] = 3] = "device";
})(Keys || (Keys = {}));
class CryptoMultiAccounts extends RegistryItem_1.RegistryItem {
    constructor(masterFingerprint, keys, device) {
        super();
        this.masterFingerprint = masterFingerprint;
        this.keys = keys;
        this.device = device;
        this.getRegistryType = () => RegistryType_1.RegistryTypes.CRYPTO_MULTI_ACCOUNTS;
        this.getMasterFingerprint = () => this.masterFingerprint;
        this.getKeys = () => this.keys;
        this.getDevice = () => this.device;
        this.toDataItem = () => {
            const map = {};
            if (this.masterFingerprint) {
                map[Keys.masterFingerprint] = this.masterFingerprint.readUInt32BE(0);
            }
            if (this.keys) {
                map[Keys.keys] = this.keys.map((item) => {
                    const dataItem = item.toDataItem();
                    dataItem.setTag(item.getRegistryType().getTag());
                    return dataItem;
                });
            }
            if (this.device) {
                map[Keys.device] = this.device;
            }
            return new lib_1.DataItem(map);
        };
    }
}
exports.CryptoMultiAccounts = CryptoMultiAccounts;
CryptoMultiAccounts.fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const masterFingerprint = Buffer.alloc(4);
    const _masterFingerprint = map[Keys.masterFingerprint];
    if (_masterFingerprint) {
        masterFingerprint.writeUInt32BE(_masterFingerprint, 0);
    }
    const keys = map[Keys.keys];
    const cryptoHDKeys = keys.map((item) => CryptoHDKey_1.CryptoHDKey.fromDataItem(item));
    const device = map[Keys.device];
    return new CryptoMultiAccounts(masterFingerprint, cryptoHDKeys, device);
};
CryptoMultiAccounts.fromCBOR = (_cborPayload) => {
    const dataItem = (0, lib_1.decodeToDataItem)(_cborPayload);
    return CryptoMultiAccounts.fromDataItem(dataItem);
};
//# sourceMappingURL=CryptoMultiAccounts.js.map