"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferXOR = exports.setDifference = exports.arrayContains = exports.arraysEqual = exports.hasPrefix = exports.isURType = exports.intToBytes = exports.toUint32 = exports.getCRCHex = exports.getCRC = exports.split = exports.partition = exports.sha256Hash = void 0;
const sha_js_1 = __importDefault(require("sha.js"));
const crc_1 = require("crc");
const sha256Hash = (data) => sha_js_1.default('sha256').update(data).digest();
exports.sha256Hash = sha256Hash;
const partition = (s, n) => s.match(new RegExp('.{1,' + n + '}', 'g')) || [s];
exports.partition = partition;
const split = (s, length) => [s.slice(0, -length), s.slice(-length)];
exports.split = split;
const getCRC = (message) => crc_1.crc32(message);
exports.getCRC = getCRC;
const getCRCHex = (message) => crc_1.crc32(message).toString(16).padStart(8, '0');
exports.getCRCHex = getCRCHex;
const toUint32 = (number) => number >>> 0;
exports.toUint32 = toUint32;
const intToBytes = (num) => {
    const arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
    const view = new DataView(arr);
    view.setUint32(0, num, false); // byteOffset = 0; litteEndian = false
    return Buffer.from(arr);
};
exports.intToBytes = intToBytes;
const isURType = (type) => {
    return type.split('').every((_, index) => {
        let c = type.charCodeAt(index);
        if ('a'.charCodeAt(0) <= c && c <= 'z'.charCodeAt(0))
            return true;
        if ('0'.charCodeAt(0) <= c && c <= '9'.charCodeAt(0))
            return true;
        if (c === '-'.charCodeAt(0))
            return true;
        return false;
    });
};
exports.isURType = isURType;
const hasPrefix = (s, prefix) => s.indexOf(prefix) === 0;
exports.hasPrefix = hasPrefix;
const arraysEqual = (ar1, ar2) => {
    if (ar1.length !== ar2.length) {
        return false;
    }
    return ar1.every(el => ar2.includes(el));
};
exports.arraysEqual = arraysEqual;
/**
 * Checks if ar1 contains all elements of ar2
 * @param ar1 the outer array
 * @param ar2 the array to be contained in ar1
 */
const arrayContains = (ar1, ar2) => {
    return ar2.every(v => ar1.includes(v));
};
exports.arrayContains = arrayContains;
/**
 * Returns the difference array of  `ar1` - `ar2`
 */
const setDifference = (ar1, ar2) => {
    return ar1.filter(x => ar2.indexOf(x) < 0);
};
exports.setDifference = setDifference;
const bufferXOR = (a, b) => {
    const length = Math.max(a.length, b.length);
    const buffer = Buffer.allocUnsafe(length);
    for (let i = 0; i < length; ++i) {
        buffer[i] = a[i] ^ b[i];
    }
    return buffer;
};
exports.bufferXOR = bufferXOR;
//# sourceMappingURL=utils.js.map