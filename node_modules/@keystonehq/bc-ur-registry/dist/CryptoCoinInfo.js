"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoCoinInfo = exports.Network = exports.Type = void 0;
const lib_1 = require("./lib");
const RegistryItem_1 = require("./RegistryItem");
const RegistryType_1 = require("./RegistryType");
var Keys;
(function (Keys) {
    Keys["type"] = "1";
    Keys["network"] = "2";
})(Keys || (Keys = {}));
var Type;
(function (Type) {
    Type[Type["bitcoin"] = 0] = "bitcoin";
})(Type = exports.Type || (exports.Type = {}));
var Network;
(function (Network) {
    Network[Network["mainnet"] = 0] = "mainnet";
    Network[Network["testnet"] = 1] = "testnet";
})(Network = exports.Network || (exports.Network = {}));
class CryptoCoinInfo extends RegistryItem_1.RegistryItem {
    constructor(type, network) {
        super();
        this.type = type;
        this.network = network;
        this.getRegistryType = () => {
            return RegistryType_1.RegistryTypes.CRYPTO_COIN_INFO;
        };
        this.getType = () => {
            return this.type || Type.bitcoin;
        };
        this.getNetwork = () => {
            return this.network || Network.mainnet;
        };
        this.toDataItem = () => {
            const map = {};
            if (this.type) {
                map[Keys.type] = this.type;
            }
            if (this.network) {
                map[Keys.network] = this.network;
            }
            return new lib_1.DataItem(map);
        };
    }
}
exports.CryptoCoinInfo = CryptoCoinInfo;
CryptoCoinInfo.fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const type = map[Keys.type];
    const network = map[Keys.network];
    return new CryptoCoinInfo(type, network);
};
CryptoCoinInfo.fromCBOR = (_cborPayload) => {
    const dataItem = (0, lib_1.decodeToDataItem)(_cborPayload);
    return CryptoCoinInfo.fromDataItem(dataItem);
};
//# sourceMappingURL=CryptoCoinInfo.js.map