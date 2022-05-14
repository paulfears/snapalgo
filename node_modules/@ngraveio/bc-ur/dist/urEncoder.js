"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fountainEncoder_1 = __importDefault(require("./fountainEncoder"));
const bytewords_1 = __importDefault(require("./bytewords"));
class UREncoder {
    constructor(_ur, maxFragmentLength, firstSeqNum, minFragmentLength) {
        this.ur = _ur;
        this.fountainEncoder = new fountainEncoder_1.default(_ur.cbor, maxFragmentLength, firstSeqNum, minFragmentLength);
    }
    get fragmentsLength() { return this.fountainEncoder.fragmentsLength; }
    get fragments() { return this.fountainEncoder.fragments; }
    get messageLength() { return this.fountainEncoder.messageLength; }
    get cbor() { return this.ur.cbor; }
    encodeWhole() {
        return [...new Array(this.fragmentsLength)].map(() => this.nextPart());
    }
    nextPart() {
        const part = this.fountainEncoder.nextPart();
        if (this.fountainEncoder.isSinglePart()) {
            return UREncoder.encodeSinglePart(this.ur);
        }
        else {
            return UREncoder.encodePart(this.ur.type, part);
        }
    }
    static encodeUri(scheme, pathComponents) {
        const path = pathComponents.join('/');
        return [scheme, path].join(':');
    }
    static encodeUR(pathComponents) {
        return UREncoder.encodeUri('ur', pathComponents);
    }
    static encodePart(type, part) {
        const seq = `${part.seqNum}-${part.seqLength}`;
        const body = bytewords_1.default.encode(part.cbor().toString('hex'), bytewords_1.default.STYLES.MINIMAL);
        return UREncoder.encodeUR([type, seq, body]);
    }
    static encodeSinglePart(ur) {
        const body = bytewords_1.default.encode(ur.cbor.toString('hex'), bytewords_1.default.STYLES.MINIMAL);
        return UREncoder.encodeUR([ur.type, body]);
    }
}
exports.default = UREncoder;
//# sourceMappingURL=urEncoder.js.map