"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const utils_1 = require("./utils");
const cbor_1 = require("./cbor");
class UR {
    constructor(_cborPayload, _type = 'bytes') {
        this._cborPayload = _cborPayload;
        this._type = _type;
        if (!utils_1.isURType(this._type)) {
            throw new errors_1.InvalidTypeError();
        }
    }
    static fromBuffer(buf) {
        return new UR(cbor_1.cborEncode(buf));
    }
    static from(value, encoding) {
        return UR.fromBuffer(Buffer.from(value, encoding));
    }
    decodeCBOR() {
        return cbor_1.cborDecode(this._cborPayload);
    }
    get type() { return this._type; }
    get cbor() { return this._cborPayload; }
    equals(ur2) {
        return this.type === ur2.type && this.cbor.equals(ur2.cbor);
    }
}
exports.default = UR;
//# sourceMappingURL=ur.js.map