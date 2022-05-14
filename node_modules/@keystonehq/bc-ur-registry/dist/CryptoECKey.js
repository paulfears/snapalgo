"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoECKey = void 0;
const lib_1 = require("./lib");
const RegistryItem_1 = require("./RegistryItem");
const RegistryType_1 = require("./RegistryType");
var Keys;
(function (Keys) {
    Keys[Keys["curve"] = 1] = "curve";
    Keys[Keys["private"] = 2] = "private";
    Keys[Keys["data"] = 3] = "data";
})(Keys || (Keys = {}));
class CryptoECKey extends RegistryItem_1.RegistryItem {
    constructor(args) {
        super();
        this.isECKey = () => {
            return true;
        };
        this.getCurve = () => this.curve || 0;
        this.isPrivateKey = () => this.privateKey || false;
        this.getData = () => this.data;
        this.getRegistryType = () => {
            return RegistryType_1.RegistryTypes.CRYPTO_ECKEY;
        };
        this.toDataItem = () => {
            const map = {};
            if (this.curve) {
                map[Keys.curve] = this.curve;
            }
            if (this.privateKey !== undefined) {
                map[Keys.private] = this.privateKey;
            }
            map[Keys.data] = this.data;
            return new lib_1.DataItem(map);
        };
        this.getOutputDescriptorContent = () => {
            return this.data.toString('hex');
        };
        this.data = args.data;
        this.curve = args.curve;
        this.privateKey = args.privateKey || undefined;
    }
}
exports.CryptoECKey = CryptoECKey;
CryptoECKey.fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const curve = map[Keys.curve];
    const privateKey = map[Keys.private];
    const data = map[Keys.data];
    if (!data) {
        throw new Error(`#[ur-registry][CryptoECKey][fn.fromDataItem]: decoded [dataItem][#data.data] is undefined: ${dataItem}`);
    }
    return new CryptoECKey({ data, curve, privateKey });
};
CryptoECKey.fromCBOR = (_cborPayload) => {
    const dataItem = (0, lib_1.decodeToDataItem)(_cborPayload);
    return CryptoECKey.fromDataItem(dataItem);
};
//# sourceMappingURL=CryptoECKey.js.map