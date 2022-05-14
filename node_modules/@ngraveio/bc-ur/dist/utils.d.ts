/// <reference types="node" />
export declare const sha256Hash: (data: Buffer | string) => Buffer;
export declare const partition: (s: string, n: number) => string[];
export declare const split: (s: Buffer, length: number) => [Buffer, Buffer];
export declare const getCRC: (message: Buffer) => number;
export declare const getCRCHex: (message: Buffer) => string;
export declare const toUint32: (number: number) => number;
export declare const intToBytes: (num: number) => Buffer;
export declare const isURType: (type: string) => boolean;
export declare const hasPrefix: (s: string, prefix: string) => boolean;
export declare const arraysEqual: (ar1: any[], ar2: any[]) => boolean;
/**
 * Checks if ar1 contains all elements of ar2
 * @param ar1 the outer array
 * @param ar2 the array to be contained in ar1
 */
export declare const arrayContains: (ar1: any[], ar2: any[]) => boolean;
/**
 * Returns the difference array of  `ar1` - `ar2`
 */
export declare const setDifference: (ar1: any[], ar2: any[]) => any[];
export declare const bufferXOR: (a: Buffer, b: Buffer) => Buffer;
