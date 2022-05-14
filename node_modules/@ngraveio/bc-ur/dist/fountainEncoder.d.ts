/// <reference types="node" />
export declare class FountainEncoderPart {
    private _seqNum;
    private _seqLength;
    private _messageLength;
    private _checksum;
    private _fragment;
    constructor(_seqNum: number, _seqLength: number, _messageLength: number, _checksum: number, _fragment: Buffer);
    get messageLength(): number;
    get fragment(): Buffer;
    get seqNum(): number;
    get seqLength(): number;
    get checksum(): number;
    cbor(): Buffer;
    description(): string;
    static fromCBOR(cborPayload: string | Buffer): FountainEncoderPart;
}
export default class FountainEncoder {
    private _messageLength;
    private _fragments;
    private fragmentLength;
    private seqNum;
    private checksum;
    constructor(message: Buffer, maxFragmentLength?: number, firstSeqNum?: number, minFragmentLength?: number);
    get fragmentsLength(): number;
    get fragments(): Buffer[];
    get messageLength(): number;
    isComplete(): boolean;
    isSinglePart(): boolean;
    seqLength(): number;
    mix(indexes: number[]): Buffer;
    nextPart(): FountainEncoderPart;
    static findNominalFragmentLength(messageLength: number, minFragmentLength: number, maxFragmentLength: number): number;
    static partitionMessage(message: Buffer, fragmentLength: number): Buffer[];
}
