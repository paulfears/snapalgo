"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidChecksumError = exports.InvalidSequenceComponentError = exports.InvalidTypeError = exports.InvalidPathLengthError = exports.InvalidSchemeError = void 0;
class InvalidSchemeError extends Error {
    constructor() {
        super('Invalid Scheme');
        this.name = 'InvalidSchemeError';
    }
}
exports.InvalidSchemeError = InvalidSchemeError;
class InvalidPathLengthError extends Error {
    constructor() {
        super('Invalid Path');
        this.name = 'InvalidPathLengthError';
    }
}
exports.InvalidPathLengthError = InvalidPathLengthError;
class InvalidTypeError extends Error {
    constructor() {
        super('Invalid Type');
        this.name = 'InvalidTypeError';
    }
}
exports.InvalidTypeError = InvalidTypeError;
class InvalidSequenceComponentError extends Error {
    constructor() {
        super('Invalid Sequence Component');
        this.name = 'InvalidSequenceComponentError';
    }
}
exports.InvalidSequenceComponentError = InvalidSequenceComponentError;
class InvalidChecksumError extends Error {
    constructor() {
        super('Invalid Checksum');
        this.name = 'InvalidChecksumError';
    }
}
exports.InvalidChecksumError = InvalidChecksumError;
//# sourceMappingURL=errors.js.map