"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const jsbi_1 = __importDefault(require("jsbi"));
const MAX_UINT64 = 0xFFFFFFFFFFFFFFFF;
const rotl = (x, k) => jsbi_1.default.bitwiseXor(jsbi_1.default.asUintN(64, jsbi_1.default.leftShift(x, jsbi_1.default.BigInt(k))), jsbi_1.default.BigInt(jsbi_1.default.asUintN(64, jsbi_1.default.signedRightShift(x, (jsbi_1.default.subtract(jsbi_1.default.BigInt(64), jsbi_1.default.BigInt(k)))))));
class Xoshiro {
    constructor(seed) {
        this.next = () => {
            return new bignumber_js_1.default(this.roll().toString());
        };
        this.nextDouble = () => {
            return new bignumber_js_1.default(this.roll().toString()).div(MAX_UINT64 + 1);
        };
        this.nextInt = (low, high) => {
            return Math.floor((this.nextDouble().toNumber() * (high - low + 1)) + low);
        };
        this.nextByte = () => this.nextInt(0, 255);
        this.nextData = (count) => ([...new Array(count)].map(() => this.nextByte()));
        const digest = utils_1.sha256Hash(seed);
        this.s = [jsbi_1.default.BigInt(0), jsbi_1.default.BigInt(0), jsbi_1.default.BigInt(0), jsbi_1.default.BigInt(0)];
        this.setS(digest);
    }
    setS(digest) {
        for (let i = 0; i < 4; i++) {
            let o = i * 8;
            let v = jsbi_1.default.BigInt(0);
            for (let n = 0; n < 8; n++) {
                v = jsbi_1.default.asUintN(64, jsbi_1.default.leftShift(v, jsbi_1.default.BigInt(8)));
                v = jsbi_1.default.asUintN(64, jsbi_1.default.bitwiseOr(v, jsbi_1.default.BigInt(digest[o + n])));
            }
            this.s[i] = jsbi_1.default.asUintN(64, v);
        }
    }
    roll() {
        const result = jsbi_1.default.asUintN(64, jsbi_1.default.multiply(rotl(jsbi_1.default.asUintN(64, jsbi_1.default.multiply(this.s[1], jsbi_1.default.BigInt(5))), 7), jsbi_1.default.BigInt(9)));
        const t = jsbi_1.default.asUintN(64, jsbi_1.default.leftShift(this.s[1], jsbi_1.default.BigInt(17)));
        this.s[2] = jsbi_1.default.asUintN(64, jsbi_1.default.bitwiseXor(this.s[2], jsbi_1.default.BigInt(this.s[0])));
        this.s[3] = jsbi_1.default.asUintN(64, jsbi_1.default.bitwiseXor(this.s[3], jsbi_1.default.BigInt(this.s[1])));
        this.s[1] = jsbi_1.default.asUintN(64, jsbi_1.default.bitwiseXor(this.s[1], jsbi_1.default.BigInt(this.s[2])));
        this.s[0] = jsbi_1.default.asUintN(64, jsbi_1.default.bitwiseXor(this.s[0], jsbi_1.default.BigInt(this.s[3])));
        this.s[2] = jsbi_1.default.asUintN(64, jsbi_1.default.bitwiseXor(this.s[2], jsbi_1.default.BigInt(t)));
        this.s[3] = jsbi_1.default.asUintN(64, rotl(this.s[3], 45));
        return result;
    }
}
exports.default = Xoshiro;
//# sourceMappingURL=xoshiro.js.map