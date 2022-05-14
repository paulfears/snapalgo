"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fountainDecoder_1 = __importDefault(require("./fountainDecoder"));
const bytewords_1 = __importDefault(require("./bytewords"));
const assert_1 = __importDefault(require("assert"));
const utils_1 = require("./utils");
const errors_1 = require("./errors");
const ur_1 = __importDefault(require("./ur"));
const fountainEncoder_1 = require("./fountainEncoder");
class URDecoder {
    constructor(fountainDecoder = new fountainDecoder_1.default(), type = 'bytes') {
        this.fountainDecoder = fountainDecoder;
        this.type = type;
        assert_1.default(utils_1.isURType(type), 'Invalid UR type');
        this.expected_type = '';
    }
    static decodeBody(type, message) {
        const cbor = bytewords_1.default.decode(message, bytewords_1.default.STYLES.MINIMAL);
        return new ur_1.default(Buffer.from(cbor, 'hex'), type);
    }
    validatePart(type) {
        if (this.expected_type) {
            return this.expected_type === type;
        }
        if (!utils_1.isURType(type)) {
            return false;
        }
        this.expected_type = type;
        return true;
    }
    static decode(message) {
        const [type, components] = this.parse(message);
        if (components.length === 0) {
            throw new errors_1.InvalidPathLengthError();
        }
        const body = components[0];
        return URDecoder.decodeBody(type, body);
    }
    static parse(message) {
        const lowercase = message.toLowerCase();
        const prefix = lowercase.slice(0, 3);
        if (prefix !== 'ur:') {
            throw new errors_1.InvalidSchemeError();
        }
        const components = lowercase.slice(3).split('/');
        const type = components[0];
        if (components.length < 2) {
            throw new errors_1.InvalidPathLengthError();
        }
        if (!utils_1.isURType(type)) {
            throw new errors_1.InvalidTypeError();
        }
        return [type, components.slice(1)];
    }
    static parseSequenceComponent(s) {
        const components = s.split('-');
        if (components.length !== 2) {
            throw new errors_1.InvalidSequenceComponentError();
        }
        const seqNum = utils_1.toUint32(Number(components[0]));
        const seqLength = Number(components[1]);
        if (seqNum < 1 || seqLength < 1) {
            throw new errors_1.InvalidSequenceComponentError();
        }
        return [seqNum, seqLength];
    }
    receivePart(s) {
        if (this.result !== undefined) {
            return false;
        }
        const [type, components] = URDecoder.parse(s);
        if (!this.validatePart(type)) {
            return false;
        }
        // If this is a single-part UR then we're done
        if (components.length === 1) {
            this.result = URDecoder.decodeBody(type, components[0]);
            return true;
        }
        if (components.length !== 2) {
            throw new errors_1.InvalidPathLengthError();
        }
        const [seq, fragment] = components;
        const [seqNum, seqLength] = URDecoder.parseSequenceComponent(seq);
        const cbor = bytewords_1.default.decode(fragment, bytewords_1.default.STYLES.MINIMAL);
        const part = fountainEncoder_1.FountainEncoderPart.fromCBOR(cbor);
        if (seqNum !== part.seqNum || seqLength !== part.seqLength) {
            return false;
        }
        if (!this.fountainDecoder.receivePart(part)) {
            return false;
        }
        if (this.fountainDecoder.isSuccess()) {
            this.result = new ur_1.default(this.fountainDecoder.resultMessage(), type);
        }
        else if (this.fountainDecoder.isFailure()) {
            this.error = new errors_1.InvalidSchemeError();
        }
        return true;
    }
    resultUR() {
        return this.result ? this.result : new ur_1.default(Buffer.from([]));
    }
    isComplete() {
        return this.result && this.result.cbor.length > 0;
    }
    isSuccess() {
        return !this.error && this.isComplete();
    }
    isError() {
        return this.error !== undefined;
    }
    resultError() {
        return this.error ? this.error.message : '';
    }
    expectedPartCount() {
        return this.fountainDecoder.expectedPartCount();
    }
    expectedPartIndexes() {
        return this.fountainDecoder.getExpectedPartIndexes();
    }
    receivedPartIndexes() {
        return this.fountainDecoder.getReceivedPartIndexes();
    }
    lastPartIndexes() {
        return this.fountainDecoder.getLastPartIndexes();
    }
    estimatedPercentComplete() {
        return this.fountainDecoder.estimatedPercentComplete();
    }
    getProgress() {
        return this.fountainDecoder.getProgress();
    }
}
exports.default = URDecoder;
//# sourceMappingURL=urDecoder.js.map