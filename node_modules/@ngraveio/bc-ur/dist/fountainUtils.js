"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseFragments = exports.shuffle = exports.chooseDegree = void 0;
const utils_1 = require("./utils");
const xoshiro_1 = __importDefault(require("./xoshiro"));
const randomSampler = require('@apocentre/alias-sampling');
const chooseDegree = (seqLenth, rng) => {
    const degreeProbabilities = [...new Array(seqLenth)].map((_, index) => 1 / (index + 1));
    const degreeChooser = randomSampler(degreeProbabilities, null, rng.nextDouble);
    return degreeChooser.next() + 1;
};
exports.chooseDegree = chooseDegree;
const shuffle = (items, rng) => {
    let remaining = [...items];
    let result = [];
    while (remaining.length > 0) {
        let index = rng.nextInt(0, remaining.length - 1);
        let item = remaining[index];
        // remaining.erase(remaining.begin() + index);
        remaining.splice(index, 1);
        result.push(item);
    }
    return result;
};
exports.shuffle = shuffle;
const chooseFragments = (seqNum, seqLength, checksum) => {
    // The first `seqLenth` parts are the "pure" fragments, not mixed with any
    // others. This means that if you only generate the first `seqLenth` parts,
    // then you have all the parts you need to decode the message.
    if (seqNum <= seqLength) {
        return [seqNum - 1];
    }
    else {
        const seed = Buffer.concat([utils_1.intToBytes(seqNum), utils_1.intToBytes(checksum)]);
        const rng = new xoshiro_1.default(seed);
        const degree = exports.chooseDegree(seqLength, rng);
        const indexes = [...new Array(seqLength)].map((_, index) => index);
        const shuffledIndexes = exports.shuffle(indexes, rng);
        return shuffledIndexes.slice(0, degree);
    }
};
exports.chooseFragments = chooseFragments;
//# sourceMappingURL=fountainUtils.js.map