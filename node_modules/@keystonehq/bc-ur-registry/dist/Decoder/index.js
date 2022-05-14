"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URRegistryDecoder = void 0;
const bc_ur_1 = require("@ngraveio/bc-ur");
const __1 = require("..");
const RegistryType_1 = require("../RegistryType");
const errors_1 = require("../errors");
class URRegistryDecoder extends bc_ur_1.URDecoder {
    constructor() {
        super(...arguments);
        this.resultRegistryType = () => {
            const ur = this.resultUR();
            switch (ur.type) {
                case RegistryType_1.RegistryTypes.BYTES.getType():
                    return __1.Bytes.fromCBOR(ur.cbor);
                case RegistryType_1.RegistryTypes.CRYPTO_HDKEY.getType():
                    return __1.CryptoHDKey.fromCBOR(ur.cbor);
                case RegistryType_1.RegistryTypes.CRYPTO_KEYPATH.getType():
                    return __1.CryptoKeypath.fromCBOR(ur.cbor);
                case RegistryType_1.RegistryTypes.CRYPTO_COIN_INFO.getType():
                    return __1.CryptoCoinInfo.fromCBOR(ur.cbor);
                case RegistryType_1.RegistryTypes.CRYPTO_ECKEY.getType():
                    return __1.CryptoECKey.fromCBOR(ur.cbor);
                case RegistryType_1.RegistryTypes.CRYPTO_OUTPUT.getType():
                    return __1.CryptoOutput.fromCBOR(ur.cbor);
                case RegistryType_1.RegistryTypes.CRYPTO_PSBT.getType():
                    return __1.CryptoPSBT.fromCBOR(ur.cbor);
                case RegistryType_1.RegistryTypes.CRYPTO_ACCOUNT.getType():
                    return __1.CryptoAccount.fromCBOR(ur.cbor);
                default:
                    throw new errors_1.UnknownURTypeError(`#[ur-registry][Decoder][fn.resultRegistryType]: registry type ${ur.type} is not supported now`);
            }
        };
    }
}
exports.URRegistryDecoder = URRegistryDecoder;
//# sourceMappingURL=index.js.map