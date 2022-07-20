"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoHDKey = void 0;
const bs58check_1 = require("bs58check");
const CryptoCoinInfo_1 = require("./CryptoCoinInfo");
const CryptoKeypath_1 = require("./CryptoKeypath");
const lib_1 = require("./lib");
const RegistryItem_1 = require("./RegistryItem");
const RegistryType_1 = require("./RegistryType");
var Keys;
(function (Keys) {
    Keys[Keys["is_master"] = 1] = "is_master";
    Keys[Keys["is_private"] = 2] = "is_private";
    Keys[Keys["key_data"] = 3] = "key_data";
    Keys[Keys["chain_code"] = 4] = "chain_code";
    Keys[Keys["use_info"] = 5] = "use_info";
    Keys[Keys["origin"] = 6] = "origin";
    Keys[Keys["children"] = 7] = "children";
    Keys[Keys["parent_fingerprint"] = 8] = "parent_fingerprint";
    Keys[Keys["name"] = 9] = "name";
    Keys[Keys["note"] = 10] = "note";
})(Keys || (Keys = {}));
class CryptoHDKey extends RegistryItem_1.RegistryItem {
    constructor(args) {
        super();
        this.isECKey = () => {
            return false;
        };
        this.getKey = () => this.key;
        this.getChainCode = () => this.chainCode;
        this.isMaster = () => this.master;
        this.isPrivateKey = () => !!this.privateKey;
        this.getUseInfo = () => this.useInfo;
        this.getOrigin = () => this.origin;
        this.getChildren = () => this.children;
        this.getParentFingerprint = () => this.parentFingerprint;
        this.getName = () => this.name;
        this.getNote = () => this.note;
        this.getBip32Key = () => {
            var _a, _b, _c;
            let version;
            let depth;
            let index = 0;
            let parentFingerprint = Buffer.alloc(4).fill(0);
            if (this.isMaster()) {
                version = Buffer.from('0488ADE4', 'hex');
                depth = 0;
                index = 0;
            }
            else {
                depth = ((_a = this.getOrigin()) === null || _a === void 0 ? void 0 : _a.getComponents().length) || ((_b = this.getOrigin()) === null || _b === void 0 ? void 0 : _b.getDepth());
                const paths = (_c = this.getOrigin()) === null || _c === void 0 ? void 0 : _c.getComponents();
                const lastPath = paths[paths.length - 1];
                if (lastPath) {
                    index = lastPath.isHardened() ? lastPath.getIndex() + 0x80000000 : lastPath.getIndex();
                    if (this.getParentFingerprint()) {
                        parentFingerprint = this.getParentFingerprint();
                    }
                }
                if (this.isPrivateKey()) {
                    version = Buffer.from('0488ADE4', 'hex');
                }
                else {
                    version = Buffer.from('0488B21E', 'hex');
                }
            }
            const depthBuffer = Buffer.alloc(1);
            depthBuffer.writeUInt8(depth, 0);
            const indexBuffer = Buffer.alloc(4);
            indexBuffer.writeUInt32BE(index, 0);
            const chainCode = this.getChainCode();
            const key = this.getKey();
            return bs58check_1.encode(Buffer.concat([version, depthBuffer, parentFingerprint, indexBuffer, chainCode, key]));
        };
        this.getRegistryType = () => {
            return RegistryType_1.RegistryTypes.CRYPTO_HDKEY;
        };
        this.getOutputDescriptorContent = () => {
            var _a, _b, _c, _d, _e, _f, _g;
            let result = '';
            if (this.getOrigin()) {
                if (((_a = this.getOrigin()) === null || _a === void 0 ? void 0 : _a.getSourceFingerprint()) && ((_b = this.getOrigin()) === null || _b === void 0 ? void 0 : _b.getPath())) {
                    result += `${(_d = (_c = this.getOrigin()) === null || _c === void 0 ? void 0 : _c.getSourceFingerprint()) === null || _d === void 0 ? void 0 : _d.toString('hex')}/${(_e = this.getOrigin()) === null || _e === void 0 ? void 0 : _e.getPath()}`;
                }
            }
            result += this.getBip32Key();
            if (this.getChildren()) {
                if ((_f = this.getChildren()) === null || _f === void 0 ? void 0 : _f.getPath()) {
                    result += `/${(_g = this.getChildren()) === null || _g === void 0 ? void 0 : _g.getPath()}`;
                }
            }
            return result;
        };
        this.setupMasterKey = (args) => {
            this.master = true;
            this.key = args.key;
            this.chainCode = args.chainCode;
        };
        this.setupDeriveKey = (args) => {
            this.master = false;
            this.privateKey = args.isPrivateKey;
            this.key = args.key;
            this.chainCode = args.chainCode;
            this.useInfo = args.useInfo;
            this.origin = args.origin;
            this.children = args.children;
            this.parentFingerprint = args.parentFingerprint;
            this.name = args.name;
            this.note = args.note;
        };
        this.toDataItem = () => {
            const map = {};
            if (this.master) {
                map[Keys.is_master] = true;
                map[Keys.key_data] = this.key;
                map[Keys.chain_code] = this.chainCode;
            }
            else {
                if (this.privateKey !== undefined) {
                    map[Keys.is_private] = this.privateKey;
                }
                map[Keys.key_data] = this.key;
                if (this.chainCode) {
                    map[Keys.chain_code] = this.chainCode;
                }
                if (this.useInfo) {
                    const useInfo = this.useInfo.toDataItem();
                    useInfo.setTag(this.useInfo.getRegistryType().getTag());
                    map[Keys.use_info] = useInfo;
                }
                if (this.origin) {
                    const origin = this.origin.toDataItem();
                    origin.setTag(this.origin.getRegistryType().getTag());
                    map[Keys.origin] = origin;
                }
                if (this.children) {
                    const children = this.children.toDataItem();
                    children.setTag(this.children.getRegistryType().getTag());
                    map[Keys.children] = children;
                }
                if (this.parentFingerprint) {
                    map[Keys.parent_fingerprint] = this.parentFingerprint.readUInt32BE(0);
                }
                if (this.name !== undefined) {
                    map[Keys.name] = this.name;
                }
                if (this.note !== undefined) {
                    map[Keys.note] = this.note;
                }
            }
            return new lib_1.DataItem(map);
        };
        if (args.isMaster) {
            this.setupMasterKey(args);
        }
        else {
            this.setupDeriveKey(args);
        }
    }
}
exports.CryptoHDKey = CryptoHDKey;
CryptoHDKey.fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const isMaster = !!map[Keys.is_master];
    const isPrivateKey = map[Keys.is_private];
    const key = map[Keys.key_data];
    const chainCode = map[Keys.chain_code];
    const useInfo = map[Keys.use_info]
        ? CryptoCoinInfo_1.CryptoCoinInfo.fromDataItem(map[Keys.use_info])
        : undefined;
    const origin = map[Keys.origin]
        ? CryptoKeypath_1.CryptoKeypath.fromDataItem(map[Keys.origin])
        : undefined;
    const children = map[Keys.children]
        ? CryptoKeypath_1.CryptoKeypath.fromDataItem(map[Keys.children])
        : undefined;
    const _parentFingerprint = map[Keys.parent_fingerprint];
    let parentFingerprint = undefined;
    if (_parentFingerprint) {
        parentFingerprint = Buffer.alloc(4);
        parentFingerprint.writeUInt32BE(_parentFingerprint, 0);
    }
    const name = map[Keys.name];
    const note = map[Keys.note];
    return new CryptoHDKey({
        isMaster,
        isPrivateKey,
        key,
        chainCode,
        useInfo,
        origin,
        children,
        parentFingerprint,
        name,
        note,
    });
};
CryptoHDKey.fromCBOR = (_cborPayload) => {
    const dataItem = lib_1.decodeToDataItem(_cborPayload);
    return CryptoHDKey.fromDataItem(dataItem);
};
//# sourceMappingURL=CryptoHDKey.js.map