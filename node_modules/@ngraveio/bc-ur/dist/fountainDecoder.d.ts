/// <reference types="node" />
import { FountainEncoderPart } from "./fountainEncoder";
export declare class FountainDecoderPart {
    private _indexes;
    private _fragment;
    constructor(_indexes: number[], _fragment: Buffer);
    get indexes(): number[];
    get fragment(): Buffer;
    static fromEncoderPart(encoderPart: FountainEncoderPart): FountainDecoderPart;
    isSimple(): boolean;
}
declare type PartIndexes = number[];
export default class FountainDecoder {
    private error;
    private result;
    private expectedMessageLength;
    private expectedChecksum;
    private expectedFragmentLength;
    private processedPartsCount;
    private expectedPartIndexes;
    private lastPartIndexes;
    private queuedParts;
    private receivedPartIndexes;
    private mixedParts;
    private simpleParts;
    private validatePart;
    private reducePartByPart;
    private reduceMixedBy;
    private processSimplePart;
    private processMixedPart;
    private processQueuedItem;
    static joinFragments: (fragments: Buffer[], messageLength: number) => Buffer;
    receivePart(encoderPart: FountainEncoderPart): boolean;
    isComplete(): boolean;
    isSuccess(): boolean;
    resultMessage(): Buffer;
    isFailure(): boolean;
    resultError(): string;
    expectedPartCount(): number;
    getExpectedPartIndexes(): PartIndexes;
    getReceivedPartIndexes(): PartIndexes;
    getLastPartIndexes(): PartIndexes;
    estimatedPercentComplete(): number;
    getProgress(): number;
}
export {};
