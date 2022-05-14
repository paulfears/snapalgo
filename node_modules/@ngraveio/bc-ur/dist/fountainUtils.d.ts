import Xoshiro from "./xoshiro";
export declare const chooseDegree: (seqLenth: number, rng: Xoshiro) => number;
export declare const shuffle: (items: any[], rng: Xoshiro) => any[];
export declare const chooseFragments: (seqNum: number, seqLength: number, checksum: number) => number[];
