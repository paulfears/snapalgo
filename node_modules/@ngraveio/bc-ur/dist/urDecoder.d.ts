import FountainDecoder from './fountainDecoder';
import UR from './ur';
export default class URDecoder {
    private fountainDecoder;
    type: string;
    private expected_type;
    private result;
    private error;
    constructor(fountainDecoder?: FountainDecoder, type?: string);
    private static decodeBody;
    private validatePart;
    static decode(message: string): UR;
    static parse(message: string): [string, string[]];
    static parseSequenceComponent(s: string): number[];
    receivePart(s: string): boolean;
    resultUR(): UR;
    isComplete(): boolean;
    isSuccess(): boolean;
    isError(): boolean;
    resultError(): string;
    expectedPartCount(): number;
    expectedPartIndexes(): number[];
    receivedPartIndexes(): number[];
    lastPartIndexes(): number[];
    estimatedPercentComplete(): number;
    getProgress(): number;
}
