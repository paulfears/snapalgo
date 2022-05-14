"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cborDecode = exports.cborEncode = void 0;
const cbor = require('cbor-sync');
const cborEncode = (data) => {
    return cbor.encode(data);
};
exports.cborEncode = cborEncode;
const cborDecode = (data) => {
    return cbor.decode(Buffer.isBuffer(data) ? data : Buffer.from(data, 'hex'));
};
exports.cborDecode = cborDecode;
//# sourceMappingURL=cbor.js.map