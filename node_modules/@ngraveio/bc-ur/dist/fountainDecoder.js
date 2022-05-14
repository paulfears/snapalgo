"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FountainDecoderPart = void 0;
const utils_1 = require("./utils");
const fountainUtils_1 = require("./fountainUtils");
const errors_1 = require("./errors");
class FountainDecoderPart {
    constructor(_indexes, _fragment) {
        this._indexes = _indexes;
        this._fragment = _fragment;
    }
    get indexes() { return this._indexes; }
    get fragment() { return this._fragment; }
    static fromEncoderPart(encoderPart) {
        const indexes = fountainUtils_1.chooseFragments(encoderPart.seqNum, encoderPart.seqLength, encoderPart.checksum);
        const fragment = encoderPart.fragment;
        return new FountainDecoderPart(indexes, fragment);
    }
    isSimple() {
        return this.indexes.length === 1;
    }
}
exports.FountainDecoderPart = FountainDecoderPart;
class FountainDecoder {
    constructor() {
        this.result = undefined;
        this.expectedMessageLength = 0;
        this.expectedChecksum = 0;
        this.expectedFragmentLength = 0;
        this.processedPartsCount = 0;
        this.expectedPartIndexes = [];
        this.lastPartIndexes = [];
        this.queuedParts = [];
        this.receivedPartIndexes = [];
        this.mixedParts = [];
        this.simpleParts = [];
    }
    validatePart(part) {
        // If this is the first part we've seen
        if (this.expectedPartIndexes.length === 0) {
            // Record the things that all the other parts we see will have to match to be valid.
            [...new Array(part.seqLength)]
                .forEach((_, index) => this.expectedPartIndexes.push(index));
            this.expectedMessageLength = part.messageLength;
            this.expectedChecksum = part.checksum;
            this.expectedFragmentLength = part.fragment.length;
        }
        else {
            // If this part's values don't match the first part's values, throw away the part
            if (this.expectedPartIndexes.length !== part.seqLength) {
                return false;
            }
            if (this.expectedMessageLength !== part.messageLength) {
                return false;
            }
            if (this.expectedChecksum !== part.checksum) {
                return false;
            }
            if (this.expectedFragmentLength !== part.fragment.length) {
                return false;
            }
        }
        // This part should be processed
        return true;
    }
    reducePartByPart(a, b) {
        // If the fragments mixed into `b` are a strict (proper) subset of those in `a`...
        if (utils_1.arrayContains(a.indexes, b.indexes)) {
            const newIndexes = utils_1.setDifference(a.indexes, b.indexes);
            const newFragment = utils_1.bufferXOR(a.fragment, b.fragment);
            return new FountainDecoderPart(newIndexes, newFragment);
        }
        else {
            // `a` is not reducable by `b`, so return a
            return a;
        }
    }
    reduceMixedBy(part) {
        const newMixed = [];
        this.mixedParts
            .map(({ value: mixedPart }) => this.reducePartByPart(mixedPart, part))
            .forEach(reducedPart => {
            if (reducedPart.isSimple()) {
                this.queuedParts.push(reducedPart);
            }
            else {
                newMixed.push({ key: reducedPart.indexes, value: reducedPart });
            }
        });
        this.mixedParts = newMixed;
    }
    processSimplePart(part) {
        // Don't process duplicate parts
        const fragmentIndex = part.indexes[0];
        if (this.receivedPartIndexes.includes(fragmentIndex)) {
            return;
        }
        this.simpleParts.push({ key: part.indexes, value: part });
        this.receivedPartIndexes.push(fragmentIndex);
        // If we've received all the parts
        if (utils_1.arraysEqual(this.receivedPartIndexes, this.expectedPartIndexes)) {
            // Reassemble the message from its fragments
            const sortedParts = this.simpleParts
                .map(({ value }) => value)
                .sort((a, b) => (a.indexes[0] - b.indexes[0]));
            const message = FountainDecoder.joinFragments(sortedParts.map(part => part.fragment), this.expectedMessageLength);
            const checksum = utils_1.getCRC(message);
            if (checksum === this.expectedChecksum) {
                this.result = message;
            }
            else {
                this.error = new errors_1.InvalidChecksumError();
            }
        }
        else {
            this.reduceMixedBy(part);
        }
    }
    processMixedPart(part) {
        // Don't process duplicate parts
        if (this.mixedParts.some(({ key: indexes }) => utils_1.arraysEqual(indexes, part.indexes))) {
            return;
        }
        // Reduce this part by all the others
        let p2 = this.simpleParts.reduce((acc, { value: p }) => this.reducePartByPart(acc, p), part);
        p2 = this.mixedParts.reduce((acc, { value: p }) => this.reducePartByPart(acc, p), p2);
        // If the part is now simple
        if (p2.isSimple()) {
            // Add it to the queue
            this.queuedParts.push(p2);
        }
        else {
            this.reduceMixedBy(p2);
            this.mixedParts.push({ key: p2.indexes, value: p2 });
        }
    }
    processQueuedItem() {
        if (this.queuedParts.length === 0) {
            return;
        }
        const part = this.queuedParts.shift();
        if (part.isSimple()) {
            this.processSimplePart(part);
        }
        else {
            this.processMixedPart(part);
        }
    }
    receivePart(encoderPart) {
        if (this.isComplete()) {
            return false;
        }
        if (!this.validatePart(encoderPart)) {
            return false;
        }
        const decoderPart = FountainDecoderPart.fromEncoderPart(encoderPart);
        this.lastPartIndexes = decoderPart.indexes;
        this.queuedParts.push(decoderPart);
        while (!this.isComplete() && this.queuedParts.length > 0) {
            this.processQueuedItem();
        }
        ;
        this.processedPartsCount += 1;
        return true;
    }
    isComplete() {
        return Boolean(this.result !== undefined && this.result.length > 0);
    }
    isSuccess() {
        return Boolean(this.error === undefined && this.isComplete());
    }
    resultMessage() {
        return this.isSuccess() ? this.result : Buffer.from([]);
    }
    isFailure() {
        return this.error !== undefined;
    }
    resultError() {
        return this.error ? this.error.message : '';
    }
    expectedPartCount() {
        return this.expectedPartIndexes.length;
    }
    getExpectedPartIndexes() {
        return [...this.expectedPartIndexes];
    }
    getReceivedPartIndexes() {
        return [...this.receivedPartIndexes];
    }
    getLastPartIndexes() {
        return [...this.lastPartIndexes];
    }
    estimatedPercentComplete() {
        if (this.isComplete()) {
            return 1;
        }
        const expectedPartCount = this.expectedPartCount();
        if (expectedPartCount === 0) {
            return 0;
        }
        // We multiply the expectedPartCount by `1.75` as a way to compensate for the facet
        // that `this.processedPartsCount` also tracks the duplicate parts that have been
        // processeed.
        return Math.min(0.99, this.processedPartsCount / (expectedPartCount * 1.75));
    }
    getProgress() {
        if (this.isComplete()) {
            return 1;
        }
        const expectedPartCount = this.expectedPartCount();
        if (expectedPartCount === 0) {
            return 0;
        }
        return this.receivedPartIndexes.length / expectedPartCount;
    }
}
exports.default = FountainDecoder;
FountainDecoder.joinFragments = (fragments, messageLength) => {
    return Buffer.concat(fragments).slice(0, messageLength);
};
//# sourceMappingURL=fountainDecoder.js.map