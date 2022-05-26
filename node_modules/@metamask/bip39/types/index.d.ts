/// <reference types="node" />
export declare function mnemonicToSeedSync(mnemonic: string | Buffer, password?: string): Buffer;
export declare function mnemonicToSeed(mnemonic: string, password?: string): Promise<Buffer>;
export declare function mnemonicToEntropy(mnemonic: string | Buffer, wordlist?: string[]): string;
export declare function entropyToMnemonic(entropy: Buffer | string, wordlist?: string[]): Buffer;
export declare function generateMnemonic(strength?: number, rng?: (size: number) => Buffer, wordlist?: string[]): Buffer;
export declare function validateMnemonic(mnemonic: string, wordlist?: string[]): boolean;
export declare function setDefaultWordlist(language: string): void;
export declare function getDefaultWordlist(): string;
export { wordlists } from './_wordlists';
