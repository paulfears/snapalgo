"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoKeypath = void 0;
const lib_1 = require("./lib");
const PathComponent_1 = require("./PathComponent");
const RegistryItem_1 = require("./RegistryItem");
const RegistryType_1 = require("./RegistryType");
var Keys;
(function (Keys) {
    Keys[Keys["components"] = 1] = "components";
    Keys[Keys["source_fingerprint"] = 2] = "source_fingerprint";
    Keys[Keys["depth"] = 3] = "depth";
})(Keys || (Keys = {}));
class CryptoKeypath extends RegistryItem_1.RegistryItem {
    constructor(components = [], sourceFingerprint, depth) {
        super();
        this.components = components;
        this.sourceFingerprint = sourceFingerprint;
        this.depth = depth;
        this.getRegistryType = () => {
            return RegistryType_1.RegistryTypes.CRYPTO_KEYPATH;
        };
        this.getPath = () => {
            if (this.components.length === 0) {
                return undefined;
            }
            const components = this.components.map((component) => {
                return `${component.isWildcard() ? '*' : component.getIndex()}${component.isHardened() ? "'" : ''}`;
            });
            return components.join('/');
        };
        this.getComponents = () => this.components;
        this.getSourceFingerprint = () => this.sourceFingerprint;
        this.getDepth = () => this.depth;
        this.toDataItem = () => {
            const map = {};
            const components = [];
            this.components &&
                this.components.forEach((component) => {
                    if (component.isWildcard()) {
                        components.push([]);
                    }
                    else {
                        components.push(component.getIndex());
                    }
                    components.push(component.isHardened());
                });
            map[Keys.components] = components;
            if (this.sourceFingerprint) {
                map[Keys.source_fingerprint] = this.sourceFingerprint.readUInt32BE(0);
            }
            if (this.depth !== undefined) {
                map[Keys.depth] = this.depth;
            }
            return new lib_1.DataItem(map);
        };
    }
}
exports.CryptoKeypath = CryptoKeypath;
CryptoKeypath.fromDataItem = (dataItem) => {
    const map = dataItem.getData();
    const pathComponents = [];
    const components = map[Keys.components];
    if (components) {
        for (let i = 0; i < components.length; i += 2) {
            const isHardened = components[i + 1];
            const path = components[i];
            if (typeof path === 'number') {
                pathComponents.push(new PathComponent_1.PathComponent({ index: path, hardened: isHardened }));
            }
            else {
                pathComponents.push(new PathComponent_1.PathComponent({ hardened: isHardened }));
            }
        }
    }
    const _sourceFingerprint = map[Keys.source_fingerprint];
    let sourceFingerprint;
    if (_sourceFingerprint) {
        sourceFingerprint = Buffer.alloc(4);
        sourceFingerprint.writeUInt32BE(_sourceFingerprint, 0);
    }
    const depth = map[Keys.depth];
    return new CryptoKeypath(pathComponents, sourceFingerprint, depth);
};
CryptoKeypath.fromCBOR = (_cborPayload) => {
    const dataItem = (0, lib_1.decodeToDataItem)(_cborPayload);
    return CryptoKeypath.fromDataItem(dataItem);
};
//# sourceMappingURL=CryptoKeypath.js.map