"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FountainEncoderPart = void 0;
const assert_1 = __importDefault(require("assert"));
const utils_1 = require("./utils");
const fountainUtils_1 = require("./fountainUtils");
const cbor_1 = require("./cbor");
class FountainEncoderPart {
    constructor(_seqNum, _seqLength, _messageLength, _checksum, _fragment) {
        this._seqNum = _seqNum;
        this._seqLength = _seqLength;
        this._messageLength = _messageLength;
        this._checksum = _checksum;
        this._fragment = _fragment;
    }
    get messageLength() { return this._messageLength; }
    get fragment() { return this._fragment; }
    get seqNum() { return this._seqNum; }
    get seqLength() { return this._seqLength; }
    get checksum() { return this._checksum; }
    cbor() {
        const result = cbor_1.cborEncode([
            this._seqNum,
            this._seqLength,
            this._messageLength,
            this._checksum,
            this._fragment
        ]);
        return Buffer.from(result);
    }
    description() {
        return `seqNum:${this._seqNum}, seqLen:${this._seqLength}, messageLen:${this._messageLength}, checksum:${this._checksum}, data:${this._fragment.toString('hex')}`;
    }
    static fromCBOR(cborPayload) {
        const [seqNum, seqLength, messageLength, checksum, fragment,] = cbor_1.cborDecode(cborPayload);
        assert_1.default(typeof seqNum === 'number');
        assert_1.default(typeof seqLength === 'number');
        assert_1.default(typeof messageLength === 'number');
        assert_1.default(typeof checksum === 'number');
        assert_1.default(Buffer.isBuffer(fragment) && fragment.length > 0);
        return new FountainEncoderPart(seqNum, seqLength, messageLength, checksum, Buffer.from(fragment));
    }
}
exports.FountainEncoderPart = FountainEncoderPart;
class FountainEncoder {
    constructor(message, maxFragmentLength = 100, firstSeqNum = 0, minFragmentLength = 10) {
        const fragmentLength = FountainEncoder.findNominalFragmentLength(message.length, minFragmentLength, maxFragmentLength);
        this._messageLength = message.length;
        this._fragments = FountainEncoder.partitionMessage(message, fragmentLength);
        this.fragmentLength = fragmentLength;
        this.seqNum = utils_1.toUint32(firstSeqNum);
        this.checksum = utils_1.getCRC(message);
    }
    get fragmentsLength() { return this._fragments.length; }
    get fragments() { return this._fragments; }
    get messageLength() { return this._messageLength; }
    isComplete() {
        return this.seqNum >= this._fragments.length;
    }
    isSinglePart() {
        return this._fragments.length === 1;
    }
    seqLength() {
        return this._fragments.length;
    }
    mix(indexes) {
        return indexes.reduce((result, index) => utils_1.bufferXOR(this._fragments[index], result), Buffer.alloc(this.fragmentLength, 0));
    }
    nextPart() {
        this.seqNum = utils_1.toUint32(this.seqNum + 1);
        const indexes = fountainUtils_1.chooseFragments(this.seqNum, this._fragments.length, this.checksum);
        const mixed = this.mix(indexes);
        return new FountainEncoderPart(this.seqNum, this._fragments.length, this._messageLength, this.checksum, mixed);
    }
    static findNominalFragmentLength(messageLength, minFragmentLength, maxFragmentLength) {
        assert_1.default(messageLength > 0);
        assert_1.default(minFragmentLength > 0);
        assert_1.default(maxFragmentLength >= minFragmentLength);
        const maxFragmentCount = Math.ceil(messageLength / minFragmentLength);
        let fragmentLength = 0;
        for (let fragmentCount = 1; fragmentCount <= maxFragmentCount; fragmentCount++) {
            fragmentLength = Math.ceil(messageLength / fragmentCount);
            if (fragmentLength <= maxFragmentLength) {
                break;
            }
        }
        return fragmentLength;
    }
    static partitionMessage(message, fragmentLength) {
        let remaining = Buffer.from(message);
        let fragment;
        let _fragments = [];
        while (remaining.length > 0) {
            [fragment, remaining] = utils_1.split(remaining, -fragmentLength);
            fragment = Buffer
                .alloc(fragmentLength, 0) // initialize with 0's to achieve the padding
                .fill(fragment, 0, fragment.length);
            _fragments.push(fragment);
        }
        return _fragments;
    }
}
exports.default = FountainEncoder;
//# sourceMappingURL=fountainEncoder.js.map