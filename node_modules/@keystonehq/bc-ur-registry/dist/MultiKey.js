"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiKey = void 0;
const CryptoECKey_1 = require("./CryptoECKey");
const CryptoHDKey_1 = require("./CryptoHDKey");
const DataItem_1 = require("./lib/DataItem");
const RegistryItem_1 = require("./RegistryItem");
const RegistryType_1 = require("./RegistryType");
var Keys;
(function (Keys) {
    Keys[Keys["threshold"] = 1] = "threshold";
    Keys[Keys["keys"] = 2] = "keys";
})(Keys || (Keys = {}));
class MultiKey extends RegistryItem_1.RegistryItem {
    constructor(threshold, keys) {
        super();
        this.threshold = threshold;
        this.keys = keys;
        this.getThreshold = () => this.threshold;
        this.getKeys = () => this.keys;
        this.toDataItem = () => {
            const map = {};
            map[Keys.threshold] = this.threshold;
            const keys = this.keys.map((k) => {
                const dataItem = k.toDataItem();
                dataItem.setTag(k.getRegistryType().getTag());
                return dataItem;
            });
            map[Keys.keys] = keys;
            return new DataItem_1.DataItem(map);
        };
        this.getOutputDescriptorContent = () => {
            return [this.getThreshold(),
                this.keys.map(k => k.getOutputDescriptorContent()).join(','),
            ].join(',');
        };
    }
}
exports.MultiKey = MultiKey;
MultiKey.fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const threshold = map[Keys.threshold];
    const _keys = map[Keys.keys];
    const keys = [];
    _keys.forEach((k) => {
        if (k.getTag() === RegistryType_1.RegistryTypes.CRYPTO_HDKEY.getTag()) {
            keys.push(CryptoHDKey_1.CryptoHDKey.fromDataItem(k));
        }
        else if (k.getTag() === RegistryType_1.RegistryTypes.CRYPTO_ECKEY.getTag()) {
            keys.push(CryptoECKey_1.CryptoECKey.fromDataItem(k));
        }
    });
    return new MultiKey(threshold, keys);
};
//# sourceMappingURL=MultiKey.js.map