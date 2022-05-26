# 4.0.0
__changed__
- *BREAKING*: Change the return type of `entropyToMnemonic` and `generateMnemonic` from `string` to `Buffer` (#1)
- Add support for passing in mnemonic as a `Buffer` to `mnemonicToSeedSync` and `mnemonicToEntropy` (#1)
  - Note that the `Buffer` must contain an NFKD normalized mnemonic. This will not work correctly if the mnemonic is improperly normalized.
- Rename this package to `@metamask/bip39` so that we can publish it as a fork of `bip39` (#2)

# 3.0.0
__added__
- Added TypeScript support (#104)
- Added support for excluding wordlists from packages (#105)

__changed__
- Changed `mnemonicToSeed` to use async, sync version moved to `mnemonicToSeedSync` (#104)

__removed__
- Removed explicit hex methods (use `toString('hex')` on the Buffer) (#104)

# 2.3.1

__breaking changes__

9-letter mnemonics can no longer be geerated and calling `validateMnemonic` will always return false. This was [fixed in the BIP as a patch](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#generating-the-mnemonic), so we had to follow suite.
